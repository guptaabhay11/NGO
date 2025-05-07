import { RequestHandler, Router } from "express";
import passport from "passport";
import { catchError } from "../common/middleware/catch-error.middleware";
import { roleAuth } from "../common/middleware/role-auth.middleware";
import * as fundController from "./fund.controller";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";


const router = Router();

router
    .post("/create", roleAuth(['ADMIN']), catchError, fundController.createFund)
    .patch("/donate/:id", roleAuth(['ADMIN', 'USER']), catchError, fundController.donateFund)
    .get("/all", catchError, fundController.getAllFunds)
    .get("/analytics/:id", roleAuth(['ADMIN', 'USER']), catchError, fundController.getFundAnalytics)
    .get("/getfund/:id", roleAuth(['ADMIN', 'USER']), catchError, fundController.getFundById)
    .get("/recentDonations", roleAuth(['ADMIN', 'USER']), catchError, fundController.getRecentDonations)
    .delete("/delete/:id", roleAuth(['ADMIN']), catchError, fundController.deleteFund);


export default router;


function post(arg0: string, arg1: RequestHandler<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, catchError: RequestHandler<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, donateFund: RequestHandler<ParamsDictionary, any, any, ParsedQs, Record<string, any>>) {
    throw new Error("Function not implemented.");
}
   