import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import Transaction from "@/models/Transaction";

// Define strict types for the aggregation results
interface PaymentAggregation {
  _id: "cash" | "online";
  totalAmount: number;
  count: number;
}

export async function GET() {
  try {
    await dbConnect();

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // --- 1. USER ANALYSIS ---

    // A. Total Users (All time)
    const totalUsers = await User.countDocuments({});

    // B. New Users (Created this month)
    // Assuming User model has timestamps: true (createdAt)
    const newUsers = await User.countDocuments({
      createdAt: { $gte: startOfMonth },
    });

    // C. Active Users (Users who made a transaction this month)
    const distinctActiveUsers = await Transaction.distinct("userId", {
      timestamp: { $gte: startOfMonth },
    });
    const activeUsers = distinctActiveUsers.length;

    // D. Returning Users (Active Users who were NOT created this month)
    // Logic: If they bought something this month (Active) but weren't created this month (New), they are returning.
    // Note: This is a simplified heuristic.
    const returningUsers = Math.max(0, activeUsers - newUsers);

    // --- 2. PAYMENT ANALYSIS ---

    // Aggregate Transactions by Payment Mode for this month (or all time, depending on requirement)
    // Let's do All Time based on the component's "Total Analysis" context, 
    // but typically dashboards default to "This Month". Let's stick to "This Month" for consistency.
    const paymentStats = await Transaction.aggregate<PaymentAggregation>([
      {
        $match: {
          timestamp: { $gte: startOfMonth }
        }
      },
      {
        $group: {
          _id: "$paymentMode",
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ]);

    // Helpers to extract data safely
    const getPaymentData = (mode: "cash" | "online") => {
      const data = paymentStats.find((s) => s._id === mode);
      return {
        amount: data?.totalAmount || 0,
        transactions: data?.count || 0,
      };
    };

    const onlineData = getPaymentData("online");
    const cashData = getPaymentData("cash");
    
    // Calculate Total for percentages
    const totalRevenue = onlineData.amount + cashData.amount;
    
    // Helper for percentage
    const getPercent = (amount: number) => 
      totalRevenue > 0 ? parseFloat(((amount / totalRevenue) * 100).toFixed(1)) : 0;

    const responseData = {
      userData: {
        newUsers,
        activeUsers,
        returningUsers,
        totalUsers,
      },
      paymentData: {
        online: {
          amount: onlineData.amount,
          percentage: getPercent(onlineData.amount),
          transactions: onlineData.transactions,
        },
        cash: {
          amount: cashData.amount,
          percentage: getPercent(cashData.amount),
          transactions: cashData.transactions,
        },
        // The DB schema only supports Cash/Online currently. 
        // Returning 0 for Card to satisfy UI interface.
        card: {
          amount: 0,
          percentage: 0,
          transactions: 0,
        },
      },
    };

    return NextResponse.json(responseData, { status: 200 });

  } catch (error) {
    console.error("Total Analysis Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}