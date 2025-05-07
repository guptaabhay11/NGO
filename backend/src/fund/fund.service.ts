import fundSchemas from "./fund.schemas";
import { IFund } from "./fund.dto";
import { ObjectId } from "mongoose";
import mongoose from "mongoose";
import userSchema from "../user/user.schema";

export const createFund = async (userId: string, fundData: IFund) => {
    console.log("fund details", fundData)
    const fund = await fundSchemas.create({
        ...fundData,
        admin: userId,
        startDate: new Date()
    });
    await userSchema.findByIdAndUpdate(
        userId,
        { $push: { funds: fund._id } },
        { new: true }
    );
    return fund;

}

export const donateFund = async (
    userId: string,
    fundId: string,
    donation: { amount: number; interval: string }
) => {
    const fund = await fundSchemas.findById(fundId);
    if (!fund) throw new Error("Fund not found");
    if (!fund.isActive) throw new Error("This fund is no longer active");
    console.log("fund", fund);

    const user = await userSchema.findById(userId);
    if (!user) throw new Error("User not found");
    if (user.amount < donation.amount) throw new Error("Insufficient balance");
    if (donation.amount <= 0) throw new Error("Invalid donation amount");

    fund.recentDonations.push({
        donatedBy: new mongoose.Types.ObjectId(userId),
        plan: {
            amount: donation.amount,
            interval: donation.interval,
        },

    });
    await fund.save();
    user.amount -= donation.amount;
    await user.save();

    user.donationHistory.push({
        fundId: fund._id,
        amount: donation.amount,
        interval: donation.interval,
    });
    await user.save();

    fund.donations.push({
        donatedBy: new mongoose.Types.ObjectId(userId),
        plan: {
          amount: donation.amount,
          interval: donation.interval,
        },
      });
  
    fund.currentAmount += donation.amount;

    
    if (fund.currentAmount >= fund.targetAmount) {
        fund.isActive = false;
    }

    await fund.save();
    return fund;
};

export const getAllFunds = async () => {
    const funds = await fundSchemas.find({ isActive: true }).populate("admin", "name email");
    return funds;
}

export const getFundAnalytics = async (fundId: string) => {
    const fund = await fundSchemas.findById(fundId).populate("admin", "name email");
    if (!fund) throw new Error("Fund not found");
    return fund;
}

export const deleteFund = async (fundId: string) => {
    const fund = await fundSchemas.findById(fundId);
    if (!fund) throw new Error("Fund not found");
    fund.isActive = false;
    await fund.save();
    return fund;
}
export const getRecentDonations = async () => {
   const history = await fundSchemas.find({}, { recentDonations: 1 }).populate("recentDonations.donatedBy", "name email");
   if (!history) throw new Error("No recent donations found");
   history.sort((a, b) => {
       const dateA = a.recentDonations[0]?.createdAt?.getTime() || 0;
       const dateB = b.recentDonations[0]?.createdAt?.getTime() || 0;
       return dateB - dateA;
   });
   
   return history;
}

export const getFundById = async (fundId: string) => {
    const fund = await fundSchemas.findById(fundId).populate("admin", "name email");
    if (!fund) throw new Error("Fund not found");
    return fund;
}