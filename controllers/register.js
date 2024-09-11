const User = require("../models/userModel");
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Cek apakah user sudah ada
    // let user = await User.findOne({ email });
    // if (user) {
    //   return res.status(400).json({ message: 'User already exists' });
    // }

    // Buat user baru
    user = new User({ username, email, password });

    // Simpan user ke database
    await user.save();

    // Buat JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Kirim respons
    res.status(201).json({ token });
  } catch (error) {
    console.error(error); // Tambahkan informasi error untuk debugging
    res.status(500).json({ message: 'Server error' });
  }
};
