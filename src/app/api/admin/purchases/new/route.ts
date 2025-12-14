import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import Transaction from "@/models/Transaction";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { phone, amount, paymentMode } = await req.json();

    if (!phone || !amount) {
      return NextResponse.json({ message: "Phone and Amount are required" }, { status: 400 });
    }

    // 1. Calculate Coins (Logic: 1 Coin per ₹10 Spent)
    const coinsEarned = Math.floor(amount / 10);

    // 2. Find or Create User (Auto-Registration)
    let user = await User.findOne({ phone });

    if (!user) {
      // Create a new user if they don't exist
      user = await User.create({
        phone,
        name: "New Customer", // Admin can edit later
        coins: 0,
        totalSpent: 0,
        createdAt: new Date(),
      });
    }

    // 3. Create Transaction Record
    const newTransaction = await Transaction.create({
      userId: user._id,
      amount,
      coinsEarned,
      paymentMode, // 'Cash' or 'Online'
      status: "COMPLETED",
      timestamp: new Date(),
    });

    // 4. Update User Wallet & Stats
    user.coins += coinsEarned;
    user.totalSpent += amount;
    user.lastActive = new Date();
    await user.save();

    return NextResponse.json({
      message: "Purchase recorded successfully",
      transaction: {
        id: newTransaction._id,
        customerName: user.name,
        coins: coinsEarned,
      }
    }, { status: 201 });

  } catch (error: unknown) {
    console.error("New Purchase API Error:", error);
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}