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

// Get a specific skin scan
export async function GET(request, { params }) {
  try {
    const userId = await getUserId(request);

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const scanId = params.id;

    const rows = await sql`
      SELECT * FROM skin_scans 
      WHERE id = ${scanId} AND user_id = ${userId}
    `;

    if (rows.length === 0) {
      return Response.json({ error: "Scan not found" }, { status: 404 });
    }

    return Response.json(rows[0]);
  } catch (error) {
    console.error("Error fetching skin scan:", error);
    return Response.json({ error: "Failed to fetch scan" }, { status: 500 });
  }
}

// Delete a skin scan
export async function DELETE(request, { params }) {
  try {
    const userId = await getUserId(request);

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const scanId = params.id;

    const result = await sql`
      DELETE FROM skin_scans 
      WHERE id = ${scanId} AND user_id = ${userId}
      RETURNING id
    `;

    if (result.length === 0) {
      return Response.json({ error: "Scan not found" }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error deleting skin scan:", error);
    return Response.json({ error: "Failed to delete scan" }, { status: 500 });
  }
}
