import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const userId = session.user.id.toString();

    // Check if profile already exists
    const existingProfile = await sql`
      SELECT id FROM user_profiles WHERE user_id = ${userId}
    `;

    if (existingProfile.length > 0) {
      return new Response(
        JSON.stringify({
          message: "Profile already exists",
          profile: existingProfile[0],
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Create profile with user's name
    const profile = await sql`
      INSERT INTO user_profiles (user_id, full_name)
      VALUES (${userId}, ${session.user.name || "User"})
      RETURNING *
    `;

    // Also create user preferences
    await sql`
      INSERT INTO user_preferences (user_id)
      VALUES (${userId})
      ON CONFLICT (user_id) DO NOTHING
    `;

    return new Response(
      JSON.stringify({
        success: true,
        profile: profile[0],
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Create profile error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to create profile",
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
