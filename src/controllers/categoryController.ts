import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Category from '../models/categoryModel';
import Transaction from '../models/transactionModel';

export const addCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, icon, type } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    if (!name || !icon || !type) {
      res.status(400).json({ message: "Name, icon, and type are required" });
      return;
    }

    const category = new Category({
      name,
      icon,
      type,
      userId,
    });

    await category.save();
    res.status(201).json({ 
      success: true, 
      message: "Category created successfully", 
      category 
    });
  } catch (error) {
    console.error(`[addCategory] Error: ${(error as Error).message}`);
    res.status(500).json({ message: "Error creating category" });
  }
};

export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const categories = await Category.find({ userId });
    res.status(200).json(categories);
  } catch (error) {
    console.error(`[getCategories] Error: ${(error as Error).message}`);
    res.status(500).json({ message: "Error fetching categories" });
  }
};

export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, icon, type } = req.body;
    const userId = req.user?.userId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid category ID format" });
      return;
    }

    const category = await Category.findOne({ _id: id, userId });
    if (!category) {
      res.status(404).json({ message: "Category not found or unauthorized" });
      return;
    }

    if (name) category.name = name;
    if (icon) category.icon = icon;
    if (type) category.type = type;

    await category.save();
    res.status(200).json({ 
      success: true, 
      message: "Category updated successfully", 
      category 
    });
  } catch (error) {
    console.error(`[updateCategory] Error: ${(error as Error).message}`);
    res.status(500).json({ message: "Error updating category" });
  }
};

export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: "Invalid category ID format" });
      return;
    }

    const category = await Category.findOne({ _id: id, userId });
    
    if (!category) {
      res.status(404).json({ success: false, message: 'Category not found or unauthorized' });
      return;
    }

    const isUsed = await Transaction.exists({ category: id, userId });
    
    if (isUsed) {
      res.status(400).json({ 
        success: false, 
        message: 'Cannot delete category because it contains transactions. Please delete the transactions first.' 
      });
      return;
    }

    await category.deleteOne();

    res.status(200).json({ 
      success: true,
      message: 'Category deleted successfully' 
    });

  } catch (error) {
    console.error(`[deleteCategory] Error: ${(error as Error).message}`);
    res.status(500).json({ success: false, message: 'Server Error while deleting category' });
  }
};



