import { type BaseSchema } from "../common/dto/base.dto";
import mongoose, { Types } from "mongoose";
export interface IUser extends BaseSchema {
  name: string;
  email: string;
  stripeCustomerId: string;
  password: string;
  role: string;
  funds: mongoose.Schema.Types.ObjectId[];
  bankDetails: string;
  amount: number;
  subscriptionId: string;
  donationHistory: [
    {
      fundId: string;
      amount: number;
      interval: string;
      paymentDate: Date;
      stripeInvoiceId: string;
    }
  ];
  refreshToken?: string;

}

