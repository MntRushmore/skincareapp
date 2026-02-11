import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

const FREE_TIER_LIMIT = 5;

export const POST = async (request) => {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const userId = session.user.id;

    // Check if user has active subscription
    const [user] = await sql`
      SELECT subscription_status FROM auth_users 
      WHERE id = ${userId}
    `;

    const isPremium = user?.subscription_status === "active";

    // Premium users have unlimited scans
    if (isPremium) {
      return Response.json({
        canScan: true,
        isPremium: true,
        scansRemaining: -1, // unlimited
      });
    }

    // For free users, check monthly scan count
    const currentMonth = new Date().toISOString().slice(0, 7); // 'YYYY-MM'

    const [usage] = await sql`
      SELECT scan_count FROM user_scan_usage 
      WHERE user_id = ${userId} AND month_year = ${currentMonth}
    `;

    const currentCount = usage?.scan_count || 0;
    const canScan = currentCount < FREE_TIER_LIMIT;

    return Response.json({
      canScan,
      isPremium: false,
      scansUsed: currentCount,
      scansRemaining: FREE_TIER_LIMIT - currentCount,
      limit: FREE_TIER_LIMIT,
    });
  } catch (error) {
    console.error("Error checking scan limit:", error);
    return Response.json(
      { error: "Failed to check scan limit" },
      { status: 500 },
    );
  }
};

export const PUT = async (request) => {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const userId = session.user.id;
    const currentMonth = new Date().toISOString().slice(0, 7);

    // Increment scan count
    await sql`
      INSERT INTO user_scan_usage (user_id, month_year, scan_count, updated_at)
      VALUES (${userId}, ${currentMonth}, 1, NOW())
      ON CONFLICT (user_id, month_year)
      DO UPDATE SET 
        scan_count = user_scan_usage.scan_count + 1,
        updated_at = NOW()
    `;

    const [updated] = await sql`
      SELECT scan_count FROM user_scan_usage 
      WHERE user_id = ${userId} AND month_year = ${currentMonth}
    `;

    return Response.json({
      success: true,
      scansUsed: updated.scan_count,
      scansRemaining: FREE_TIER_LIMIT - updated.scan_count,
    });
  } catch (error) {
    console.error("Error incrementing scan count:", error);
    return Response.json(
      { error: "Failed to increment scan count" },
      { status: 500 },
    );
  }
};
