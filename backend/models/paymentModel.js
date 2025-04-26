const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  method: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['paid', 'pending'],
    default: 'paid'
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// Add index for concurrent-safe operations (e.g., prevent duplicate same-day payments)
paymentSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Payment', paymentSchema);
