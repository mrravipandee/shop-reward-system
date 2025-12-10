import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Transaction from "@/models/Transaction";

// Define the shape of the raw aggregation result from MongoDB
interface DailyAggregation {
  _id: number; // MongoDB $dayOfWeek returns 1 (Sun) - 7 (Sat)
  count: number;
}

export async function GET() {
  try {
    await dbConnect();

    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6); // Last 7 days including today
    sevenDaysAgo.setHours(0, 0, 0, 0);

    // 1. Aggregate Transactions by Day of Week
    const rawStats = await Transaction.aggregate<DailyAggregation>([
      {
        $match: {
          timestamp: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: { $dayOfWeek: "$timestamp" }, // Returns 1 (Sunday) to 7 (Saturday)
          count: { $sum: 1 },
        },
      },
    ]);

    // 2. Map MongoDB days (1-7) to Chart labels ("Sun"-"Sat")
    // Note: MongoDB 1=Sun, 2=Mon, ..., 7=Sat
    const dayMap: Record<number, string> = {
      1: "Sun", 2: "Mon", 3: "Tue", 4: "Wed", 5: "Thu", 6: "Fri", 7: "Sat"
    };

    // 3. Create a complete array for the last 7 days (filling missing days with 0)
    // We want the order to be chronological (e.g. if today is Wed: Thu, Fri, Sat, Sun, Mon, Tue, Wed)
    const chartData = [];
    let totalActivities = 0;
    let peakValue = 0;
    let peakDay = "-";

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dayIndex = d.getDay() + 1; // JS getDay() is 0-6, Mongo is 1-7. +1 to match Mongo.
      
      const foundStat = rawStats.find((s) => s._id === dayIndex);
      const count = foundStat ? foundStat.count : 0;

      const dayLabel = dayMap[dayIndex];
      
      chartData.push({
        day: dayLabel,
        activities: count,
      });

      // Stats Calculation
      totalActivities += count;
      if (count > peakValue) {
        peakValue = count;
        peakDay = dayLabel;
      }
    }

    const avgDaily = totalActivities > 0 ? Math.round(totalActivities / 7) : 0;

    // Response Object
    return NextResponse.json({
      chartData,
      stats: {
        total: totalActivities,
        average: avgDaily,
        peakDay,
        growth: 12.5, // Placeholder: You would need last week's data to calculate real growth
      }
    }, { status: 200 });

  } catch (error) {
    console.error("Weekly Stats Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}