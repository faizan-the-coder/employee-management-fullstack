import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const PrivateRoute = ({ component: Component, role }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.log("No token found, redirecting to login...");
    return <Navigate to="/" />;
  }

  try {
    const user = jwtDecode(token);
    console.log("Decoded Token:", user); // Debugging



    const userRole = user?.sub?.role; // ✅ Access role inside sub

    if (userRole !== role) {
      console.log(`Role mismatch! Expected: ${role}, Found: ${userRole}`);
      return <Navigate to="/" />;
    }


    return <Component />;
  } catch (error) {
    console.error("JWT decoding error:", error);
    return <Navigate to="/" />;
  }
};

export default PrivateRoute;
