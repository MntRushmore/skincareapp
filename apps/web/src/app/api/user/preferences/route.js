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

// Get user preferences
export async function GET(request) {
  try {
    const userId = await getUserId(request);

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rows = await sql`
      SELECT * FROM user_preferences 
      WHERE user_id = ${userId}
    `;

    if (rows.length === 0) {
      // Return defaults if none exist
      return Response.json({
        user_id: userId,
        notifications_enabled: true,
        newsletter_subscribed: false,
        theme: "light",
      });
    }

    return Response.json(rows[0]);
  } catch (error) {
    console.error("Error fetching user preferences:", error);
    return Response.json(
      { error: "Failed to fetch preferences" },
      { status: 500 },
    );
  }
}

// Update user preferences
export async function POST(request) {
  try {
    const userId = await getUserId(request);

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const { notifications_enabled, newsletter_subscribed, theme } = body;

    // Check if preferences exist
    const existing = await sql`
      SELECT id FROM user_preferences WHERE user_id = ${userId}
    `;

    let result;

    if (existing.length === 0) {
      // Create new preferences
      result = await sql`
        INSERT INTO user_preferences (
          user_id, notifications_enabled, newsletter_subscribed, theme
        ) VALUES (
          ${userId}, ${notifications_enabled ?? true}, 
          ${newsletter_subscribed ?? false}, ${theme || "light"}
        )
        RETURNING *
      `;
    } else {
      // Update existing preferences
      const updates = [];
      const values = [];
      let paramCount = 1;

      if (notifications_enabled !== undefined) {
        updates.push(`notifications_enabled = $${paramCount++}`);
        values.push(notifications_enabled);
      }
      if (newsletter_subscribed !== undefined) {
        updates.push(`newsletter_subscribed = $${paramCount++}`);
        values.push(newsletter_subscribed);
      }
      if (theme !== undefined) {
        updates.push(`theme = $${paramCount++}`);
        values.push(theme);
      }

      updates.push(`updated_at = NOW()`);
      values.push(userId);

      result = await sql(
        `UPDATE user_preferences SET ${updates.join(", ")} WHERE user_id = $${paramCount} RETURNING *`,
        values,
      );
    }

    return Response.json(result[0]);
  } catch (error) {
    console.error("Error saving user preferences:", error);
    return Response.json(
      { error: "Failed to save preferences" },
      { status: 500 },
    );
  }
}
