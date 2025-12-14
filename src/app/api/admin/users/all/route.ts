import { NextResponse } from "next/server";
import { Types, PipelineStage } from "mongoose";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import Transaction from "@/models/Transaction";

// --- Interfaces for Type Safety ---

// 1. Structure of the User object AFTER the aggregation pipeline
// This includes fields from the DB + computed fields like totalSpent, isActive
interface AggregatedUser {
  _id: Types.ObjectId;
  phone: string;
  name?: string;
  dob?: Date;
  photo?: string;
  coins?: number;
  email?: string;
  createdAt: Date;
  // Computed fields from pipeline
  totalSpent: number;
  monthlySpent: number;
  lastActive?: Date;
  isActive: boolean;
}

// 2. Structure of the result from the $facet stage
interface FacetResult {
  metadata: { total: number }[];
  data: AggregatedUser[];
}

// 3. Structure for simple group aggregations (Revenue/Coins)
interface GroupTotal {
  _id: null;
  total: number;
}

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);

    // --- 1. Extract Query Params ---
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "all";
    const sortField = searchParams.get("sortField") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? 1 : -1;

    const skip = (page - 1) * limit;

    // --- 2. Build Aggregation Pipeline ---
    // Defined as PipelineStage[] to avoid 'any'
    const pipeline: PipelineStage[] = [];

    // A. Lookup Transactions
    pipeline.push({
      $lookup: {
        from: "transactions",
        localField: "_id",
        foreignField: "userId",
        as: "txs",
      },
    });

    // B. Calculate Computed Fields
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    pipeline.push({
      $addFields: {
        totalSpent: { $sum: "$txs.amount" },
        // Filter transactions for this month and sum them
        monthlySpent: {
          $sum: {
            $map: {
              input: {
                $filter: {
                  input: "$txs",
                  as: "t",
                  cond: { $gte: ["$$t.timestamp", startOfMonth] },
                },
              },
              as: "mt",
              in: "$$mt.amount",
            },
          },
        },
        // Determine last active date
        lastActive: { $max: "$txs.timestamp" },
        // Calculate status
        isActive: {
          $or: [
            { $gte: [{ $max: "$txs.timestamp" }, thirtyDaysAgo] },
            { $gte: ["$createdAt", thirtyDaysAgo] },
          ],
        },
      },
    });

    // C. Search Filter
    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { phone: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        },
      });
    }

    // D. Status Filter
    if (status !== "all") {
      pipeline.push({
        $match: { isActive: status === "active" },
      });
    }

    // E. Sorting
    pipeline.push({
      $sort: { [sortField]: sortOrder },
    });

    // --- 3. Execute Pipeline ---
    // Use strict generic typing <FacetResult> for the aggregation output
    const results = await User.aggregate<FacetResult>([
      ...pipeline,
      {
        $facet: {
          metadata: [{ $count: "total" }],
          data: [{ $skip: skip }, { $limit: limit }],
        },
      },
    ]);

    // Results from $facet always return an array with 1 item
    const facetResult = results[0];
    const usersData = facetResult.data;
    const totalDocs = facetResult.metadata[0]?.total || 0;

    // --- 4. Get Global Summary Stats ---
    const totalUsers = await User.countDocuments();
    
    // Explicitly type the aggregation result
    const revenueAgg = await Transaction.aggregate<GroupTotal>([
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const totalSpentGlobal = revenueAgg[0]?.total || 0;
    
    const coinAgg = await User.aggregate<GroupTotal>([
      { $group: { _id: null, total: { $sum: "$coins" } } }
    ]);
    const totalCoinsGlobal = coinAgg[0]?.total || 0;

    // --- 5. Final Response Formatting ---
    // 'u' is now correctly inferred as AggregatedUser
    const formattedUsers = usersData.map((u) => ({
      _id: u._id,
      phone: u.phone,
      name: u.name || "Anonymous",
      dob: u.dob,
      photo: u.photo,
      coins: u.coins || 0,
      coinValue: (u.coins || 0) * 0.25,
      totalSpent: u.totalSpent,
      monthlySpent: u.monthlySpent,
      createdAt: u.createdAt,
      email: u.email,
      lastActive: u.lastActive,
    }));

    return NextResponse.json({
      users: formattedUsers,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(totalDocs / limit),
        totalDocs,
      },
      summary: {
        totalUsers,
        totalCoins: totalCoinsGlobal,
        totalSpent: totalSpentGlobal,
        avgCoinValue: totalUsers > 0 ? Math.round((totalCoinsGlobal * 10) / totalUsers) : 0,
        avgMonthlySpent: 0,
      },
    });

  } catch (error) {
    console.error("Customers API Error:", error);
    // Safe type narrowing for error
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}