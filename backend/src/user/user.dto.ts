import { type BaseSchema } from "../common/dto/base.dto";
import mongoose, { Types } from "mongoose";
export interface IUser extends BaseSchema {
  name: string;
  email: string;
  password: string;
  role: string;
  funds: mongoose.Schema.Types.ObjectId[];
  bankDetails: string;
  amount: number;
  donationHistory: [
    {
      fundId: string;
      amount: number;
      interval: string;
    }
  ];
  refreshToken?: string;

}

