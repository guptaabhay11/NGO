declare module "*.svg" {
    import React = require("react");
    export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
    const src: string;
    export default src;
  }
  
  interface User {
    _id: string;
    name: string;
    email: string;
    active: boolean;
    amount: number
    role: "USER" | "ADMIN";
  }
  
  interface ApiResponse<T> {
    donors: any;
    totalDonations: any;
    recentDonations: any;
    data: T;
    message: string;
    sucess: boolean
  }