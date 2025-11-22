import { dbConnect } from "@/lib/dbConnect";

export async function GET() {
  try {
    await dbConnect();
    return Response.json({ success: true, message: "DB Connected!" });
  } catch (err) {
    return Response.json({ success: false, error: err });
  }
}
