const express = require('express');
const { getUserBalance,changePassword, changeTransactionPin, logout,getNotifications, toggleNotifications, getAllUsers } = require('../controllers/userController');
const protect = require('../midleware/authMiddleware');

const router = express.Router();

router.get('/notifications', protect, getNotifications); 

router.post('/notifications/toggle', protect, toggleNotifications);

// Route to get user's balance (protected)
router.get('/balance', protect, getUserBalance);

// Route for password change (protected)
router.post('/change-password', protect, changePassword);

// Route for transaction pin change (protected)
router.post('/change-pin', protect, changeTransactionPin);

router.get('/users',protect, getAllUsers);



// Route for logout (protected)
router.post('/logout', protect, logout);

module.exports = router;
