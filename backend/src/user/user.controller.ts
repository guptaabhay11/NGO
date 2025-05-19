
import { type Request, type Response } from 'express';
import asyncHandler from "express-async-handler";
import { createResponse } from "../common/helper/response.helper";
import { createUserTokens } from '../common/services/passport-jwt.services';
import { type IUser } from "./user.dto";
import { stripe } from "../common/services/stripe.services";
import * as userService from "./user.service";

import jwt from "jsonwebtoken";


export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const {email, name} = req.body;
  const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        source: "ngo-donation-app",
      },
    });
    const result = await userService.createUser(req.body, customer.id);

    const { password, ...user } = result;
    res.send(createResponse(user, "User created successfully"))
});


export const getUserById = asyncHandler(async (req: Request, res: Response) => {
    const result = await userService.getUserById(req.params.id);
    res.send(createResponse(result))
});


export const getAllUser = asyncHandler(async (req: Request, res: Response) => {
    const result = await userService.getAllUser();
    res.send(createResponse(result))
});

export const login = asyncHandler(async (req: Request, res: Response) => {
    const user = req.user as Omit<IUser, "password" & "pdf">;
    const tokens = createUserTokens(user);
    console.log(tokens)
    res.send(
      createResponse({
        ...tokens,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          name: user.name,
         
        },
      })
    );
});


export const getUserInfo = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req.user as any)?.id;
    console.log("User ID", userId);

    const user = await userService.getUserById(userId);
    res.send(createResponse(user))
});

export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new Error("Refresh token is required");
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string) as { userId: string, role: string };
    const accessToken = userService.generateRefreshToken(decoded.userId, decoded.role);
    throw new Error("User not found");
  } catch (err) {
    throw new Error("Invalid refresh token");
  }
})

export const addBalance = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req.user as any)?.id;
  const amount = req.body.amount;
  const user = await userService.addBalance(userId, amount);
  res.send(createResponse(user));
});
export const addBankDetails = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req.user as any)?.id;
  const {bankDetails} = req.body;
  const user = await userService.addBankDetails(userId, bankDetails);
  res.send(createResponse(user));
}
);

export const getDonationById = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.id;
  const donations = await userService.getDonationById(userId);
  res.send(createResponse(donations));
})

