import expressAsyncHandler from "express-async-handler";
import { Request, Response } from 'express';
import {stripe} from "../common/services/stripe.services";
import asyncHandler from "express-async-handler";

import * as stripeService from "./stripe.service"
import { createResponse } from "../common/helper/response.helper";

export const createSubscriptionSession = asyncHandler(async (req: Request, res: Response) => {

    const { userId, priceId, fundId, interval } = req.body; 
    if(!userId || !priceId) {
        throw new Error("User id or price id is missing");
    }

   const session = await stripeService.createCheckoutSession(userId, priceId, fundId, interval);

   res.send(createResponse(session));
})
export const stripeWebhook = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  
    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig!, endpointSecret);
    
    } catch (err: any) {
      console.error("Webhook signature verification failed.", err.message);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
  
    if (event.type === "checkout.session.completed") {
      const invoice = event.data.object as any;
      const metadata = invoice.metadata;
      console.log("metadata", metadata)
      const customerId = invoice.customer;
      const amountPaid = invoice.amount_subtotal;
      const subscriptionId = invoice.subscription;
      const interval = invoice.metadata?.interval;
      const invoiceId = invoice.id;
      const createdDate = new Date(invoice.created * 1000); // Convert Unix timestamp
      const fundId = invoice.metadata?.fundId || invoice.subscription_details?.metadata?.fundId;
      console.log("fundId", fundId)
      console.log("customer", customerId)
      console.log("amountPaid", amountPaid)

      console.log("invoiceId", invoiceId)
      console.log("createdDate", createdDate)
  
 
     
      console.log(invoice)
     const data = await stripeService.handlePaymentSucceeded(
        customerId,
        amountPaid,
        invoiceId,
        interval,
        fundId,
        createdDate
      );
      console.log(data)
    }
    
  
    res.status(200).send(createResponse(event));
  });