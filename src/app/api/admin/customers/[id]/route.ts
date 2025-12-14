import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import Transaction from "@/models/Transaction";
import { Types } from "mongoose";

// Define strict types for the transaction document
interface TransactionDoc {
  _id: Types.ObjectId;
  amount: number;
  coinsEarned: number;
  timestamp: Date;
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const { id } = params;

    // 1. Fetch User Profile
    const user = await User.findById(id).lean();

    if (!user) {
      return NextResponse.json({ message: "Customer not found" }, { status: 404 });
    }

    // 2. Fetch Transaction History (Newest First)
    const transactions = await Transaction.find({ userId: id })
      .sort({ timestamp: -1 })
      .limit(20) // Limit to last 20 for performance in the drawer
      .lean<TransactionDoc[]>();

    // 3. Format Data
    const history = {
      id: user._id.toString(),
      name: user.name || "Unknown",
      phone: user.phone,
      totalSpent: user.totalSpent || 0,
      totalCoins: user.coins || 0,
      joinedAt: user.createdAt,
      transactions: transactions.map((t) => ({
        id: t._id.toString(),
        amount: t.amount,
        coins: t.coinsEarned,
        timestamp: new Date(t.timestamp).toLocaleString('en-IN', {
           day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
        }),
      })),
    };

    return NextResponse.json({ customer: history }, { status: 200 });

  } catch (error: unknown) {
    console.error("Customer Detail API Error:", error);
    return NextResponse.json({ message: "Failed to load customer details" }, { status: 500 });
  }
}