const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
  },
  otpExpires: {
    type: Date,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  balance: {
    type: Number,
    default: 0,
  },
  transactionPin: { 
    type: String, 
    required: true 
  },
  notificationsEnabled: {
    type: Boolean,
    default: true, // Notifications are enabled by default
  },
  resetPasswordToken: String,
});

const User = mongoose.model('User', userSchema);
module.exports = User;