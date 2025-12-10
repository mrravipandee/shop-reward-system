import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import Transaction from "@/models/Transaction"; // you will add soon

export async function GET() {
  try {
    await dbConnect();

    const totalCustomers = await User.countDocuments({});
    const winners = await User.countDocuments({ coins: { $gte: 100 } }); // Example rule: winners >= 100 coins
    const monthlyRevenue = await Transaction.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      },
      { $group: { _id: null, total: { $sum: "$amountSpent" } } },
    ]);

    const distributedCoins = await Transaction.aggregate([
      { $group: { _id: null, totalCoins: { $sum: "$coinsEarned" } } },
    ]);

    return NextResponse.json({
      totalCustomers,
      monthlyRevenue: monthlyRevenue[0]?.total || 0,
      winners,
      distributedCoins: distributedCoins[0]?.totalCoins || 0,
      changes: {
        totalCustomers: "↑12%",
        monthlyRevenue: "↑8%",
        winners: "↑5%",
        distributedCoins: "↑6%"
      }
    });

  } catch (err) {
    console.error("❌ STATS API ERROR", err);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
