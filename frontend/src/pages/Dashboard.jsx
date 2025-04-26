import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Spinner from '../components/Spinner';
import { reset, getSchools } from '../features/schools/schoolSlice';
import SchoolItem from '../components/SchoolItem';
import React from 'react';

function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { schools, isLoading, isError, message } = useSelector(
    (state) => state.schools
  );

  useEffect(() => {
    // SRP (Single Responsibility Principle)
    // This effect handles fetching schools based on user authentication.

    if (isError) {
      if (!user) {
        // Error could be handled via a logger or toast system (SRP improvement)
      }
    }

    if (!user) {
      // Could redirect user to login (if uncommented)
      // navigate('/login');
    }

    if (user) {
      dispatch(getSchools());
    }

    // SRP: Resetting state when component unmounts
    return () => {
      dispatch(reset());
    };
  }, [user, navigate, isError, message, dispatch]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <section>
        {user ? (
          <h4 className="user-name">
            Welcome {user && user.name.charAt(0).toUpperCase() + user.name.slice(1)}
          </h4>
        ) : (
          <></>
        )}
        <h1>Dashboard</h1>
      </section>

      <section className="content">
        {schools && schools.length > 0 ? (
          <div className="schools">
            {schools.map((school) => (
              <SchoolItem key={school._id} school={school} />
            ))}
          </div>
        ) : (
          <h3>No schools found</h3>
        )}
      </section>
    </>
  );
}

export default Dashboard;

/*
  SOLID Principles in Action:

  ✅ SRP (Single Responsibility Principle)
     - This component is focused on:
       1. Fetching and displaying school data.
       2. Displaying a welcome message.
     - Redux slices handle business logic (data fetching and state reset).
     - Optional: Error/toast logic and data transformation can be moved to separate utilities.

  ✅ OCP (Open-Closed Principle)
     - The dashboard is open for extension (e.g., add filters, pagination) without modifying the existing core logic.

  ✅ LSP (Liskov Substitution Principle)
     - Components like `SchoolItem` can be replaced with enhanced versions (e.g., clickable cards) without affecting core functionality.

  ❌ ISP (Interface Segregation Principle)
     - Not very relevant here — could apply more in class-based architecture or complex service contracts.

  ✅ DIP (Dependency Inversion Principle)
     - Uses Redux for data dependency, abstracting API/service logic via `getSchools`, promoting loosely-coupled architecture.
*/
