import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number;
  coinsEarned: number;
  paymentMode: "cash" | "online";
  shopCode: string;
  timestamp: Date;
}

const TransactionSchema = new Schema<ITransaction>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  coinsEarned: { type: Number, required: true },
  paymentMode: { type: String, enum: ["cash", "online"], required: true },
  shopCode: { type: String },
  timestamp: { type: Date, default: Date.now },
});

export const Transaction: Model<ITransaction> = mongoose.models.Transaction || mongoose.model<ITransaction>("Transaction", TransactionSchema);
export default Transaction;