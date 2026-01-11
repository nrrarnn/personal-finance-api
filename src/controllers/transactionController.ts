import { Request, Response } from 'express';
import Transaction from '../models/transactionModel';
import Category from '../models/categoryModel';

export const createTransaction = async (req: Request, res: Response): Promise<void> => {
  try {
    const { amount, category, date, description, type } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    if (!amount || !category || !type) {
      res.status(400).json({ message: "Amount, category, and type are required" });
      return;
    }

    const categoryExists = await Category.findOne({ _id: category, userId });
    if (!categoryExists) {
      res.status(404).json({ message: "Category not found or unauthorized" });
      return;
    }

    const transaction = new Transaction({
      amount,
      category,
      date: date || new Date(),
      description,
      type,
      userId
    });

    await transaction.save();
    res.status(201).json({ message: "Transaction created successfully", transaction });
  } catch (error) {
    console.error(`[createTransaction] Error: ${(error as Error).message}`);
    res.status(500).json({ message: "Server error while creating transaction" });
  }
};

export const getTransactions = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { type } = req.query;

    const query: any = { userId };

    if (type && (type === 'income' || type === 'expense')) {
      query.type = type;
    }

    const transactions = await Transaction.find(query)
      .populate('category')
      .sort({ date: -1 });

    res.status(200).json(transactions);
  } catch (error) {
    console.error(`[getTransactions] Error: ${(error as Error).message}`);
    res.status(500).json({ message: "Server error while fetching transactions" });
  }
};

export const updateTransaction = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { amount, category, date, description, type } = req.body;
    const userId = req.user?.userId;

    const transaction = await Transaction.findOne({ _id: id, userId });
    if (!transaction) {
      res.status(404).json({ message: "Transaction not found or unauthorized" });
      return;
    }

    if (category) {
      const categoryExists = await Category.findOne({ _id: category, userId });
      if (!categoryExists) {
        res.status(404).json({ message: "Category not found or unauthorized" });
        return;
      }
      transaction.category = category;
    }

    if (amount !== undefined) transaction.amount = amount;
    if (date) transaction.date = date;
    if (description !== undefined) transaction.description = description;
    if (type) transaction.type = type;

    await transaction.save();
    res.status(200).json({ message: "Transaction updated successfully", transaction });
  } catch (error) {
    console.error(`[updateTransaction] Error: ${(error as Error).message}`);
    res.status(500).json({ message: "Server error while updating transaction" });
  }
};


export const deleteTransaction = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const transaction = await Transaction.findOneAndDelete({ _id: id, userId });
    
    if (!transaction) {
      res.status(404).json({ message: "Transaction not found or unauthorized" });
      return;
    }

    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error(`[deleteTransaction] Error: ${(error as Error).message}`);
    res.status(500).json({ message: "Server error while deleting transaction" });
  }
};
