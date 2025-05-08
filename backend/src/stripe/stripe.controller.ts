import expressAsyncHandler from "express-async-handler";
import { Request, Response } from 'express';
import * as stripeService from "./stripe.service"
import { createResponse } from "../common/helper/response.helper";

export const createSubscriptionSession = expressAsyncHandler(async (req: Request, res: Response) => {

    const { userId, priceId } = req.body; 
    if(!userId || !priceId) {
        throw new Error("User id or price id is missing");
    }

   const session = await stripeService.createCheckoutSession(userId, priceId);

   res.send(createResponse(session));
})


