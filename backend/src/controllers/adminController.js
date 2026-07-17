const Log = require('../models/Log');
const User = require('../models/User');

// @desc    Get all system activity/audit logs
// @route   GET /api/admin/logs
// @access  Private (Admin Only)
exports.getSystemLogs = async (req, res) => {
  try {
    // Fetch logs, sorting by the newest timestamp first, capping at 100 entries
    const logs = await Log.find()
      .sort({ createdAt: -1 })
      .limit(100);
    
    res.json({
      success: true,
      count: logs.length,
      data: logs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve system audit logs',
      errors: [error.message],
    });
  }
};

// @desc    Get system summary metrics (Bonus utility for a dashboard)
// @route   GET /api/admin/dashboard-stats
// @access  Private (Admin Only)
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const adminCount = await User.countDocuments({ role: 'Admin' });
    const standardUsers = totalUsers - adminCount;

    res.json({
      success: true,
      data: {
        totalUsers,
        adminCount,
        standardUsers
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard metrics' });
  }
};