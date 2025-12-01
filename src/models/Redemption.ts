import mongoose, { Schema, Document, Model } from "mongoose";

export interface IRedemption extends Document {
  userId: mongoose.Types.ObjectId;
  productName: string;         // e.g., "1kg Sugar" or "₹100 Cash"
  category: "product" | "cash";
  coinsSpent: number;          // e.g., 200
  cashAmount?: number;         // If cash reward, e.g., 100
  status: "PENDING" | "APPROVED" | "REJECTED";
  redeemCode: string;          // Unique code user shows to Shop Owner
  approvedBy?: string;         // ID or Name of Shop Owner who approved
  createdAt: Date;
  updatedAt: Date;
}

const RedemptionSchema = new Schema<IRedemption>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    productName: { type: String, required: true },
    category: { type: String, enum: ["product", "cash"], required: true },
    coinsSpent: { type: Number, required: true },
    cashAmount: { type: Number }, 
    
    // The Approval Workflow State
    status: { 
      type: String, 
      enum: ["PENDING", "APPROVED", "REJECTED"], 
      default: "PENDING" 
    },
    
    // A 6-digit code the user shows the shop owner
    redeemCode: { type: String, required: true }, 
    
    approvedBy: { type: String }, // Optional: Track which admin approved it
  },
  { timestamps: true }
);

export const Redemption: Model<IRedemption> = 
  (mongoose.models.Redemption as Model<IRedemption>) || 
  mongoose.model<IRedemption>("Redemption", RedemptionSchema);

export default Redemption;