import { auth } from "@/auth";
import sql from "@/app/api/utils/sql";
import { jwtVerify } from "jose";

// Delete user account and all associated data
export async function DELETE(request) {
  try {
    console.log("DELETE /api/user/delete - Starting request");

    // Try web session first
    let session = await auth();
    let userId = session?.user?.id;

    // If no web session, check for mobile JWT token in Authorization header
    if (!userId) {
      const authHeader = request.headers.get("authorization");
      if (authHeader?.startsWith("Bearer ")) {
        const token = authHeader.substring(7);
        try {
          const secret = new TextEncoder().encode(process.env.AUTH_SECRET);
          const { payload } = await jwtVerify(token, secret);
          userId = payload.sub;
          console.log("Authenticated via JWT token");
        } catch (jwtError) {
          console.error("JWT verification failed:", jwtError);
        }
      }
    } else {
      console.log("Authenticated via web session");
    }

    console.log("Session:", userId ? "exists" : "null");

    if (!userId) {
      console.log("Unauthorized - no session or user ID");
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Convert userId to integer for database queries
    const userIdInt = parseInt(userId, 10);
    console.log("Deleting user:", userIdInt);

    // Delete all user data in a transaction
    const result = await sql.transaction([
      sql`DELETE FROM skin_scans WHERE user_id = ${userId}`,
      sql`DELETE FROM user_preferences WHERE user_id = ${userId}`,
      sql`DELETE FROM user_profiles WHERE user_id = ${userId}`,
      sql`DELETE FROM auth_sessions WHERE "userId" = ${userIdInt}`,
      sql`DELETE FROM auth_accounts WHERE "userId" = ${userIdInt}`,
      sql`DELETE FROM auth_users WHERE id = ${userIdInt}`,
    ]);

    console.log("Delete completed successfully");

    return new Response(
      JSON.stringify({
        success: true,
        message: "Account deleted successfully",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error deleting account:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to delete account",
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
