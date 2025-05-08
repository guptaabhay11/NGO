import { RequestHandler, Router } from "express";
import { catchError } from "../common/middleware/catch-error.middleware";
import * as stripeController from "./stripe.controller";

const router = Router();

router
        .post("/create-subscription-session",catchError, stripeController.createSubscriptionSession);

export default router;