import sql from "@/app/api/utils/sql";
import { getRequestUser } from "@/app/api/utils/session";
import Stripe from "stripe";

function hasAccess(status) {
  return status === "active" || status === "trialing";
}

export const POST = async (request) => {
  const user = await getRequestUser(request);

  if (!user?.id && !user?.email) {
    return Response.json({
      status: "unauthenticated",
      message: "User not logged in",
      hasAccess: false,
    });
  }

  try {
    const results = user.id
      ? await sql`
          SELECT subscription_status, stripe_id, last_check_subscription_status_at, email
          FROM auth_users
          WHERE id = ${user.id}
        `
      : await sql`
          SELECT subscription_status, stripe_id, last_check_subscription_status_at, email
          FROM auth_users
          WHERE email = ${user.email}
        `;

    if (!results.length) {
      return Response.json({
        status: "not_found",
        message: "User not found",
        hasAccess: false,
      });
    }

    const {
      subscription_status,
      stripe_id,
      last_check_subscription_status_at,
      email,
    } = results[0];

    // If we have a stripe ID but no status, or status is stale (>30 days), check with Stripe
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const isStatusStale =
      last_check_subscription_status_at &&
      new Date(last_check_subscription_status_at) < thirtyDaysAgo;

    if (
      stripe_id &&
      process.env.STRIPE_SECRET_KEY &&
      (!subscription_status || isStatusStale)
    ) {
      try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        const customer = await stripe.customers.retrieve(stripe_id, {
          expand: ["subscriptions"],
        });

        if (customer && !customer.deleted && customer.subscriptions?.data[0]?.status) {
          const newStatus = customer.subscriptions.data[0].status;

          // Update our database with latest status from Stripe
          await sql`
            UPDATE auth_users 
            SET subscription_status = ${newStatus}, 
                last_check_subscription_status_at = NOW()
            WHERE email = ${email}
          `;

          return Response.json({
            status: newStatus,
            stripeId: stripe_id,
            hasAccess: hasAccess(newStatus),
          });
        }
      } catch (error) {
        console.error("Error fetching from Stripe:", error);
      }
    }

    return Response.json({
      status: subscription_status || "none",
      stripeId: stripe_id,
      hasAccess: hasAccess(subscription_status),
    });
  } catch (error) {
    console.error("Error checking subscription status:", error);
    return Response.json(
      { error: "Failed to check subscription" },
      { status: 500 },
    );
  }
};
