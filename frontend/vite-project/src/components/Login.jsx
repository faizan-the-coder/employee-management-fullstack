import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";


const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:5000/auth/login", formData);
      console.log("Login Response:", res.data); // Debugging

      if (res.data.token && res.data.role) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role); // Store role
        localStorage.setItem("user_id", res.data.id);

        console.log("Stored user_id in login:", localStorage.getItem("user_id"));

        if (res.data.role === "HR") {
          navigate("/hr-dashboard");
        } else {
          navigate("/employee-dashboard");
        }
      } else {
        alert("Invalid response from server");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Invalid credentials");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Login</button>
      </form>

      {/* Already a user? Redirect to Register Page */}
      <p>Not registered yet?</p>
      <button onClick={() => navigate("/register")}>Register</button>
    </div>
  );
};

export default Login;
