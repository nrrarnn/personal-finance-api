const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

// Login Controller
exports.login = async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' })

    res.status(200).json({
      token,
      user: {
        username: user.username,
        email: user.email
      }
    })
  } catch (error) {
    console.error(error)  
    res.status(500).json({ message: 'Server error' })
  }
}


