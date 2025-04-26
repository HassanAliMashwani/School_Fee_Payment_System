import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createFeeStructure } from '../features/fees/feeSlice';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const FeeStructure = () => {
  const [feeData, setFeeData] = useState({
    name: '',
    amount: '',
    type: 'monthly',
    dueDate: new Date(),
  });

  const dispatch = useDispatch();

  // SRP: Handles form submission only — separates UI and logic clearly
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(
        createFeeStructure({
          ...feeData,
          dueDate: feeData.dueDate.toISOString(),
        })
      ).unwrap();

      // SRP: Resets state after successful creation — good form behavior encapsulated
      setFeeData({
        name: '',
        amount: '',
        type: 'monthly',
        dueDate: new Date(),
      });
    } catch (error) {
      // SRP: Error handling kept local here — could move to logger for cleaner code
      console.error('Failed to create fee structure:', error);
    }
  };

  return (
    <div className="card">
      <h2>Fee Structure Management</h2>
      <form onSubmit={handleSubmit}>
        {/* SRP: UI and input handling per field */}
        <div className="form-group">
          <label>Fee Name:</label>
          <input
            type="text"
            value={feeData.name}
            onChange={(e) => setFeeData({ ...feeData, name: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Amount:</label>
          <input
            type="number"
            value={feeData.amount}
            onChange={(e) => setFeeData({ ...feeData, amount: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Fee Type:</label>
          <select
            value={feeData.type}
            onChange={(e) => setFeeData({ ...feeData, type: e.target.value })}
          >
            <option value="monthly">Monthly</option>
            <option value="term">Term-wise</option>
          </select>
        </div>

        <div className="form-group">
          <label>Due Date:</label>
          <DatePicker
            selected={feeData.dueDate}
            onChange={(date) => setFeeData({ ...feeData, dueDate: date })}
            minDate={new Date()}
            dateFormat="dd/MM/yyyy"
          />
        </div>

        <button type="submit">Create Fee Structure</button>
      </form>
    </div>
  );
};

export default FeeStructure;

/*
  ✅ SOLID Principles Breakdown:

  ✅ SRP (Single Responsibility Principle):
     - `FeeStructure` handles UI + interaction logic only.
     - Dispatching logic (createFeeStructure) is kept abstracted in redux slice (business logic separated).
     - Error and form state are handled locally and clearly.

  ✅ OCP (Open-Closed Principle):
     - Can easily add more form fields (like discount, currency, etc.) without touching existing logic.
     - Behavior extended via Redux — component doesn't need modification.

  ✅ LSP (Liskov Substitution Principle):
     - `DatePicker` or any input component can be replaced with an advanced component without breaking `FeeStructure`.

  ❌ ISP (Interface Segregation Principle):
     - Not directly relevant in React function components, more applicable to large service interfaces.

  ✅ DIP (Dependency Inversion Principle):
     - Depends on abstraction: Redux actions like `createFeeStructure` decouple logic from backend/API directly.
*/
