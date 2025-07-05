import { Request, Response } from 'express';
import Expense from '../models/expenseModel';

export const addExpense = async (req: Request, res: Response): Promise<void> => {
  const { title, amount, category, description } = req.body;
  const userId = req.user?.userId;

  if (!userId) {
    res.status(400).json({ message: "User ID is missing" });
    return;
  }

  if (!title || !amount || !category || !description) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  if (typeof amount !== 'number' || amount <= 0) {
    res.status(400).json({ message: "Amount must be a positive number" });
    return;
  }

  try {
    const expense = new Expense({ title, amount, category, description, userId });
    await expense.save();
    res.status(200).json({ message: "Expense added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getExpenses = async (req: Request, res: Response): Promise<void> => {
  try {
    const expenses = await Expense.find({ userId: req.user!.userId }).sort({ createdAt: -1 });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteExpense = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const expense = await Expense.findOne({ _id: id, userId: req.user!.userId });

    if (!expense) {
      res.status(404).json({ message: 'Expense not found or unauthorized' });
      return;
    }

    await Expense.findByIdAndDelete(id);
    res.status(200).json({ message: 'Expense deleted' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateExpense = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { title, amount, category, description } = req.body;
  const userId = req.user?.userId;

  if (!userId) {
    res.status(400).json({ message: "User ID is missing" });
    return;
  }

  if (!title || !amount || !category || !description) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  if (typeof amount !== 'number' || amount <= 0) {
    res.status(400).json({ message: "Amount must be a positive number" });
    return;
  }

  try {
    const expense = await Expense.findOne({ _id: id, userId });

    if (!expense) {
      res.status(404).json({ message: 'Expense not found or unauthorized' });
      return;
    }

    expense.title = title;
    expense.amount = amount;
    expense.category = category;
    expense.description = description;

    await expense.save();
    res.status(200).json({ message: "Expense updated successfully", expense });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

export const getExpensesByCategory = async (req: Request, res: Response): Promise<void> => {
  const { category } = req.params;
  try {
    const expenses = await Expense.find({ category, userId: req.user!.userId });

    if (expenses.length === 0) {
      res.status(404).json({ message: "No expenses found for this category" });
      return;
    }

    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching expenses by category", error });
  }
};

