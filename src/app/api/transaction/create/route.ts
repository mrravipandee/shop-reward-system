import { NextResponse } from "next/server";
import {dbConnect} from "@/lib/dbConnect";
import User from "@/models/User";
import Transaction from "@/models/Transaction";

// Shop Code Validator (MM + '70' + HH)
const validateShopCode = (code: string) => {
  const now = new Date();
  // Ensure we use IST time for calculation if server is UTC
  // const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const hours = now.getHours().toString().padStart(2, "0");
  const expected = minutes + "70" + hours;
  
  return code === expected;
};

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { customerPhone, amount, coinsEarned, paymentMode, shopCode } = body;

    // 1. Validate Shop Code
    if (!validateShopCode(shopCode)) {
      return NextResponse.json({ error: "Invalid Security Code" }, { status: 403 });
    }

    // 2. Find User
    const user = await User.findOne({ phone: customerPhone });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 3. Update User Stats
    // Using $inc is atomic and safer
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { 
        $inc: { 
          coins: Number(coinsEarned),
          totalSpent: Number(amount),
          weeklySpent: Number(amount),
          monthlySpent: Number(amount)
        } 
      },
      { new: true } // Return updated doc
    );

    // 4. Record Transaction
    await Transaction.create({
      userId: user._id,
      amount: Number(amount),
      coinsEarned: Number(coinsEarned),
      paymentMode,
      shopCode
    });

    return NextResponse.json({ 
      success: true, 
      newBalance: updatedUser.coins,
      userName: updatedUser.name
    });

  } catch (error) {
    console.error("Transaction Error:", error);
    return NextResponse.json({ error: "Transaction Failed" }, { status: 500 });
  }
}