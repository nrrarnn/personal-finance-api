import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Transaction, { ITransaction } from '../models/transactionModel';
import Category from '../models/categoryModel';
import { FilterQuery } from 'mongoose';

interface TransactionQuery extends FilterQuery<ITransaction> {
  userId: string;
  type?: 'income' | 'expense';
}

export const createTransaction = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, amount, category, date, description, type } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    if (!title || !amount || !category || !type) {
      res.status(400).json({ message: "Title, amount, category, and type are required" });
      return;
    }

    if (amount <= 0) {
      res.status(400).json({ message: "Amount must be greater than 0" });
      return;
    }

    // Security: Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(category)) {
      res.status(400).json({ message: "Invalid category ID format" });
      return;
    }

    const categoryExists = await Category.findOne({ _id: category, userId });
    if (!categoryExists) {
      res.status(404).json({ message: "Category not found or unauthorized" });
      return;
    }

    const transaction = new Transaction({
      title,
      amount,
      category,
      date: date || new Date(),
      description,
      type,
      userId
    });

    await transaction.save();
    res.status(201).json({ 
      success: true,
      message: "Transaction created successfully", 
      transaction 
    });
  } catch (error) {
    console.error(`[createTransaction] Error: ${(error as Error).message}`);
    res.status(500).json({ message: "Server error while creating transaction" });
  }
};

export const getTransactions = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const { type } = req.query;
    const query: TransactionQuery = { userId };

    if (type && (type === 'income' || type === 'expense')) {
      query.type = type;
    }

    const transactions = await Transaction.find(query as FilterQuery<ITransaction>)
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
    const { id: transactionId } = req.params;
    const { title, amount, category, date, description, type } = req.body;
    const userId = req.user?.userId;

    if (!mongoose.Types.ObjectId.isValid(transactionId)) {
      res.status(400).json({ message: "Invalid transaction ID format" });
      return;
    }

    const transaction = await Transaction.findOne({ _id: transactionId, userId });
    if (!transaction) {
      res.status(404).json({ message: "Transaction not found or unauthorized" });
      return;
    }

    if (category) {
      if (!mongoose.Types.ObjectId.isValid(category)) {
        res.status(400).json({ message: "Invalid category ID format" });
        return;
      }
      const categoryExists = await Category.findOne({ _id: category, userId });
      if (!categoryExists) {
        res.status(404).json({ message: "Category not found or unauthorized" });
        return;
      }
      transaction.category = category;
    }

    if (amount !== undefined) {
      if (amount <= 0) {
        res.status(400).json({ message: "Amount must be greater than 0" });
        return;
      }
      transaction.amount = amount;
    }
    
    if (date) transaction.date = date;
    if (title) transaction.title = title;
    if (description !== undefined) transaction.description = description;
    if (type) transaction.type = type;

    await transaction.save();
    res.status(200).json({ 
      success: true,
      message: "Transaction updated successfully", 
      transaction 
    });
  } catch (error) {
    console.error(`[updateTransaction] Error: ${(error as Error).message}`);
    res.status(500).json({ message: "Server error while updating transaction" });
  }
};

export const deleteTransaction = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid transaction ID format" });
      return;
    }

    const transaction = await Transaction.findOneAndDelete({ _id: id, userId });
    
    if (!transaction) {
      res.status(404).json({ message: "Transaction not found or unauthorized" });
      return;
    }

    res.status(200).json({ 
      success: true,
      message: "Transaction deleted successfully" 
    });
  } catch (error) {
    console.error(`[deleteTransaction] Error: ${(error as Error).message}`);
    res.status(500).json({ message: "Server error while deleting transaction" });
  }
};

export const getTransactionsByCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }
    const { categoryId, month, year } = req.query as { categoryId: string, month: string, year: string };

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      res.status(400).json({ message: "Invalid category ID format" });
      return;
    }

    const categoryExists = await Category.findOne({ _id: categoryId, userId });
    if (!categoryExists) {
      res.status(404).json({ message: "Category not found or unauthorized" });
      return;
    }

    if (!month || !year) {
      res.status(400).json({ success: false, message: "Month and year are required" });
      return;
    }

    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);
    

    const startDate = new Date(Date.UTC(yearNum, monthNum - 1, 1));
    const endDate = new Date(Date.UTC(yearNum, monthNum, 0, 23, 59, 59, 999));
    const transactions = await Transaction.find({
      category: categoryId,
      userId,
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: -1 });
    const amountSum = transactions.reduce((sum, txn) => sum + txn.amount, 0);
    res.status(200).json({ totalAmount: amountSum, transactions });

  } catch (error) {
    console.error(`[getTransactionsByCategory] Error: ${(error as Error).message}`);
    res.status(500).json({ message: "Server error while fetching transactions by category" });
  }
};
