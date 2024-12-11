const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // The user who initiated the transaction
  type: { type: String, enum: ['deposit', 'send'], required: true }, // Only 'deposit' and 'send' types
  amount: { type: Number, required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: function () { return this.type === 'send'; } }, // Sender required only for 'send'
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: function () { return this.type === 'send'; } }, // Recipient required only for 'send'
  date: { type: Date, default: Date.now }, // Timestamp of the transaction
  status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' }, // Transaction status
});

module.exports = mongoose.model('Transaction', transactionSchema);

