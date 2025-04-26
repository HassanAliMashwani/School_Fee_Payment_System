const mongoose = require('mongoose');
const Payment = require('../models/paymentModel');
const User = require('../models/userModel');

// Single Responsibility Principle (SRP): The `createPayment` and `getPayments` functions are responsible solely for handling payment-related operations.
// `createPayment`: Handles creating and saving a new payment record.
// `getPayments`: Fetches and returns all payments from the database.

// Create Payment
const createPayment = async (req, res) => {
  // Open-Closed Principle (OCP): The creation of a payment is a closed operation; the `Payment` model can be extended with additional fields (e.g., "discount", "paymentDate") without modifying this function.

  const session = await mongoose.startSession();  // Open a session for MongoDB transaction
  session.startTransaction();  // Start the transaction

  try {
    const { userId, amount, method } = req.body;

    // Single Responsibility Principle (SRP): The `createPayment` function now handles the entire payment creation process, including database interaction and transaction handling.
    
    // Create payment inside the session
    const payment = await Payment.create([req.body], { session }); 

    // Update the user's balance in the same session
    await User.updateOne(
      { _id: userId },
      { $inc: { balance: -amount } },  // Decrease the user's balance by the payment amount
      { session }  // Use the same session for both operations
    );

    // Commit the transaction once both operations are successful
    await session.commitTransaction();
    res.status(201).json({ message: 'Payment recorded successfully', payment });
  } catch (error) {
    // Error handling: Abort transaction if any error occurs to ensure data consistency
    await session.abortTransaction();
    res.status(500).json({ message: 'Server Error', error });
  } finally {
    // End the session once the transaction is complete (either committed or aborted)
    session.endSession();
  }
};

// Get All Payments
const getPayments = async (req, res) => {
  // Single Responsibility Principle (SRP): This function only focuses on fetching payment records and returning them in the response.
  try {
    const payments = await Payment.find().populate('user', 'name email'); // Populate user data as well (e.g., name, email) for each payment
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Dependency Inversion Principle (DIP): The `Payment` model is abstracted and can be modified independently of this controller. This ensures that any changes in the payment model don’t force changes in this controller logic.

module.exports = { createPayment, getPayments };
