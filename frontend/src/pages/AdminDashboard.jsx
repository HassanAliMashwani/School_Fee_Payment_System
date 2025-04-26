// pages/AdminDashboard.js
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { generateReport } from '../features/reports/reportSlice';


const AdminDashboard = () => {
  const dispatch = useDispatch();

  const handleGenerateReport = async () => {
    try {
      const report = await dispatch(generateReport()).unwrap();
      // Handle report download (could be separated for SRP)
    } catch (error) {
      // Error handling (can be separated into a logger for SRP)
    }
  };

  return (
    <div className="card">
      <h2>Admin Dashboard</h2>
      {/* 
        SRP (Single Responsibility Principle):
        This component is mainly responsible for rendering the admin dashboard and dispatching actions. 
        Logic like downloading or parsing the report can be extracted into separate utility functions.
      */}
      <button onClick={handleGenerateReport}>
        Generate Financial Report
      </button>
      {/* Other admin components */}
    </div>
  );
};

export default AdminDashboard;

/*
  SOLID Breakdown:

  ✅ SRP (Single Responsibility Principle)
     - `AdminDashboard` only manages UI logic for the dashboard view.
     - `generateReport` action is imported from Redux slice, so business logic is separated.
     - Future improvements: move download logic or error logging to external utilities.

  ✅ OCP (Open-Closed Principle)
     - You can extend the dashboard with new features (e.g., analytics, charts) without modifying existing report generation logic.
  
  ✅ LSP (Liskov Substitution Principle)
     - If we replace `generateReport` with another action that returns a report in the same shape, nothing breaks.
  
  ❌ ISP (Interface Segregation Principle)
     - Not applicable directly in this context since we are not working with interfaces or large class contracts.

  ❌ DIP (Dependency Inversion Principle)
     - Also more relevant in larger architecture layers, but Redux does abstract data flow, partially aligning with DIP.
*/
