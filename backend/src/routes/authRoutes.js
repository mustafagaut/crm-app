const express = require('express');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const { signup, login, refreshAccessToken } = require('../controllers/authController');
 
const router = express.Router();
 
// Login rate limit: 3 attempts per 10 minutes, per IP
const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 3,
  standardHeaders: true, // return RateLimit-* headers
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login attempts. Please try again after 10 minutes.',
  },
});
 
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array().map((error) => error.msg) });
  }
  next();
};
 
router.post(
  '/signup',
  [
    body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  validate,
  signup
);
 
router.post(
  '/login',
  loginLimiter,
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  login
);
 
router.post('/refresh', refreshAccessToken);
 
module.exports = router;