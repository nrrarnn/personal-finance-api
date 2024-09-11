const IncomeSchema = require("../models/incomeModel")
const ExpenseSchema = require("../models/expenseModel")


exports.getBalance = async (req, res) => {
  const userId = req.user.userId;
  try {
    const incomes = await IncomeSchema.find({ userId });
    const expenses = await ExpenseSchema.find({ userId });

    const totalIncome = incomes.reduce((acc, income) => acc + income.amount, 0);
    const totalExpense = expenses.reduce((acc, expense) => acc + expense.amount, 0);
    const balance = totalIncome - totalExpense;
    res.status(200).json({ balance, totalIncome, totalExpense })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}