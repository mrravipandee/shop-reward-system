import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { phone, dob, password } = await req.json();

    if (!phone || !dob || !password) {
      return NextResponse.json(
        { error: "All fields required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ phone });
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (user.dob !== dob) {
      return NextResponse.json(
        { error: "DOB Incorrect" },
        { status: 401 }
      );
    }

    const passMatch = await bcrypt.compare(password, user.password);
    if (!passMatch) {
      return NextResponse.json(
        { error: "Password Incorrect" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      message: "Login Successful",
      user: {
        name: user.name,
        phone: user.phone,
        coins: user.coins,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
