import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";

// This API route handles user login with just phone and password.
export async function POST(req: Request) {
  try {
    // Ensure database connection is established
    await dbConnect();
    
    // Destructure only phone and password from the request body
    const { phone, password } = await req.json();

    // Check if both required fields are present
    if (!phone || !password) {
      return NextResponse.json(
        { error: "Phone number and Password are required" },
        { status: 400 }
      );
    }

    // Find the user by their phone number
    const user = await User.findOne({ phone });
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // The DOB check is removed as per your request.
    
    // Compare the provided password with the hashed password in the database
    const passMatch = await bcrypt.compare(password, user.password);
    if (!passMatch) {
      return NextResponse.json(
        { error: "Password Incorrect" },
        { status: 401 }
      );
    }

    // SUCCESS → CREATE COOKIE and send response
    const res = NextResponse.json({
      message: "Login Successful",
      user: {
        name: user.name,
        phone: user.phone,
        coins: user.coins,
        coinValue: user.coinValue, 
        photo: user.photo,
        memberSince: user.createdAt,
      },
    });

    // Set the user authentication cookie
    res.cookies.set("user_token", user._id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return res;

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return NextResponse.json(
      { error: "Something went wrong during login" },
      { status: 500 }
    );
  }
}