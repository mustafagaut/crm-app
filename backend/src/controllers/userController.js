exports.getProfile = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Profile fetched successfully',
      data: {
        user: req.user,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch profile', errors: [error.message] });
  }
};
