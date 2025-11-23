import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  phone: string;
  name?: string;
  dob?: string;
  password: string;
  photo?: string;
  coins: number;
  coinValue: number;
  totalSpent: number;
  weeklySpent: number;
  monthlySpent: number;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    phone: { type: String, required: true, unique: true },

    name: { type: String, default: "" },

    dob: { type: String, default: "" },

    password: { type: String, required: true },  // added password

    photo: { type: String, default: "" },

    coins: { type: Number, default: 0 },

    coinValue: { type: Number, default: 0.25 },

    totalSpent: { type: Number, default: 0 },

    weeklySpent: { type: Number, default: 0 },

    monthlySpent: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
