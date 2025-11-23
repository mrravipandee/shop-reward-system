import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";

export async function GET() {
  try {
    await dbConnect();

    // Read cookie
    const cookieStore = await cookies();
    const userToken = cookieStore.get("user_token")?.value;

    if (!userToken) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Find user (excluding password)
    // NOTE: The userToken must contain the MongoDB ObjectId (_id) of the user
    const user = await User.findById(userToken).select("-password");

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Clean response → Return fields matching the frontend's 'User' type
    return NextResponse.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        phone: user.phone,
        dob: user.dob,
        photo: user.photo,
        coins: user.coins,
        coinValue: user.coinValue,
        totalSpent: user.totalSpent,
        weeklySpent: user.weeklySpent,
        monthlySpent: user.monthlySpent,
        // FIX: Map the Mongoose 'createdAt' field to 'createdAt' 
        // to match the frontend 'User' interface.
        createdAt: user.createdAt, 
      },
    });

  } catch (err) {
    console.error("ME API ERROR:", err);
    return NextResponse.json(
      { error: "Server error fetching profile" },
      { status: 500 }
    );
  }
}