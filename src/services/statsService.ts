import Transaction from '../models/transactionModel';
import mongoose from 'mongoose';
import { CategoryStat } from '../types/stats';

/**
 * Gets aggregated expense statistics by category for a specific month and year.
 * 
 * @param userId - The ID of the user
 * @param month - Month (1-12)
 * @param year - Year (e.g., 2023)
 * @returns Array of category statistics sorted by total amount descending
 */
export const getMonthlyCategoryStats = async (
  userId: string, 
  month: number, 
  year: number
): Promise<CategoryStat[]> => {
  // Use UTC to avoid timezone issues when calculating month boundaries
  const startDate = new Date(Date.UTC(year, month - 1, 1));
  const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

  const stats = await Transaction.aggregate<CategoryStat>([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        type: 'expense',
        date: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: "$category",
        totalAmount: { $sum: "$amount" },
        count: { $sum: 1 }
      }
    },
    { $sort: { totalAmount: -1 } }
  ]);

  return stats; 
};
