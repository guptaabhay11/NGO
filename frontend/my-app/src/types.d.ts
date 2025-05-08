declare module "*.svg" {
    import React = require("react");
    export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
    const src: string;
    export default src;
  }
  
  interface User {
    data: any;
    id: string;
    name: string;
    email: string;
    active: boolean;
    amount: number
    role: "USER" | "ADMIN";
  }
  export interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    amount: number;
    bankDetails: string;
  }
  
  export interface Fund {
    _id: string;
    id: string;
    name: string;
    description: string;
    plan: string;
    targetAmount: number;
    currentAmount: number;
    createdAt: string;
    createdBy: string;
    isActive: boolean;
  }
  
  export interface Donation {
    createdAt: string | number | Date;
    plan: any;
    donatedBy: any;
    _id: Key | null | undefined;
    id: string;
    fundId: string;
    userId: string;
    userName: string;
    amount: number;
    interval: string;
    date: string;
  }
  
  export interface FundAnalytics {
    data: any;
    donations: any;
    currentAmount: any;
    totalDonations: number;
    donors: number;
    recentDonations: Donation[];
    monthlyGrowth: { month: string; amount: number }[];
  }
  
  
  interface ApiResponse<T> {
    donors: any;
    totalDonations: any;
    recentDonations: any;
    data: T;
    message: string;
    sucess: boolean
  }