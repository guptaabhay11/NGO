import express from "express"
import userRoutes from "./user/user.routes"
import fundRoutes from "./fund/fund.routes"
import stripeRoutes from "./stripe/stripe.routes"
const router = express.Router();

router.use("/users", userRoutes);
router.use("/funds", fundRoutes);
router.use("/stripe",stripeRoutes);

export default router;