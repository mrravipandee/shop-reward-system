import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import Transaction from "@/models/Transaction";

// --- Shop Code Validator (MM + '70' + HH) ---
/**
 * Validates the shop code against the current time in Asia/Kolkata (IST).
 * Logic: MM + '70' + HH (24-hour format, with leading zeros).
 * @param {string} code - The submitted shop code.
 * @returns {boolean} True if the code matches the IST time.
 */
// --- MODIFIED validateShopCode function ---
const validateShopCode = (code: string): boolean => {
  const timeZone = "Asia/Kolkata";
  const dateOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit', minute: '2-digit', hour12: false, timeZone
  };
  
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-US', dateOptions);
  
  // 1. Calculate Expected Code (Current Minute)
  const [currentHours, currentMinutes] = formatter.format(now).split(':');
  const expectedCurrent = `${currentMinutes}70${currentHours}`;
  
  // 2. Calculate Previous Minute's Code
  // Create a Date object for 60 seconds ago
  const oneMinuteAgo = new Date(now.getTime() - 60000); 
  const [prevHours, prevMinutes] = formatter.format(oneMinuteAgo).split(':');
  const expectedPrevious = `${prevMinutes}70${prevHours}`;
  
  // 3. Log and Validate
  console.log(`[ShopCode] Sub: ${code}, Expected: [${expectedPrevious}, ${expectedCurrent}]`);
  
  return code === expectedCurrent || code === expectedPrevious;
};


export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { customerPhone, amount, coinsEarned, paymentMode, shopCode } = body;

    // 1. Validate Shop Code
    if (!validateShopCode(shopCode)) {
      // NOTE: Using 401 (Unauthorized) is often better than 403 (Forbidden) for authentication issues.
      return NextResponse.json({ error: "Invalid Security Code" }, { status: 401 });
    }

    // 2. Find User
    const user = await User.findOne({ phone: customerPhone });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 3. Update User Stats (Atomic Update)
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
      { new: true } // Return the updated document
    );

    // 4. Record Transaction
    await Transaction.create({
      userId: user._id,
      amount: Number(amount),
      coinsEarned: Number(coinsEarned),
      paymentMode,
      shopCode // The submitted code is stored for audit (as per your schema)
    });

    // 5. Success Response
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