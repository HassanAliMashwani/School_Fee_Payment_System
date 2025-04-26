const Queue = require('bull');
const Payment = require('../models/paymentModel');

const paymentQueue = new Queue('payments', 'redis://127.0.0.1:6379');

paymentQueue.process(async (job) => {
  const { paymentId } = job.data;
  await Payment.findByIdAndUpdate(paymentId, { status: 'completed' });
});

module.exports = paymentQueue;