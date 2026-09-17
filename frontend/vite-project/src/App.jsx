import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import HrDashboard from "./components/HRDashboard";
import EmployeeDashboard from "./components/EmployeeDashboard";
import PrivateRoute from "./components/PrivateRoute";
import "./App.css";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/hr-dashboard"
          element={<PrivateRoute component={HrDashboard} role="HR" />}
        />
        <Route
          path="/employee-dashboard"
          element={<PrivateRoute component={EmployeeDashboard} role="Employee" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
