import express from "express";
import Budget from "../models/Budget.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/* CREATE OR UPDATE BUDGET */

router.post("/", authMiddleware, async (req, res) => {
  try {

    const { category, month, amount } = req.body;

    const budget = await Budget.findOneAndUpdate(
      { user: req.user, category, month },
      { amount },
      { upsert: true, new: true }
    );

    res.json(budget);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


/* GET BUDGETS BY MONTH */

router.get("/", authMiddleware, async (req, res) => {
  try {

    const { month } = req.query;

    const budgets = await Budget.find({
      user: req.user,
      month
    });

    res.json(budgets);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


/* UPDATE BUDGET */

router.put("/:id", authMiddleware, async (req, res) => {
  try {

    const { category, amount, month } = req.body;

    const updatedBudget = await Budget.findOneAndUpdate(
      { _id: req.params.id, user: req.user }, // ensures ownership
      { category, amount, month },
      { new: true }
    );

    if (!updatedBudget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    res.json(updatedBudget);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


/* DELETE BUDGET */

router.delete("/:id", authMiddleware, async (req, res) => {
  try {

    const deletedBudget = await Budget.findOneAndDelete({
      _id: req.params.id,
      user: req.user
    });

    if (!deletedBudget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    res.json({ message: "Budget deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;