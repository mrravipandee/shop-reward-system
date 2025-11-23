import { NextResponse } from "next/server";
import {dbConnect} from "@/lib/dbConnect";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { phone } = await req.json();

    if (!phone) return NextResponse.json({ error: "Phone required" }, { status: 400 });

    const user = await User.findOne({ phone }).select("name coins photo");

    if (!user) {
      return NextResponse.json({ found: false }, { status: 404 });
    }

    return NextResponse.json({ 
      found: true, 
      user: {
        name: user.name || "Customer", // Fallback if name is empty
        coins: user.coins,
        photo: user.photo
      } 
    });
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}