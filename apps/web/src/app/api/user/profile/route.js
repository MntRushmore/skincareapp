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

// Get user profile
export async function GET(request) {
  try {
    const userId = await getUserId(request);

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rows = await sql`
      SELECT * FROM user_profiles 
      WHERE user_id = ${userId}
    `;

    if (rows.length === 0) {
      // Auto-create profile for new users
      console.log("Auto-creating profile for user:", userId);
      try {
        const session = await auth();
        const userName = session?.user?.name || "User";

        const newProfile = await sql`
          INSERT INTO user_profiles (user_id, full_name)
          VALUES (${userId}, ${userName})
          RETURNING *
        `;

        // Also create preferences
        await sql`
          INSERT INTO user_preferences (user_id)
          VALUES (${userId})
          ON CONFLICT (user_id) DO NOTHING
        `;

        console.log("Profile auto-created successfully");
        return Response.json(newProfile[0]);
      } catch (createError) {
        console.error("Error auto-creating profile:", createError);
        // Return default empty profile if creation fails
        return Response.json({
          user_id: userId,
          full_name: null,
          profile_photo_url: null,
          skin_type: null,
          skin_concerns: [],
          age_range: null,
        });
      }
    }

    return Response.json(rows[0]);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return Response.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

// Create or update user profile
export async function POST(request) {
  try {
    const userId = await getUserId(request);

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const {
      full_name,
      profile_photo_url,
      skin_type,
      skin_concerns,
      age_range,
    } = body;

    // Check if profile exists
    const existing = await sql`
      SELECT id FROM user_profiles WHERE user_id = ${userId}
    `;

    let result;

    if (existing.length === 0) {
      // Create new profile
      result = await sql`
        INSERT INTO user_profiles (
          user_id, full_name, profile_photo_url, skin_type, skin_concerns, age_range
        ) VALUES (
          ${userId}, ${full_name || null}, ${profile_photo_url || null}, 
          ${skin_type || null}, ${skin_concerns || []}, ${age_range || null}
        )
        RETURNING *
      `;
    } else {
      // Update existing profile
      const updates = [];
      const values = [];
      let paramCount = 1;

      if (full_name !== undefined) {
        updates.push(`full_name = $${paramCount++}`);
        values.push(full_name);
      }
      if (profile_photo_url !== undefined) {
        updates.push(`profile_photo_url = $${paramCount++}`);
        values.push(profile_photo_url);
      }
      if (skin_type !== undefined) {
        updates.push(`skin_type = $${paramCount++}`);
        values.push(skin_type);
      }
      if (skin_concerns !== undefined) {
        updates.push(`skin_concerns = $${paramCount++}`);
        values.push(skin_concerns);
      }
      if (age_range !== undefined) {
        updates.push(`age_range = $${paramCount++}`);
        values.push(age_range);
      }

      updates.push(`updated_at = NOW()`);
      values.push(userId);

      result = await sql(
        `UPDATE user_profiles SET ${updates.join(", ")} WHERE user_id = $${paramCount} RETURNING *`,
        values,
      );
    }

    return Response.json(result[0]);
  } catch (error) {
    console.error("Error saving user profile:", error);
    return Response.json({ error: "Failed to save profile" }, { status: 500 });
  }
}
