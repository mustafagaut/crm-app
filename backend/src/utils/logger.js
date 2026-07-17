const Log = require('../models/Log');

/**
 * Creates an audit trail log entry in the database.
 * @param {string} userEmail - Email of the active authenticated user
 * @param {'ADD_CONTACT' | 'EDIT_CONTACT' | 'DELETE_CONTACT'} action - Enum action type
 * @param {string} details - Human-readable description of what was changed
 */
const createAuditLog = async (userEmail, action, details) => {
  try {
    await Log.create({
      userEmail,
      action,
      details,
    });
  } catch (error) {
    // We log the error internally to prevent database audit failures from crashing user requests
    console.error('CRITICAL: Failed to save system activity log to database:', error.message);
  }
};

module.exports = { createAuditLog };