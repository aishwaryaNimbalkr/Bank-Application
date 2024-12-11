const express = require('express');
const { registerUser, loginUser, getMe, verifyOTP,forgotPassword,resetPassword } = require('../controllers/authController');
const protect = require('../midleware/authMiddleware');
const router = express.Router();

router.post('/register', registerUser); // Step 1: Register and send OTP
router.post('/verify-otp', verifyOTP); // Step 2: Verify OTP
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.post('/forgot-password', forgotPassword); // Step 1
router.post('/reset-password/:token', resetPassword); // Step 2

module.exports = router;
