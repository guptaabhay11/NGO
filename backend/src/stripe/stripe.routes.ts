import { Router } from "express";
import { catchError } from "../common/middleware/catch-error.middleware";
import * as stripeController from "./stripe.controller";
import bodyParser from "body-parser";


export const stripeRouter = Router();
export const stripeWebhookRouter = Router();


stripeRouter.post("/create-subscription-session", catchError, stripeController.createSubscriptionSession);

// Webhook route — with raw body parsing
stripeWebhookRouter.post("/webhook", bodyParser.raw({ type: "application/json" }), catchError, stripeController.stripeWebhook);
