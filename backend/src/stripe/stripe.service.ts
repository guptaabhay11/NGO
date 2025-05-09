import { stripe } from "../common/services/stripe.services";
import userSchema from "../user/user.schema";
import mongoose from "mongoose";
import UserSchema from "../user/user.schema";
import { updateUser } from "../user/user.validation";
import fundSchemas from "../fund/fund.schemas";
export const createCheckoutSession = async (userId: string, priceId: string, fundId: string, interval: string) => {

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
        subscription_data: {
          metadata: {
            fundId,
            interval,
            userId 
          },
        },
        metadata: {
          fundId, 
        },
      
        success_url: `https://yourapp.com/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `https://yourapp.com/cancel`,
      });
      return session;
  
    };

    export const handlePaymentSucceeded = async (
      customerId: string,
      amountPaid: number,
      invoiceId: string,
      fundId: string | null,
      date: Date
    ) => {
      const user = await userSchema.findOne({ stripeCustomerId: customerId });
      console.log("user", user);
    
      if (!user) {
        console.warn("No user found for customer ID:", customerId);
        return null;
      }
      const fund = await fundSchemas.findById(fundId);

      if(!fund) {
        console.warn("No fund found for fund ID:", fundId);
        return null;
      }

      if(fund.currentAmount >= fund.targetAmount) {
        console.warn("Fund has reached its target amount:", fund.targetAmount);
        return null;
      }
      fund.currentAmount = fund.currentAmount + amountPaid / 100;
      await fund.save();
      const donation = {
        fundId: fundId ? new mongoose.Types.ObjectId(fundId).toString() : '',
        amount: amountPaid / 100,
        interval: "monthly",
        paymentDate: date,
        stripeInvoiceId: invoiceId,
      };
      console.log("donation", donation);
    
      user.donationHistory.push(donation);
    
      await user.save(); 
      console.log("Updated user after donation:", user);
    
      return user;
    }