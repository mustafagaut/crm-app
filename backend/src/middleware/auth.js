const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 1. Authentication Middleware: Validates the token session identity
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    // Attaches user data (including req.user.role) to the request object
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// 2. Authorization Middleware: Validates specific account role privileges
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // Safety check: ensure user object exists from authMiddleware
    if (!req.user) {
      return res.status(500).json({ success: false, message: 'Authentication middleware missing' });
    }

    // Check if the user's role matches any of the permitted roles
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Role (${req.user.role}) is unauthorized to access this resource` 
      });
    }

    next();
  };
};

// Export both functions cleanly
module.exports = {
  authMiddleware,
  authorize
};