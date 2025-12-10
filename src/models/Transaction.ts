import mongoose, { Schema, Document } from "mongoose";

export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number;       // Changed from amountSpent
  coinsEarned: number;
  paymentMode: "cash" | "online"; // Changed from paymentType
  shopCode?: string;
  timestamp: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    amount: { type: Number, required: true }, // Matches your DB
    coinsEarned: { type: Number, default: 0 },
    paymentMode: { type: String, enum: ["cash", "online"], required: true }, // Matches your DB
    shopCode: { type: String },
    timestamp: { type: Date, default: Date.now },
  },
  { collection: "transactions" }
);

export default mongoose.models.Transaction || mongoose.model<ITransaction>("Transaction", TransactionSchema);