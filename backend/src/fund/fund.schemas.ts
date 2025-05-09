import mongoose, { model, Schema } from "mongoose";
import { IFund } from "./fund.dto";

const FundSchema: Schema<IFund> = new Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User collection
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    targetAmount: {
      type: Number,
      required: true,
      min: 1,
    },
    currentAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
  
    donations: [
      {
        donatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        plan: {
          amount: Number,
          interval: String,
        },
      },
    ],

    recentDonations: [
      {
        donatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        plan: {
          amount: Number,
          interval: String,
        },
        createdAt: {
          type: Date,
          default: Date.now,  
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    startDate: {
      type: Date,
      default: Date.now, // Default to current time
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt
  }
);

export default mongoose.model<IFund>("Fund", FundSchema);
