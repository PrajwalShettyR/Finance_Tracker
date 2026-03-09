import express from "express";
import Transaction from "../models/Transaction.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  const { month } = req.query;

  let filter = { user: req.user };

  if (month) {
    const start = new Date(`${month}-01`);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);
    filter.date = { $gte: start, $lt: end };
  }

  const transactions = await Transaction.find(filter).sort({ date: -1 });
  res.json(transactions);
});

router.post("/", authMiddleware, async (req, res) => {
  const transaction = await Transaction.create({
    ...req.body,
    user: req.user,
  });
  res.json(transaction);
});

router.put("/:id", authMiddleware, async (req, res) => {
  const updated = await Transaction.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});

router.delete("/:id", authMiddleware, async (req, res) => {
  await Transaction.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

export default router; 