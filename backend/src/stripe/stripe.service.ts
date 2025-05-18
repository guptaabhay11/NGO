import { stripe } from "../common/services/stripe.services";
import userSchema from "../user/user.schema";
import mongoose from "mongoose";
import UserSchema from "../user/user.schema";
import { updateUser } from "../user/user.validation";
import fundSchemas from "../fund/fund.schemas";
import { create } from "domain";
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
      
        success_url: `http://localhost:3000/dashboard`,
        cancel_url: `http://localhost:3000/cancel`,
      });
      return session;
  
    };

    export const handlePaymentSucceeded = async (
      customerId: string,
      amountPaid: number,
      invoiceId: string,
      interval: string,
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
      console.log(fundId)
      if (!fundId) {
        console.warn("Fund ID is null, skipping donation history update.");
        return null;
      }

      const donation = {
        fundId: fundId,
        amount: amountPaid / 100,
        interval: interval,
        paymentDate: date,
        stripeInvoiceId: invoiceId,
      };
      console.log("donation", donation);
    
      user.donationHistory.push(donation);
    
      await user.save(); 
      console.log("Updated user after donation:", user);

      const updateFundHistory = {
        donatedBy: fundId,
        plan: {
          amount: amountPaid / 100,
          interval: interval,
        },
        createdAt: date,
      };

      await fundSchemas.findByIdAndUpdate(fundId, {
        $push: { recentDonations: updateFundHistory },
    });
      console.log("Updated fund after donation:", fund);

    
      return user;
    }