import sql from "@/app/api/utils/sql";

const ACTIVE_EVENTS = new Set([
  "INITIAL_PURCHASE",
  "RENEWAL",
  "UNCANCELLATION",
  "NON_RENEWING_PURCHASE",
  "PRODUCT_CHANGE",
  "SUBSCRIPTION_EXTENDED",
  "TEMPORARY_ENTITLEMENT_GRANT",
]);

function isAuthorized(request) {
  const expected = process.env.REVENUECAT_WEBHOOK_AUTHORIZATION;
  if (!expected) return false;
  const header = request.headers.get("authorization") || "";
  return header === expected || header === `Bearer ${expected}`;
}

/**
 * RevenueCat dashboard webhook. Set the authorization header value to
 * REVENUECAT_WEBHOOK_AUTHORIZATION. The app calls Purchases.logIn with the
 * database user id, which arrives here as event.app_user_id.
 *
 * CANCELLATION is ignored on purpose: the subscriber still has access until
 * EXPIRATION.
 */
export async function POST(request) {
  if (!process.env.REVENUECAT_WEBHOOK_AUTHORIZATION) {
    return Response.json(
      {
        error:
          "REVENUECAT_WEBHOOK_AUTHORIZATION is not set. Refusing webhook updates.",
      },
      { status: 501 },
    );
  }

  if (!isAuthorized(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const event = body?.event || {};
    const userId = event.app_user_id;
    const type = event.type;

    if (!userId || String(userId).startsWith("$RCAnonymous")) {
      return Response.json({ ok: true, ignored: "anonymous" });
    }

    let subscriptionStatus;
    if (ACTIVE_EVENTS.has(type)) {
      subscriptionStatus = "active";
    } else if (type === "EXPIRATION") {
      subscriptionStatus = "expired";
    } else {
      return Response.json({ ok: true, ignored: type || "unknown" });
    }

    if (!process.env.DATABASE_URL) {
      return Response.json(
        { error: "DATABASE_URL is not set" },
        { status: 500 },
      );
    }

    await sql`
      UPDATE auth_users
      SET subscription_status = ${subscriptionStatus},
          last_check_subscription_status_at = NOW()
      WHERE id = ${userId}
    `;

    return Response.json({ ok: true, status: subscriptionStatus });
  } catch (error) {
    console.error("[RevenueCat webhook] failed:", error);
    return Response.json(
      { error: "Failed to apply subscription update" },
      { status: 500 },
    );
  }
}
