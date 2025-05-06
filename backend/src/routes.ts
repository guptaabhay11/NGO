import express from "express"
import userRoutes from "./user/user.routes"
import fundRoutes from "./fund/fund.routes"

const router = express.Router();

router.use("/users", userRoutes);
router.use("/funds", fundRoutes);

export default router;