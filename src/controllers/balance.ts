import { Request, Response } from 'express';
import Income from '../models/incomeModel';
import Expense from '../models/expenseModel';

export const getBalance = async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  try {
    const [incomes, expenses] = await Promise.all([
      Income.find({ userId }),
      Expense.find({ userId }),
    ]);

    const totalIncome = incomes.reduce((acc, income) => acc + income.amount, 0);
    const totalExpense = expenses.reduce((acc, expense) => acc + expense.amount, 0);
    const balance = totalIncome - totalExpense;

    res.status(200).json({ balance, totalIncome, totalExpense });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}