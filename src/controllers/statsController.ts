import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Transaction from '../models/transactionModel';
import { getMonthlyCategoryStats } from '../services/statsService';
import { StatsQuery, MonthlyStatsResponse, PieChartQuery, PieChartResponse } from '../types/stats';

export const getCategoryStats = async (
  req: Request<{}, {}, {}, StatsQuery>, 
  res: Response<MonthlyStatsResponse>
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    
    if (!userId) {
      res.status(401).json({ 
        success: false, 
        message: "User not authenticated" 
      });
      return;
    }

    const { month, year } = req.query;

    if (!month || !year) {
      res.status(400).json({ 
        success: false, 
        message: "Required query parameters 'month' and 'year' are missing" 
      });
      return;
    }

    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);

    if (isNaN(monthNum) || isNaN(yearNum) || monthNum < 1 || monthNum > 12) {
      res.status(400).json({ 
        success: false, 
        message: "Invalid month or year provided" 
      });
      return;
    }

    const startDate = new Date(Date.UTC(yearNum, monthNum - 1, 1));
    const endDate = new Date(Date.UTC(yearNum, monthNum, 0, 23, 59, 59, 999));

    const stats = await Transaction.aggregate([

      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
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

      {
        $lookup: {
          from: "categories",       
          localField: "_id",        
          foreignField: "_id",      
          as: "categoryInfo"       
        }
      },

      {
        $unwind: "$categoryInfo" 
      },

      {
        $project: {
          _id: 0,                            
          categoryId: "$_id",               
          categoryName: "$categoryInfo.name", 
          categoryIcon: "$categoryInfo.icon", 
          type: "$categoryInfo.type",       
          totalAmount: 1,                    
          count: 1                         
        }
      },
      { $sort: { totalAmount: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error(`[getCategoryStats] Error: ${(error as Error).message}`);
    res.status(500).json({ 
      success: false, 
      message: "An internal server error occurred while fetching statistics" 
    });
  }
};

/**
 * Controller to fetch data formatted for a Pie Chart (Monthly breakdown by category).
 */
export const getPieChartData = async (
  req: Request<{}, {}, {}, PieChartQuery>,
  res: Response<PieChartResponse>
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: "User not authenticated" });
      return;
    }

    const { month, year, type = 'expense' } = req.query;

    if (!month || !year) {
      res.status(400).json({ success: false, message: "Month and year are required" });
      return;
    }

    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);

    // Date range handling using UTC to avoid timezone shifts
    const startDate = new Date(Date.UTC(yearNum, monthNum - 1, 1));
    const endDate = new Date(Date.UTC(yearNum, monthNum, 0, 23, 59, 59, 999));

    const stats = await Transaction.aggregate([
      {
        $match: {
          type,
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: "$userId",
          totalAmount: { $sum: "$amount" }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails"
        }
      },
      { 
        $unwind: {
          path: "$userDetails",
          preserveNullAndEmptyArrays: false
        }
      },
      {
        $project: {
          _id: 0,
          label: { $ifNull: ["$userDetails.email", "Unknown"] },
          value: "$totalAmount",
          color: "#3b82f6",
          icon: "👤"
        }
      },

      { $sort: { value: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error(`[getPieChartData] Error: ${(error as Error).message}`);
    res.status(500).json({ success: false, message: "Server error while fetching chart data" });
  }
};

/**
 * Controller to fetch statistics for the authenticated user.
 */
export const getStatsByUser = async (
  req: Request<{}, {}, {}, StatsQuery>,
  res: Response<MonthlyStatsResponse>
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    
    if (!userId) {
      res.status(401).json({ 
        success: false, 
        message: "User not authenticated" 
      });
      return;
    }

    const { month, year } = req.query;

    if (!month || !year) {
      res.status(400).json({ 
        success: false, 
        message: "Required query parameters 'month' and 'year' are missing" 
      });
      return;
    }

    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);

    if (isNaN(monthNum) || isNaN(yearNum) || monthNum < 1 || monthNum > 12) {
      res.status(400).json({ 
        success: false, 
        message: "Invalid month or year provided" 
      });
      return;
    }

    const startDate = new Date(Date.UTC(yearNum, monthNum - 1, 1));
    const endDate = new Date(Date.UTC(yearNum, monthNum, 0, 23, 59, 59, 999));

    const stats = await Transaction.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: "$userId",
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      },
      { $sort: { totalAmount: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error(`[getStatsByUser] Error: ${(error as Error).message}`);
    res.status(500).json({ 
      success: false, 
      message: "An internal server error occurred while fetching user statistics" 
    });
  }
};
