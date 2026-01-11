import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/userModel';
import Category from '../models/categoryModel';

dotenv.config();

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      token,
      user: {
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const register = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password } = req.body;

  try {
    // 1. Optimize check with a single query
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      const field = existingUser.email === email ? 'Email' : 'Username';
      res.status(400).json({ message: `${field} is already in use` });
      return;
    }

    const user = new User({ username, email, password });
    await user.save();

    // 2. Default Categories
    const defaultCategories = [
      { name: 'Food', icon: '🍔', type: 'expense', userId: user._id },
      { name: 'Transport', icon: '🚗', type: 'expense', userId: user._id },
      { name: 'Bills', icon: '💡', type: 'expense', userId: user._id },
      { name: 'Shopping', icon: '🛍️', type: 'expense', userId: user._id },
      { name: 'Health', icon: '🩺', type: 'expense', userId: user._id },
      { name: 'Education', icon: '🎓', type: 'expense', userId: user._id },
      { name: 'Groceries', icon: '🛒', type: 'expense', userId: user._id },
      { name: 'Entertainment', icon: '🎭', type: 'expense', userId: user._id },
      { name: 'Rent', icon: '🏠', type: 'expense', userId: user._id },
      { name: 'Salary', icon: '💼', type: 'income', userId: user._id },
      { name: 'Freelance', icon: '🖥️', type: 'income', userId: user._id },
      { name: 'Investments', icon: '📈', type: 'income', userId: user._id }
    ];

    // Use insertMany for bulk insertion - much faster
    await Category.insertMany(defaultCategories);

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' } // Consistent with login
    );

    res.status(201).json({ 
      success: true,
      message: "User registered successfully",
      token,
      user: {
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error(`[register] Error: ${(error as Error).message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

