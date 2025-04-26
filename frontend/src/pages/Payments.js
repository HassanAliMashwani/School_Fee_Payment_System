// pages/Payments.js
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { processPayment } from '../features/payments/paymentSlice';

// Single Responsibility Principle (SRP) - The Payments component is responsible for handling payment processing only.
const Payments = () => {
  const [amount, setAmount] = useState('');
  const dispatch = useDispatch();

  // Open-Closed Principle (OCP) - The handleSubmit function can be extended to handle more payment processing logic without modifying existing code.
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(processPayment({ amount })).unwrap();
      // Payment success handling can be extended here
      console.log("Payment successful!");
    } catch (error) {
      // Error handling can be extended here
      console.error("Payment failed:", error);
    }
  };

  return (
    <div className="card">
      <h2>Make Payment</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          required
        />
        <button type="submit">Pay Now</button>
      </form>
    </div>
  );
};

export default Payments;