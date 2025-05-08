import Stripe from 'stripe';


console.log("stripe key",process.env.STRIPE_SECRET_KEY )

interface stripe {
    apiVersion: string
}
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
});