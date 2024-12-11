const Transaction = require('../models/Transaction');
const bcrypt = require('bcrypt')
const User = require('../models/User');
const Notification = require('../models/Notification');




exports.createTransaction = async (req, res) => {
  const { type, amount, recipient, transactionPin } = req.body;
  const userId = req.user._id; // Authenticated user ID from middleware

  try {
    // Fetch user making the transaction
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: 'User not found' });

    // Verify transaction pin
    const isPinValid = await bcrypt.compare(transactionPin, user.transactionPin);
    if (!isPinValid) return res.status(400).json({ message: 'Invalid transaction pin' });

    // Convert amount to a number
    const transactionAmount = Number(amount); // Ensure amount is a number
    if (isNaN(transactionAmount) || transactionAmount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    // Handle deposit
    if (type === 'deposit') {
      user.balance += transactionAmount; // Update user's balance

      // Log deposit transaction
      const depositTransaction = await new Transaction({
        user: userId,
        type: 'deposit',
        amount: transactionAmount,
        status: 'success', // Deposit transactions are always successful
      }).save();

      // Create a notification for deposit
      await new Notification({
        user: userId,
        message: `You have deposited ₹${transactionAmount}.`,
      }).save();

      await user.save(); // Save user's updated balance
      return res.status(201).json(depositTransaction); // Respond with the created transaction
    }

    // Handle send transactions
    if (type === 'send') {
      if (!recipient) return res.status(400).json({ message: 'Recipient is required for sending money' });
      if (user.balance < transactionAmount) return res.status(400).json({ message: 'Insufficient balance' });

      const recipientUser = await User.findById(recipient);
      if (!recipientUser) return res.status(404).json({ message: 'Recipient not found' });

      // Create a transaction entry with pending status
      const transaction = await new Transaction({
        user: userId,
        type: 'send',
        amount: transactionAmount,
        sender: userId, 
        recipient,
        status: 'pending' // Initially set to pending
      }).save();

      try {
        // Update balances
        user.balance -= transactionAmount;
        recipientUser.balance += transactionAmount;

        // Save updated balances
        await user.save();
        await recipientUser.save();

        // Update the transaction status to success
        transaction.status = 'success';
        await transaction.save();

        // Notifications with transaction status
        await new Notification({
          user: userId,
          message: `You have sent ₹${transactionAmount} to ${recipientUser.name}. Status: success.`,
        }).save();

        await new Notification({
          user: recipient,
          message: `${user.name} has sent you ₹${transactionAmount}. Status: success.`,
        }).save();

        return res.status(201).json({ message: 'Transaction successful.', transaction }); // Respond with success message
      } catch (error) {
        console.error('Transaction Error:', error);
        // Rollback changes in case of failure
        user.balance += transactionAmount; // Reverse deduction
        recipientUser.balance -= transactionAmount; // Reverse addition

        await user.save(); // Save user's updated balance
        await recipientUser.save(); // Save recipient's updated balance

        // Update the transaction status to failed with an error message
        transaction.status = 'failed';
        transaction.errorMessage = 'Transaction failed during processing.';
        await transaction.save();

        await new Notification({
          user: userId,
          message: `Your transaction of ₹${transactionAmount} to ${recipientUser.name} has failed. Status: failed.`,
        }).save();

        await new Notification({
          user: recipient,
          message: `${user.name}'s transaction to send you ₹${transactionAmount} has failed. Status: failed.`,
        }).save();

        return res.status(500).json({ message: 'Transaction failed', transaction }); // Respond with failure message
      }
    }

    return res.status(400).json({ message: 'Invalid transaction type' });
  } catch (error) {
    console.error('Transaction Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};








// Get all transactions for the logged-in user
exports.getTransactions = async (req, res) => {
  const userId = req.user._id; // Assuming user ID is set by auth middleware

  try {
    // Find all transactions for the user
    // const transactions = await Transaction.find({
    //   $or: [
    //     { sender: userId }, // Where the user is the sender
    //     { recipient: userId } // Where the user is the recipient
    //   ]
    // });

    // res.json(transactions);   // this is first way using $or


      // Fetch transactions where the user is the sender
      const sentTransactions = await Transaction.find({ sender: userId });

      // Fetch transactions where the user is the recipient
      const receivedTransactions = await Transaction.find({ recipient: userId });

      const depositTransactions = await Transaction.find({
        user: userId,
        type: 'deposit'
      });
  
      // Combine the sent and received transactions
      const allTransactions = [...sentTransactions, ...receivedTransactions,...depositTransactions];  // this is simple technique

    // Return the transactions
    res.json(allTransactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.getTransactionDetails = async (req, res) => {
  const { transactionId } = req.params; // Extract transaction ID

  try {
    // Fetch the transaction by ID and populate sender and recipient details
    const transaction = await Transaction.findById(transactionId)
      .populate('sender', 'name email')      // Populate sender (user) fields
      .populate('recipient', 'name email');   // Populate recipient fields

    // Check if transaction exists
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Prepare transaction details for the response
    const transactionDetails = {
      _id: transaction._id,
      type: transaction.type,
      amount: transaction.amount,
      date: transaction.date,
      sender: {
        _id: transaction.sender ? transaction.sender._id : null,
        username: transaction.sender ? transaction.sender.name : 'Unknown',
        email: transaction.sender ? transaction.sender.email : 'Unknown',
      },
      recipient: {
        _id: transaction.recipient ? transaction.recipient._id : null,
        username: transaction.recipient ? transaction.recipient.name : 'Anonymous',
        email: transaction.recipient ? transaction.recipient.email : 'Anonymous',
      },
      message: transaction.message || 'No message provided', // Optional message handling
      transactionPin: transaction.transactionPin || 'No PIN available', // Optional transaction PIN handling
    };

    // Return the structured transaction details
    return res.status(200).json(transactionDetails);
  } catch (error) {
    console.error('Error fetching transaction details:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};


