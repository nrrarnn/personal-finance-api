const IncomeSchema = require("../models/incomeModel")

exports.addIncome = async (req, res) => {
  const { title, amount, category, description } = req.body;

  const userId = req.user?.userId; 

  if (!userId) {
    return res.status(400).json({ message: "User ID is missing" });
  }

  if (!title || !amount || !category ||!description) {
    return res.status(400).json({ message: "All fields are required" });
  }
  
  if (typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ message: "Amount must be a positive number" });
  }

  const income = IncomeSchema({
    title,
    amount,
    category,
    description,
    userId 
  })

  try {
    await income.save()
    res.status(200).json({ message: "Income added successfully" })
  } catch (error) {
    res.status(500).json({ message: "Server error" })  
    console.error(error)
  }
}


exports.getIncomes = async (req, res) => {
  try {
    const incomes = await IncomeSchema.find({ userId: req.user.userId }).sort({createdAt: -1 })
    res.status(200).json(incomes)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}
exports.deleteIncome = async (req, res) => {
    try {
        const { id } = req.params;

        const income = await IncomeSchema.findOne({ _id: id, userId: req.user.userId });

        if (!income) {
            return res.status(404).json({ message: 'Income not found or unauthorized' });
        }

        await IncomeSchema.findByIdAndDelete(id);

        res.status(200).json({ message: 'Income Deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.updateIncome = async (req, res) => {
  const { id } = req.params;
  const { title, amount, category, description } = req.body;

  const userId = req.user?.userId;

  if (!userId) {
    return res.status(400).json({ message: "User  ID is missing" });
  }

  if (!title || !amount || !category || !description) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ message: "Amount must be a positive number" });
  }

  try {
    const income = await IncomeSchema.findOne({ _id: id, userId });

    if (!income) {
      return res.status(404).json({ message: 'Income not found or unauthorized' });
    }

    income.title = title;
    income.amount = amount;
    income.category = category;
    income.description = description;

    await income.save(); 

    res.status(200).json({ message: "Income updated successfully", income });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getIncomesByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    console.log("Category:", category);
    console.log("UserId:", req.user.userId);

    const incomes = await IncomeSchema.find({
      category: category,
      userId: req.user.userId
    });

    console.log("Incomes found:", incomes);

    if (incomes.length === 0) {
      return res.status(404).json({ message: "No incomes found for this category" });
    }

    res.json(incomes);
  } catch (error) {
    console.error("Error fetching incomes by category:", error); 
    res.status(500).json({ message: "Error fetching incomes by category", error });
  }
};


