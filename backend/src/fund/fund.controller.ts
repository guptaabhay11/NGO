import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import * as fundService from "./fund.service"; 
import { createResponse } from "../common/helper/response.helper";

export const createFund = asyncHandler(async (req: Request, res: Response) => {
 
  
  const userId = (req.user as any)?.id;
  console.log(userId);
  const fundData = req.body;
  const fund = await fundService.createFund(userId, fundData);

  res.status(201).send(createResponse(fund, "Fund created successfully"));
});
export const donateFund = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req.user as any)?.id;
  const fundId = req.params.id;
  const fundData = req.body;
  console.log(userId);
  console.log(fundId);
  console.log(fundData);
  const fund = await fundService.donateFund(userId, fundId, fundData);

  res.status(201).send(createResponse(fund, "Fund donated successfully"));
});

export const getAllFunds = asyncHandler(async (req: Request, res: Response) => {
  const funds = await fundService.getAllFunds();
  res.status(200).send(createResponse(funds, "Funds fetched successfully"));
}
);

export const getFundAnalytics = asyncHandler(async (req: Request, res: Response) => {
  const fundId = req.params.id;
  const analytics = await fundService.getFundAnalytics(fundId);
  res.status(200).send(createResponse(analytics, "Fund analytics fetched successfully"));
}
);
export const deleteFund = asyncHandler(async (req: Request, res: Response) => {
  const fundId = req.params.id;
  const fund = await fundService.deleteFund(fundId);
  res.status(200).send(createResponse(fund, "Fund deleted successfully"));
});
export const getRecentDonations = asyncHandler(async (req: Request, res: Response) => {
  const donations = await fundService.getRecentDonations();
  res.status(200).send(createResponse(donations, "Recent donations fetched successfully"));
}
);  

export const getFundById = asyncHandler(async (req: Request, res: Response) => {
  const fundId = req.params.id;
  const fund = await fundService.getFundById(fundId);
  res.status(200).send(createResponse(fund, "Fund fetched successfully"));
}
);

export const getDonationById = asyncHandler (async (req: Request, res: Response) => {
  const userId = req.params.id;
  const fund = await fundService.getDonationById(userId);
  res.send(createResponse("Donation of the user fetched")) 
})


