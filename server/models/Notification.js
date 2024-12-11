const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false }, // Track if notification has been read
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Notification', notificationSchema);
