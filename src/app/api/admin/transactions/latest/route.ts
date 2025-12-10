import { NextResponse } from "next/server";
import { Types } from "mongoose";
import { dbConnect } from "@/lib/dbConnect";
import Transaction from "@/models/Transaction";
import User from "@/models/User";

// 1. Type for the User object inside the transaction
interface PopulatedUser {
  _id: Types.ObjectId;
  name: string;
  photo?: string;
}

// 2. Type for the Raw Transaction coming from DB (after lean & populate)
interface LeanTransaction {
  _id: Types.ObjectId;
  userId: PopulatedUser | null; // Can be null if user is deleted
  amount: number;
  paymentMode: "cash" | "online";
  coinsEarned: number;
  timestamp: Date;
}

export async function GET() {
  try {
    await dbConnect();

    // Fetch and explicitly cast the result to our LeanTransaction interface
    const transactions = await Transaction.find({})
      .sort({ timestamp: -1 })
      .limit(10)
      .populate({
        path: "userId",
        model: User,
        select: "name photo",
      })
      .lean<LeanTransaction[]>(); // <--- Generics used here for type safety

    // Transform Data
    const formattedTransactions = transactions.map((t) => ({
      _id: t._id.toString(), // Convert ObjectId to string for JSON
      user: t.userId
        ? { name: t.userId.name, photo: t.userId.photo }
        : { name: "Unknown User", photo: "" },
      
      amount: t.amount || 0,
      paymentMode: t.paymentMode || "cash",
      coinsEarned: t.coinsEarned || 0,
      timestamp: t.timestamp,
    }));

    return NextResponse.json(
      { transactions: formattedTransactions }, 
      { status: 200 }
    );

  } catch (error) {
    console.error("API Error:", error);
    // Type narrowing for the error object
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    
    return NextResponse.json(
      { error: errorMessage }, 
      { status: 500 }
    );
  }
}