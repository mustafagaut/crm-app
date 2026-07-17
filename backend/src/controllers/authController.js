const jwt = require('jsonwebtoken');
const User = require('../models/User');

// UPDATED: Now includes role in token payload so frontend & backend middleware can read it
const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: '15m',
  });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '7d',
  });
};

exports.signup = async (req, res) => {
  try {
    // Added 'role' and 'adminSecretKey' from request body
    const { name, email, password, role, adminSecretKey } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // 1. Determine safe role assignment
    let finalRole = 'User'; 
    if (role === 'Admin') {
      const serverSecret = process.env.ADMIN_SECRET_KEY;
      
      // Strict guard check against secret passkey
      if (adminSecretKey && adminSecretKey === serverSecret) {
        finalRole = 'Admin';
      } else {
        return res.status(403).json({ 
          success: false, 
          message: 'Invalid Admin Secret Passkey. Unauthorized role assignment.' 
        });
      }
    }

    // 2. Create user with mapped final role
    const user = await User.create({ name, email, password, role: finalRole });

    const token = generateToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    res.status(201).json({
      success: true,
      message: `${user.role} registered successfully`,
      data: {
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
        token,
        refreshToken,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Signup failed', errors: [error.message] });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Pass role down to token generator signature
    const token = generateToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
        token,
        refreshToken,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Login failed', errors: [error.message] });
  }
};