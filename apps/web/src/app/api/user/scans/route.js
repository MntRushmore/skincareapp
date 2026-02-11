import { auth } from "@/auth";
import sql from "@/app/api/utils/sql";
import { jwtVerify } from "jose";

// Helper function to get user ID from either web session or mobile JWT
async function getUserId(request) {
  // Try web session first
  const session = await auth();
  if (session?.user?.id) {
    return session.user.id.toString();
  }

  // If no web session, check for mobile JWT token in Authorization header
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    try {
      const secret = new TextEncoder().encode(process.env.AUTH_SECRET);
      const { payload } = await jwtVerify(token, secret);
      return payload.sub.toString();
    } catch (jwtError) {
      console.error("JWT verification failed:", jwtError);
    }
  }

  return null;
}

// Get user's skin scans
export async function GET(request) {
  try {
    const userId = await getUserId(request);

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");

    const rows = await sql`
      SELECT * FROM skin_scans 
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT ${limit}
    `;

    return Response.json(rows);
  } catch (error) {
    console.error("Error fetching skin scans:", error);
    return Response.json({ error: "Failed to fetch scans" }, { status: 500 });
  }
}

// Create a new skin scan
export async function POST(request) {
  try {
    const userId = await getUserId(request);

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const {
      photo_url,
      skin_type,
      texture_analysis,
      concerns,
      recommendations,
      confidence_score,
    } = body;

    if (!photo_url) {
      return Response.json({ error: "Photo URL is required" }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO skin_scans (
        user_id, photo_url, skin_type, texture_analysis, 
        concerns, recommendations, confidence_score
      ) VALUES (
        ${userId}, ${photo_url}, ${skin_type || null}, 
        ${JSON.stringify(texture_analysis || {})}, 
        ${JSON.stringify(concerns || {})}, 
        ${JSON.stringify(recommendations || {})},
        ${confidence_score || null}
      )
      RETURNING *
    `;

    return Response.json(result[0]);
  } catch (error) {
    console.error("Error creating skin scan:", error);
    return Response.json({ error: "Failed to create scan" }, { status: 500 });
  }
}
