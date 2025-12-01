import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import Redemption from "@/models/Redemption";

// Helper to generate 6-digit code
const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { userId, product } = await req.json();

    const user = await User.findById(userId);
    if (!user || user.coins < product.requiredCoins) {
      return NextResponse.json({ message: "Insufficient coins" }, { status: 400 });
    }

    // 1. Deduct Coins Immediately (to prevent double spending)
    user.coins -= product.requiredCoins;
    user.totalSpent += product.requiredCoins; // Update stats
    await user.save();

    // 2. Create Pending Redemption Request
    const newRedemption = await Redemption.create({
      userId: user._id,
      productName: product.name,
      category: product.category,
      coinsSpent: product.requiredCoins,
      cashAmount: product.category === 'cash' ? parseInt(product.originalPrice.replace(/\D/g,'')) : 0,
      status: "PENDING",
      redeemCode: generateCode(), // User shows this code
    });

    return NextResponse.json({ 
      success: true, 
      message: "Request Sent! Show code to Shop Owner.", 
      redeemCode: newRedemption.redeemCode,
      user // Return updated coin balance
    });

  } catch (error) {
    return NextResponse.json({ message: "Error processing request" }, { status: 500 });
  }
}