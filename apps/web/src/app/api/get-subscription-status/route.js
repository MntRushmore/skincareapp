import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";
import Stripe from "stripe";

export const POST = async (request) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const session = await auth();

  if (!session?.user?.email) {
    return Response.json({
      status: "unauthenticated",
      message: "User not logged in",
    });
  }

  try {
    const results = await sql`
      SELECT subscription_status, stripe_id, last_check_subscription_status_at
      FROM auth_users 
      WHERE email = ${session.user.email}
    `;

    if (!results.length) {
      return Response.json({
        status: "not_found",
        message: "User not found",
      });
    }

    const {
      subscription_status,
      stripe_id,
      last_check_subscription_status_at,
    } = results[0];

    // If we have a stripe ID but no status, or status is stale (>30 days), check with Stripe
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const isStatusStale =
      last_check_subscription_status_at &&
      new Date(last_check_subscription_status_at) < thirtyDaysAgo;

    if (stripe_id && (!subscription_status || isStatusStale)) {
      try {
        const customer = await stripe.customers.retrieve(stripe_id, {
          expand: ["subscriptions"],
        });

        if (customer?.subscriptions?.data[0]?.status) {
          const newStatus = customer.subscriptions.data[0].status;

          // Update our database with latest status from Stripe
          await sql`
            UPDATE auth_users 
            SET subscription_status = ${newStatus}, 
                last_check_subscription_status_at = NOW()
            WHERE email = ${session.user.email}
          `;

          return Response.json({
            status: newStatus,
            stripeId: stripe_id,
          });
        }
      } catch (error) {
        console.error("Error fetching from Stripe:", error);
      }
    }

    return Response.json({
      status: subscription_status || "none",
      stripeId: stripe_id,
    });
  } catch (error) {
    console.error("Error checking subscription status:", error);
    return Response.json(
      { error: "Failed to check subscription" },
      { status: 500 },
    );
  }
};
