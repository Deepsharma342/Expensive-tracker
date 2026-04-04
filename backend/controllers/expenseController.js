import expenseModel from "../models/expenseSchema.js";

// ✅ ADD INCOME
export const addExpense = async (req, res) => {
  try {
    const userId = req.userId; // ✅ comes from authMiddleware
    const { title, amount, date, category, description } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: No user ID" });
    }

    if (!title || !amount || !date || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const parsedAmount = Number(amount);
    if (isNaN(parsedAmount)) {
      return res.status(400).json({ message: "Amount must be a valid number" });
    }

    const newExpense = new expenseModel({
      userId,
      title,
      amount: parsedAmount,
      date,
      category,
      description,
      
    });

    await newExpense.save();
    res.status(200).json({
      message: "Expense added successfully",
      data: newExpense,
    });
  } catch (error) {
    console.error("Error adding expense:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ DELETE EXPENSE
export const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const deletedExpense = await expenseModel.findOneAndDelete({
      _id: id,
      userId: userId,
    });
    if (!deletedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.status(200).json({
      message: "Expense deleted successfully",
      data: deletedExpense,
    });
  } catch (error) {
    console.error("Error deleting expense:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ UPDATE EXPENSE
export const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, amount, date, category, description } = req.body;

    const expenseUpdate = await expenseModel.findById(id);
    if (!expenseUpdate)
      return res.status(404).json({ message: "Expense not found" });

    expenseUpdate.title = title || expenseUpdate.title;
    expenseUpdate.amount = amount || expenseUpdate.amount;
    expenseUpdate.date = date || expenseUpdate.date;
    expenseUpdate.category = category || expenseUpdate.category;
    expenseUpdate.description = description || expenseUpdate.description;

    await expenseUpdate.save();

    res.status(200).json({
      message: "Expense updated successfully",
      data: expenseUpdate,
    });
  } catch (error) {
    console.error("Error updating expense:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ GET ALL EXPENSES FOR LOGGED IN USER
export const getExpenses = async (req, res) => {
  try {
    const userId = req.userId; // ✅ from auth middleware

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: No user ID" });
    }

    const expenseList = await expenseModel.find({ userId }).sort({ date: -1 });
    res.status(200).json({
      message: "Expenses fetched successfully",
      data: expenseList,
    });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
