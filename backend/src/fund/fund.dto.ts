import { type BaseSchema } from "../common/dto/base.dto";
import { Types } from "mongoose";

export interface IFund extends BaseSchema {
  admin: Types.ObjectId; // created by admin
  name: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  plan: string;
  donations: Array<{
    donatedBy: Types.ObjectId;  // who made the donation
    plan: {
      amount: number;
      interval: string;
    };
    createdAt?: Date;  // optional since timestamps will add this
  }>;
  recentDonations: Array<{
    donatedBy: Types.ObjectId;  // who made the donation
    plan: {
      amount: number;
      interval: string;
    };
    createdAt?: Date;  // optional since timestamps will add this
  }>;
  isActive: boolean;
  startDate: Date;
}