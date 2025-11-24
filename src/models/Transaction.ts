import mongoose, { Schema, Document, Model } from "mongoose";

// --- Type Definition ---
export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number;
  coinsEarned: number;
  paymentMode: "cash" | "online";
  shopCode?: string; // MODIFIED: Made optional in the interface
  timestamp: Date;
}

// --- Schema Definition ---
const TransactionSchema = new Schema<ITransaction>({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: "User", 
    required: true,
    index: true // 💡 Optimization: Index for fast lookup by user
  },
  amount: { 
    type: Number, 
    required: true,
    min: 0.01 // 💡 Optimization: Basic validation for positive amount
  },
  coinsEarned: { 
    type: Number, 
    required: true,
    default: 0
  },
  paymentMode: { 
    type: String, 
    enum: ["cash", "online"], 
    required: true 
  },
  shopCode: { 
    type: String, 
    required: false // 🔑 CRITICAL MODIFICATION: The code is for runtime validation, not a mandatory data point.
  },
  timestamp: { 
    type: Date, 
    default: Date.now,
    index: true // 💡 Optimization: Index for efficient date range queries
  },
}, {
  // Option to automatically add 'createdAt' and 'updatedAt' fields
  timestamps: false, 
  collection: 'transactions' // Explicitly sets the MongoDB collection name
});

// --- Export Model ---
// Check if the model already exists to prevent re-compilation in development (Next.js hot reload)
export const Transaction: Model<ITransaction> = 
  (mongoose.models.Transaction as Model<ITransaction>) || 
  mongoose.model<ITransaction>("Transaction", TransactionSchema);
  
export default Transaction;