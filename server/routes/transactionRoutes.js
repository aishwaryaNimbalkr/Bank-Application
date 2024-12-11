// routes/transactionRoutes.js
const express = require('express');
const { createTransaction, getTransactions,getTransactionDetails } = require('../controllers/transactionController');
const protect = require('../midleware/authMiddleware'); // Importing the protect middleware

const router = express.Router();

// Route to create a transaction (protected)
router.post('/', protect, createTransaction);

// Route to get all transactions for the logged-in user (protected)
router.get('/', protect, getTransactions);

router.get('/transactions/:transactionId',protect, getTransactionDetails);

module.exports = router;
