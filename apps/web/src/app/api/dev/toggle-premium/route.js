import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";
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

export const POST = async (request) => {
  const userId = await getUserId(request);

  if (!userId) {
    return Response.json({ error: "User not logged in" }, { status: 401 });
  }

  // Only allow in development mode
  if (
    process.env.ENV !== "development" &&
    process.env.NODE_ENV !== "development"
  ) {
    return Response.json(
      { error: "This endpoint is only available in development mode" },
      { status: 403 },
    );
  }

  try {
    // Get current subscription status
    const results = await sql`
      SELECT subscription_status
      FROM auth_users 
      WHERE id = ${userId}
    `;

    if (!results.length) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const currentStatus = results[0].subscription_status;

    // Toggle between active and none
    const newStatus = currentStatus === "active" ? null : "active";

    // Update the subscription status
    await sql`
      UPDATE auth_users 
      SET subscription_status = ${newStatus},
          last_check_subscription_status_at = NOW()
      WHERE id = ${userId}
    `;

    return Response.json({
      success: true,
      status: newStatus || "none",
      message:
        newStatus === "active"
          ? "Premium status activated (DEV MODE)"
          : "Premium status deactivated (DEV MODE)",
    });
  } catch (error) {
    console.error("Error toggling premium status:", error);
    return Response.json(
      { error: "Failed to toggle premium status" },
      { status: 500 },
    );
  }
};
