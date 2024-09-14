const ExpenseSchema = require("../models/expenseModel")

exports.addExpense = async (req, res) => {
  const {title, amount, category, description}  = req.body

  const userId = req.user.userId;

  const expense = ExpenseSchema({
    title,
    amount,
    category,
    description,
    userId
  })

  try {
    if(!title || !amount || !category || !description) {
      return res.status(400).json({ message: "All fields are required" })
    }
    if(amount <= 0 || !amount === 'number') {
      return res.status(400).json({ message: "Amount must be a positive number" })
    }
    await expense.save()
    res.status(200).json({ message: "expense added successfully" })
  } catch (error) {
    res.status(500).json({ message: "Server error" })    
  }
}


exports.getExpenses = async (req, res) => {
  try {
    const expenses = await ExpenseSchema.find({ userId: req.user.userId }).sort({createdAt: -1 })
    res.status(200).json(expenses)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}
exports.deleteExpense = async (req, res) =>{
    try {
        const { id } = req.params;

        const expense = await ExpenseSchema.findOne({ _id: id, userId: req.user.userId });

        if (!expense) {
            return res.status(404).json({ message: 'Income not found or unauthorized' });
        }

        await ExpenseSchema.findByIdAndDelete(id);

        res.status(200).json({ message: 'Income Deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
}

exports.getExpensesByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    console.log("Category:", category);
    console.log("UserId:", req.user.userId);

    const expenses = await ExpenseSchema.find({
      category: category,
      userId: req.user.userId
    });

    console.log("Expenses found:", expenses);

    if (expenses.length === 0) {
      return res.status(404).json({ message: "No expenses found for this category" });
    }

    res.json(expenses);
  } catch (error) {
    console.error("Error fetching expenses by category:", error); // Log error untuk pelacakan
    res.status(500).json({ message: "Error fetching expenses by category", error });
  }
};

