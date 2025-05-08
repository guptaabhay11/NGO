import mongoose, { model, Schema } from "mongoose";
import { type IUser } from "./user.dto";
import bcrypt from "bcrypt";

const hashPassword = async (password: string) => {
  const hash = await bcrypt.hash(password, 12);
  return hash;
};

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },

    bankDetails: {
      type: String, // Optional for now
    },

    funds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Fund" }],

    
    stripeCustomerId: {
      type: String,
    },
    subscriptionId: {
      type: String,
    },

    
    donationHistory: [
      {
        fundId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Fund",
        },
        amount: {
          type: Number,
        },
        interval: {
          type: String, // "month", "quarter", etc.
        },
        paymentDate: {
          type: Date,
        },
        stripeInvoiceId: {
          type: String,
        },
      },
    ],

    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    (this as any).password = await hashPassword((this as any).password);
  }
  next();
});

export default model<IUser>("User", UserSchema);
