import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Transaction from "@/models/Transaction";

// Define the shape of the aggregation result
interface AggregationResult {
  _id: "cash" | "online";
  totalAmount: number;
}

export async function GET() {
  try {
    await dbConnect();

    const now = new Date();
    // Start of Current Month
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // Start of Previous Month
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    // End of Previous Month (which is effectively the 0th day of the current month)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Helper function to aggregate data by date range
    // Returns a Promise that resolves to an array of AggregationResult
    async function getStatsForPeriod(startDate: Date, endDate: Date): Promise<AggregationResult[]> {
      return await Transaction.aggregate<AggregationResult>([
        {
          $match: {
            timestamp: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: {
            _id: "$paymentMode", // Group by 'cash' or 'online'
            totalAmount: { $sum: "$amount" },
          },
        },
      ]);
    }

    // 1. Fetch Data
    const currentMonthStats = await getStatsForPeriod(startOfCurrentMonth, now);
    const lastMonthStats = await getStatsForPeriod(startOfLastMonth, endOfLastMonth);

    // 2. Process Data Helpers
    // 'stats' is now typed as AggregationResult[] instead of any[]
    const getAmount = (stats: AggregationResult[], mode: string): number => 
      stats.find((s) => s._id === mode)?.totalAmount || 0;

    const currentOnline = getAmount(currentMonthStats, "online");
    const currentCash = getAmount(currentMonthStats, "cash");
    const totalCurrent = currentOnline + currentCash;

    const lastOnline = getAmount(lastMonthStats, "online");
    const lastCash = getAmount(lastMonthStats, "cash");

    // 3. Calculate Percentages & Changes
    const calculateChange = (current: number, previous: number): number => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };

    const responseData = {
      online: {
        amount: currentOnline,
        percentage: totalCurrent > 0 ? Math.round((currentOnline / totalCurrent) * 100) : 0,
        change: parseFloat(calculateChange(currentOnline, lastOnline).toFixed(1)),
      },
      cash: {
        amount: currentCash,
        percentage: totalCurrent > 0 ? Math.round((currentCash / totalCurrent) * 100) : 0,
        change: parseFloat(calculateChange(currentCash, lastCash).toFixed(1)),
      },
      total: totalCurrent
    };

    return NextResponse.json(responseData, { status: 200 });

  } catch (error) {
    console.error("Collection Stats Error:", error);
    // Safe error handling without 'any'
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}