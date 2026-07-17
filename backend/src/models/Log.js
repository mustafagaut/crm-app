const mongoose = require('mongoose');

const logSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: [true, 'User email is required to audit actions'],
      lowercase: true,
      trim: true,
    },
    action: {
      type: String,
      required: true,
      enum: {
        values: ['ADD_CONTACT', 'EDIT_CONTACT', 'DELETE_CONTACT'],
        message: '{VALUE} is not a recognizable system event',
      },
    },
    details: {
      type: String,
      required: [true, 'Action description details are required'],
    },
  },
  { 
    timestamps: { createdAt: true, updatedAt: false } // We only need the creation timestamp for an audit trail
  }
);

module.exports = mongoose.model('Log', logSchema);