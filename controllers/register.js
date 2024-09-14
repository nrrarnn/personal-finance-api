const Category = require("../models/categoryModel");
const User = require("../models/userModel");
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({ username, email, password });

    await user.save();

    const defaultCategories = ["Food", "Transport", "Bills"];
      for (const categoryName of defaultCategories) {
        try {
          const category = new Category({
            name: categoryName,
            userId: user._id,
        });
        await category.save();
        } catch (error) {
        console.error(`Error creating category ${categoryName}:`, error);
      }
    }


    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token });
  } catch (error) {
    console.error(error); 
    res.status(500).json({ message: 'Server error' });
  }
};
