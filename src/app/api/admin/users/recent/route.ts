import { NextResponse } from "next/server";
import { Types } from "mongoose";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import Transaction from "@/models/Transaction";

// 1. Strict Type for User Document from DB
interface UserDocument {
  _id: Types.ObjectId;
  phone: string;
  name?: string;
  dob?: Date; // or string depending on your DB
  photo?: string;
  coins?: number; // <--- Coins field from DB
  createdAt: Date;
}

// 2. Strict Type for Transaction Document from DB
interface TransactionDocument {
  amount: number;
  timestamp: Date;
}

export async function GET() {
  try {
    await dbConnect();

    // Fetch users with strict typing
    const recentUsers = await User.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .lean<UserDocument[]>(); // <--- Generics remove the need for 'any'

    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const usersWithStats = await Promise.all(
      recentUsers.map(async (user) => {
        // 'user' is now strictly typed as UserDocument
        
        const transactions = await Transaction.find(
          { userId: user._id }, 
          "amount timestamp"
        ).lean<TransactionDocument[]>();

        let totalSpent = 0;
        let weeklySpent = 0;
        let monthlySpent = 0;

        transactions.forEach((t) => {
          const amount = t.amount || 0;
          const txDate = new Date(t.timestamp);

          totalSpent += amount;

          if (txDate >= oneWeekAgo) weeklySpent += amount;
          if (txDate >= oneMonthAgo) monthlySpent += amount;
        });

        // --- WHERE COINS VALUE IS SET ---
        const coins = user.coins || 0; // Fetched directly from User DB model
        
        // If you want to change the value of 1 coin (e.g. 1 Coin = ₹0.25), change the multiplier here:
        const COIN_MULTIPLIER = 0.25; 
        const coinValue = coins * COIN_MULTIPLIER; 

        return {
          _id: user._id.toString(),
          phone: user.phone,
          name: user.name || "Anonymous",
          dob: user.dob ? new Date(user.dob).toISOString() : null,
          photo: user.photo || "",
          coins: coins,
          coinValue: coinValue, // <--- Sent to frontend
          totalSpent,
          weeklySpent,
          monthlySpent,
          createdAt: user.createdAt,
        };
      })
    );

    const totalUsers = await User.countDocuments();
    
    // Calculate totals for the summary
    const totalSystemSpent = usersWithStats.reduce((acc, curr) => acc + curr.totalSpent, 0); 
    const totalSystemCoins = usersWithStats.reduce((acc, curr) => acc + curr.coins, 0);

    return NextResponse.json({
      users: usersWithStats,
      summary: {
        totalUsers,
        totalCoins: totalSystemCoins,
        totalSpent: totalSystemSpent,
        avgCoinValue: 950 
      }
    }, { status: 200 });

  } catch (error) {
    console.error("Recent Users API Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}