import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";

// Cloudinary setup
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: Request) {
  try {
    await dbConnect();

    // Parse formData
    const form = await req.formData();

    const name = form.get("name") as string;
    const dob = form.get("dob") as string;
    const phone = form.get("phone") as string;
    const password = form.get("password") as string;
    const image = form.get("image"); // File | string | null

    if (!name || !dob || !phone || !password) {
      return NextResponse.json(
        { error: "All fields required" },
        { status: 400 }
      );
    }

    const exists = await User.findOne({ phone });
    if (exists) {
      return NextResponse.json(
        { error: "Phone already registered" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    let photoUrl = "";

    // Handle Cloudinary upload only if image is a File
    if (image && typeof image !== "string") {
      const fileBuffer = Buffer.from(await image.arrayBuffer());

      const uploadRes = await new Promise<{ secure_url: string }>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({}, (err, result) => {
            if (err) reject(err);
            resolve(result as { secure_url: string });
          })
          .end(fileBuffer);
      });

      photoUrl = uploadRes.secure_url;
    }

    // Create new user
    await User.create({
      name,
      dob,
      phone,
      password: hashedPassword,
      photo: photoUrl,
    });

    return NextResponse.json({ message: "User registered successfully" });
  } catch (err: unknown) {
    console.error("REGISTER API ERROR:", err);
    return NextResponse.json(
      { error: "Internal Server Error", details: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
