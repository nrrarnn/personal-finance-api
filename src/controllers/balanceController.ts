import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Transaction from '../models/transactionModel';

export const getBalance = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    interface AggregationResult {
      _id: 'income' | 'expense';
      total: number;
    }

    const stats = await Transaction.aggregate<AggregationResult>([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" }
        }
      }
    ]);

    // Map results to variables
    const totals = stats.reduce((acc, curr) => {
      acc[curr._id] = curr.total;
      return acc;
    }, { income: 0, expense: 0 });


    const totalIncome = totals.income;
    const totalExpense = totals.expense;
    const balance = totalIncome - totalExpense;

    res.status(200).json({ 
      success: true,
      data: {
        balance, 
        totalIncome, 
        totalExpense 
      }
    });

  } catch (error) {
    console.error(`[getBalance] Error: ${(error as Error).message}`);
    res.status(500).json({ message: "Server error while calculating balance" });
  }
};
