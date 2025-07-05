import { Request, Response } from 'express';
import Income from '../models/incomeModel';

export const addIncome = async (req: Request, res: Response): Promise<void> => {
  const { title, amount, category, description } = req.body;
  const userId = req.user?.userId;

  if (!userId) {
    res.status(400).json({ message: 'User ID is missing' });
    return;
  }

  if (!title || !amount || !category || !description) {
    res.status(400).json({ message: 'All fields are required' });
    return;
  }

  if (typeof amount !== 'number' || amount <= 0) {
    res.status(400).json({ message: 'Amount must be a positive number' });
    return;
  }

  try {
    const income = new Income({ title, amount, category, description, userId });
    await income.save();
    res.status(200).json({ message: 'Income added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getIncomes = async (req: Request, res: Response): Promise<void> => {
  try {
    const incomes = await Income.find({ userId: req.user!.userId }).sort({ createdAt: -1 });
    res.status(200).json(incomes);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteIncome = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const income = await Income.findOne({ _id: id, userId: req.user!.userId });

    if (!income) {
      res.status(404).json({ message: 'Income not found or unauthorized' });
      return;
    }

    await Income.findByIdAndDelete(id);
    res.status(200).json({ message: 'Income Deleted' });
  } catch {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const updateIncome = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { title, amount, category, description } = req.body;
  const userId = req.user?.userId;

  if (!userId) {
    res.status(400).json({ message: 'User ID is missing' });
    return;
  }

  if (!title || !amount || !category || !description) {
    res.status(400).json({ message: 'All fields are required' });
    return;
  }

  if (typeof amount !== 'number' || amount <= 0) {
    res.status(400).json({ message: 'Amount must be a positive number' });
    return;
  }

  try {
    const income = await Income.findOne({ _id: id, userId });

    if (!income) {
      res.status(404).json({ message: 'Income not found or unauthorized' });
      return;
    }

    income.title = title;
    income.amount = amount;
    income.category = category;
    income.description = description;

    await income.save();
    res.status(200).json({ message: 'Income updated successfully', income });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getIncomesByCategory = async (req: Request, res: Response): Promise<void> => {
  const { category } = req.params;
  try {
    const incomes = await Income.find({ category, userId: req.user!.userId });

    if (incomes.length === 0) {
      res.status(404).json({ message: 'No incomes found for this category' });
      return;
    }

    res.json(incomes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching incomes by category', error });
  }
};


