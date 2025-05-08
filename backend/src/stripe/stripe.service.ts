import { stripe } from "../common/services/stripe.services";
import UserSchema from "../user/user.schema";
export const createCheckoutSession = async (userId: string, priceId: string) => {

    const user = await UserSchema.findById(userId);

    if(!user) {
        throw new Error("User not found");
    }
    
    const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        customer: user.stripeCustomerId,
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        success_url: `https://yourapp.com/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `https://yourapp.com/cancel`,
      });
      return session;
  
    };