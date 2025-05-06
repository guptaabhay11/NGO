import { Router } from "express";
import passport from "passport";
import { catchError } from "../common/middleware/catch-error.middleware";
import { roleAuth } from "../common/middleware/role-auth.middleware";
import * as userController from "./user.controller";
import * as userValidator from "./user.validation";

const router = Router();
router
        .post("/register", userValidator.createUser, catchError, userController.createUser)
        .post("/login", userValidator.login, catchError, passport.authenticate('login', { session: false }), userController.login)
        .get("/me", roleAuth(['USER']), userController.getUserInfo)
        .post("/addBankDetails", roleAuth(['USER']), catchError, userController.addBankDetails)
        .patch("/addBalance", roleAuth(['USER']), catchError, userController.addBalance)
        .post("/refresh", userValidator.refreshToken, catchError, userController.refreshToken); 

export default router;