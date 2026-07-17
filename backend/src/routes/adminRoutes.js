const express = require('express');
const router = express.Router();
//  FIX: Import authMiddleware instead of protect
const { authMiddleware, authorize } = require('../middleware/auth');   
const { getSystemLogs, getDashboardStats } = require('../controllers/adminController');


router.use(authMiddleware);
router.use(authorize('Admin'));

// Admin specific endpoints
router.get('/logs', getSystemLogs);
router.get('/dashboard-stats', getDashboardStats);

module.exports = router;