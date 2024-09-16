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

    const defaultCategories = [
      { name: "Food", icon: "🍔" , type: "expense"},
      { name: "Transport", icon: "🚗", type: "expense" },
      { name: "Bills", icon: "💡", type: "expense" },
      { name: "Shopping", icon: "🛍️" , type: "expense"},
      { name: "Health", icon: "🩺", type: "expense" },
      { name: "Education", icon: "🎓", type: "expense" },
      { name: "Groceries", icon: "🛒" , type: "expense"},
      { name: "Entertainment", icon: "🎭" , type: "expense"},
      { name: "Rent", icon: "🏠", type: "expense" },
      { name: "Salary", icon: "💼", type: "income" },
      { name: "Freelance", icon: "🖥️", type: "income" },
      { name: "Investments", icon: "📈", type: "income" },
    ];
      for (const {name, icon, type} of defaultCategories) {
        try {
          const category = new Category({
            name: name,
            icon: icon,
            type: type,
            userId: user._id,
        });
        await category.save();
        } catch (error) {
        console.error(`Error creating category ${name}:`, error);
      }
    }


    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token });
  } catch (error) {
    console.error(error); 
    res.status(500).json({ message: 'Server error' });
  }
};
