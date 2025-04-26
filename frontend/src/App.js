import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreateSchool from "./components/Schools/CreateSchool";
import RegisterStudent from "./pages/RegisterStudent";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import ParentDashboard from "./pages/ParentDashboard";
import Payments from "./pages/Payments";
// import ProtectAdmin from "./utils/ProtectAdmin"; // SRP, OCP
// import ProtectUsers from "./utils/ProtectUsers"; // SRP, OCP
import Unauthorized from "./pages/Unauthorized";
import LandingPage from "./pages/LandingPage";
import FeeStructure from "./pages/FeeStructure";

function App() {
  return (
    <Router>
      <div className="container">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/RegisterAdmin" element={<Register />} />
          <Route path="/Register" element={<Register />} />

          {/* Protected Parent Routes */}
          {/* 
            SRP (Single Responsibility Principle): 
            ProtectUsers only checks if the user has the right role. It doesn't handle any other concern. 
            OCP (Open-Closed Principle): 
            ProtectUsers is open for extension (accepts allowedRoles), but closed for modification.
          */}
          {/* <Route element={<ProtectUsers allowedRoles={['parent']} />}>
            <Route path="/parent-dashboard" element={<ParentDashboard />} />
            <Route path="/make-payment" element={<Payments />} />
          </Route> */}

          {/* Protected Admin Routes */}
          {/* 
            SRP: ProtectAdmin handles only admin role validation. 
            OCP: We can add more roles or logic by extending it, not modifying existing structure.
            LSP (Liskov Substitution Principle): 
            ProtectAdmin can be replaced with any other component that fulfills role protection without breaking the app.
          */}
          {/* <Route element={<ProtectAdmin allowedRoles={['admin']} />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/createSchool" element={<CreateSchool />} />
            <Route path="/fee-structure" element={<FeeStructure />} />
            <Route path="/register-student" element={<RegisterStudent />} />
          </Route> */}

          {/* Existing dashboard route */}
          {/* 
            SRP: LandingPage is reused across both public and protected usage.
            DRY principle (not SOLID but best practice): Avoids duplicating the dashboard component.
          */}
          <Route path="/Dashboard" element={<LandingPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
