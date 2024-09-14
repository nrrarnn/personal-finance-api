const CategorySchema = require("../models/categoryModel")

exports.addCategory = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Category name is required" });
  }

  try {
    const category = new CategorySchema({
      name,
      userId: req.user.userId,
    });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: "Error creating category", error });
  }
}


exports.getCategories = async (req, res) => {
  try {
    const userId = req.user.userId;
    const categories = await CategorySchema.find({ userId });
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Error fetching categories", error });
  }
};

exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await CategorySchema.findOne({ _id: id, userId: req.user.userId });

        if (!category) {
            return res.status(404).json({ message: 'Category not found or unauthorized' });
        }

        await CategorySchema.findByIdAndDelete(id);

        res.status(200).json({ message: 'Category Deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

