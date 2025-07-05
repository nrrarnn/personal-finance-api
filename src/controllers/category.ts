import { Request, Response } from 'express';
import Category from '../models/categoryModel';

export const addCategory = async (req: Request, res: Response): Promise<void> => {
  const { name, icon, type } = req.body;
  const userId = req.user?.userId;

  if (!userId) {
    res.status(400).json({ message: "User ID is missing" });
    return;
  }

  if (!name) {
    res.status(400).json({ message: "Category name is required" });
    return;
  }

  try {
    const category = new Category({
      name,
      icon,
      type,
      userId,
    });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: "Error creating category", error });
  }
};

export const getCategories = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.userId;
  try {
    const categories = await Category.find({ userId });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error });
  }
};

export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = req.user?.userId;

  if (!userId) {
    res.status(400).json({ message: "User ID is missing" });
    return;
  }

  try {
    const category = await Category.findOne({ _id: id, userId });

    if (!category) {
      res.status(404).json({ message: 'Category not found or unauthorized' });
      return;
    }

    await Category.findByIdAndDelete(id);
    res.status(200).json({ message: 'Category Deleted' });
  } catch {
    res.status(500).json({ message: 'Server Error' });
  }
};

