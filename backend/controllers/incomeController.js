import incomeModel from "../models/incomeSchema.js"; // ✅ make sure this path is correct

// ✅ ADD INCOME
export const addIncome = async (req, res) => {
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

    const newIncome = new incomeModel({
      userId,
      title,
      amount: parsedAmount,
      date,
      category,
      description,
    });

    await newIncome.save();
    res.status(200).json({
      message: "Income added successfully",
      data: newIncome,
    });
  } catch (error) {
    console.error("Error adding income:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ DELETE INCOME

export const deleteIncome = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const deletedIncome = await incomeModel.findOneAndDelete({
      _id: id,
      userId: userId,
    });

    if (!deletedIncome) {
      return res.status(404).json({ message: "Income not found" });
    }

    res.status(200).json({
      message: "Income deleted successfully",
      data: deletedIncome,
    });

  } catch (error) {
    console.error("Error deleting income:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ UPDATE INCOME
export const updateIncome = async (req, res) => {
    const { id } = req.params;
    const { title, amount, date, category, description } = req.body;

    try {
        const incomeUpdate = await incomeModel.findById(id);
            

        if (!incomeUpdate) {
            return res.status(404).json({ message: "Income not found" });
        }
        incomeUpdate.title = title|| incomeUpdate.title;
        incomeUpdate.amount = amount || incomeUpdate.amount;
        incomeUpdate.date = date || incomeUpdate.date;
        incomeUpdate.category = category || incomeUpdate.category;
        incomeUpdate.description = description || incomeUpdate.description;

        await incomeUpdate.save();

        res.status(200).json({ message: "Income updated successfully", data: incomeUpdate });
  } catch (error) {
    console.error("Error updating income:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ GET ALL INCOME FOR LOGGED IN USER
export const getIncome = async (req, res) => {
  try {
    const userId = req.userId; // ✅ from auth middleware

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: No user ID" });
    }

    const incomeList = await incomeModel.find({ userId }).sort({ date: -1 });
    res.status(200).json({
      message: "Income fetched successfully",
      data: incomeList,
    });
  } catch (error) {
    console.error("Error fetching income:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
