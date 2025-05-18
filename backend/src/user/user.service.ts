
import { type IUser } from "./user.dto";
import userSchema from "./user.schema";
import UserSchema from "./user.schema";
require('dotenv').config();
import jwt from "jsonwebtoken";


export const createUser = async (data: IUser, id: string) => {
  

    const result = await UserSchema.create({ ...data, active: true, stripeCustomerId: id });
    return result.toObject();
};


export const getUserById = async (id: string) => {
  console.log("ID", id);
  const result = await UserSchema.findById(id)
    .select('-password') 
    .lean();
  return result;
};

export const getAllUser = async () => {
    const result = await UserSchema.find({}).lean();
    return result;
};
export const getUserByEmail = async (email: string, withPassword = false) => {
    if (withPassword) {
        const result = await UserSchema.findOne({ email }).select('+password').lean();
        return result;
    }
    const result = await UserSchema.findOne({ email }).lean();
    return result;
}

export const addPdfUrlToUser = async (id: string, pdfUrl: string) => {
  const result = await UserSchema.findByIdAndUpdate(
    id,
    { $push: { pdf: pdfUrl } },
    { new: true }
  ).select('-password');
  
  return result;
};


export const generateRefreshToken = (id: string, role: string): string => {
  return jwt.sign({ id, role }, process.env.JWT_REFRESH_SECRET as string, { expiresIn: "7d" });
};

export const addBalance = async (userId: string, amount: number) => {
  const user = await UserSchema.findById(userId);
  if (!user) throw new Error("User not found");
  user.amount += amount;
  console.log(user.amount);

  await user.save();
  console.log("after", user.amount)
  return user;
}
export const addBankDetails = async (userId: string, bankDetails: string) => { 
  const user = await UserSchema.findById(userId);
  if (!user) throw new Error("User not found");

  user.bankDetails = bankDetails; 
  await user.save();

  return user;
}

export const getDonationById = async(userId: string) => {
  const donation = await userSchema.findById(userId).populate("donationHistory.fundId", "name email");
  if (!donation) throw new Error("Fund not found");
  return donation;
}

