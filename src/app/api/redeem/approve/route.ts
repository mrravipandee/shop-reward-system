import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Redemption from "@/models/Redemption";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { redeemCode, action, shopOwnerName } = await req.json(); 
    // action = 'APPROVE' or 'REJECT'

    const request = await Redemption.findOne({ redeemCode, status: "PENDING" });
    if (!request) {
      return NextResponse.json({ message: "Invalid or expired code" }, { status: 404 });
    }

    if (action === "APPROVE") {
      request.status = "APPROVED";
      request.approvedBy = shopOwnerName;
      await request.save();
      return NextResponse.json({ success: true, message: "Redemption Successful" });
    } 
    
    else if (action === "REJECT") {
      request.status = "REJECTED";
      await request.save();

      // REFUND THE COINS to the user
      await User.findByIdAndUpdate(request.userId, { 
        $inc: { coins: request.coinsSpent, totalSpent: -request.coinsSpent } 
      });

      return NextResponse.json({ success: true, message: "Request Rejected, Coins Refunded" });
    }

  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}