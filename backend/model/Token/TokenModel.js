const mongoose = require('mongoose');

const fcmTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ['student', 'teacher', 'admin', 'guest'],
    default: 'student',
  },
  deviceInfo: {
    browser: { type: String },
    os: { type: String },
    ip: { type: String },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastUsedAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('FcmToken', fcmTokenSchema);
