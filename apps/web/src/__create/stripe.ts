import Stripe from "stripe";

/**
 * Direct Stripe SDK. Routes construct `new Stripe(process.env.STRIPE_SECRET_KEY)`.
 * The previous Anything proxy has been removed.
 */
export default Stripe;
export { Stripe };
