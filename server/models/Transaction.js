import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    amount: { type: Number, required: true },
    type: { type: String, enum: ["income", "expense"], required: true },
    category: { type: String, required: true },
    date: { type: Date, required: true },
    description: String,
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);