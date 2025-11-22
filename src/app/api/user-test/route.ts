import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";

export async function GET() {
  try {
    await dbConnect();

    const user = await User.create({
      phone: "9999999999",
      name: "Test User",
      coins: 10,
    });

    return Response.json({ success: true, user });
  } catch (error) {
    return Response.json({ success: false, error });
  }
}
