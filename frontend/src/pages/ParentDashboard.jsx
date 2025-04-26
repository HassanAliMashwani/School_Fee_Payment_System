import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeeDetails, getPaymentHistory } from '../features/payments/paymentSlice';
import { Link } from 'react-router-dom';

// SRP: Single Responsibility Principle - Separated payment history display
const PaymentHistoryTable = ({ paymentHistory, status }) => {
  if (status === 'loading') return <div className="loading">Loading...</div>;
  if (!paymentHistory?.length) return <p>No payment history available</p>;

  return (
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Amount</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {paymentHistory.map((payment) => (
          <PaymentHistoryRow key={payment.id} payment={payment} />
        ))}
      </tbody>
    </table>
  );
};

// SRP: Single Responsibility Principle - Extracted row component
const PaymentHistoryRow = ({ payment }) => (
  <tr>
    <td>{new Date(payment.date).toLocaleDateString()}</td>
    <td>₹{payment.amount}</td>
    <td className={`status ${payment.status}`}>
      {payment.status}
    </td>
  </tr>
);

// SRP: Single Responsibility Principle - Dedicated summary component
const DashboardSummary = ({ feeDetails }) => (
  <div className="dashboard-summary">
    <SummaryItem title="Total Due" value={feeDetails?.totalDue || 0} />
    <SummaryItem title="Paid Amount" value={feeDetails?.paidAmount || 0} />
    <SummaryItem 
      title="Upcoming Dues" 
      value={feeDetails?.upcomingDues?.length || 0} 
    />
  </div>
);

// OCP: Open/Closed Principle - Reusable summary item component
const SummaryItem = ({ title, value }) => (
  <div className="summary-item">
    <h3>{title}</h3>
    <p>₹{value}</p>
  </div>
);

// DIP: Dependency Inversion Principle - Payment actions component
const PaymentActions = () => (
  <div className="payment-section">
    <h3>Quick Actions</h3>
    <Link to="/make-payment" className="payment-button">
      Make Payment
    </Link>
  </div>
);

// Main component using composition
const ParentDashboard = () => {
  const dispatch = useDispatch();
  const { feeDetails, paymentHistory, status } = useSelector(
    (state) => state.payments
  );

  // SRP: Single Responsibility Principle - Data fetching in useEffect
  useEffect(() => {
    dispatch(fetchFeeDetails());
    dispatch(getPaymentHistory());
  }, [dispatch]);

  return (
    <div className="card">
      <h2>Parent Dashboard</h2>
      
      <DashboardSummary feeDetails={feeDetails} />
      <PaymentActions />
      
      <div className="payment-history">
        <h3>Recent Transactions</h3>
        <PaymentHistoryTable paymentHistory={paymentHistory} status={status} />
      </div>
    </div>
  );
};

export default ParentDashboard;