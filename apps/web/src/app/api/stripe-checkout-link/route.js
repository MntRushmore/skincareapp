import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";
import Stripe from "stripe";

export const POST = async (request) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const session = await auth();

  try {
    const { redirectURL } = await request.json();
    const email = session?.user?.email;
    const userId = session?.user?.id;

    if (!email || !userId) {
      return Response.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Get current user's stripe_id
    const [user] = await sql`
      SELECT stripe_id FROM auth_users 
      WHERE id = ${userId}
    `;

    let stripeCustomerId = user?.stripe_id;

    if (!stripeCustomerId) {
      // Create new customer in Stripe
      const customer = await stripe.customers.create({ email });
      stripeCustomerId = customer.id;

      // Update user with stripe_id
      await sql`
        UPDATE auth_users 
        SET stripe_id = ${stripeCustomerId}
        WHERE id = ${userId}
      `;
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Premium Plan",
              description: "Unlimited skin scans per month",
            },
            recurring: { interval: "month" },
            unit_amount: 299, // $2.99
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${redirectURL}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: redirectURL,
    });

    return Response.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return Response.json(
      { error: "Failed to create checkout session" },
      { status: 500 },
    );
  }
};
