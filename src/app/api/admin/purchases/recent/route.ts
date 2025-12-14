import { NextResponse } from "next/server";
import { Types } from "mongoose";
import { dbConnect } from "@/lib/dbConnect";
import Transaction from "@/models/Transaction";

// 1. Define the shape of the User object after populate
interface PopulatedUser {
  _id: Types.ObjectId;
  name: string;
  phone: string;
}

// 2. Define the shape of the Transaction document from DB
interface TransactionDocument {
  _id: Types.ObjectId;
  userId: PopulatedUser | null; // Can be null if the user was deleted
  amount: number;
  coinsEarned: number;
  paymentMode: string;
  timestamp: Date;
  status?: string;
}

export async function GET() {
  try {
    await dbConnect();

    // Fetch last 50 transactions sorted by newest first
    // We use .lean<TransactionDocument[]>() to explicitly tell TS the return type
    const transactions = await Transaction.find({})
      .sort({ timestamp: -1 })
      .limit(50)
      .populate("userId", "name phone") 
      .lean<TransactionDocument[]>(); 

    // Transform data for Frontend
    // 't' is now strictly typed as TransactionDocument
    const formattedData = transactions.map((t) => ({
      id: t._id.toString(),
      customerName: t.userId?.name || "Unknown",
      customerPhone: t.userId?.phone || "N/A",
      amount: t.amount,
      coins: t.coinsEarned,
      paymentMode: t.paymentMode,
      timestamp: new Date(t.timestamp).toLocaleString('en-IN', {
        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
      }),
      status: t.status || "Completed"
    }));

    return NextResponse.json({ transactions: formattedData }, { status: 200 });

  } catch (error: unknown) {
    console.error("Recent Purchases API Error:", error);
    
    // Type narrowing for safety
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    
    return NextResponse.json({ message: "Failed to fetch transactions", error: errorMessage }, { status: 500 });
  }
}