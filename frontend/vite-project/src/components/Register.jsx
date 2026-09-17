import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    dob: "",
    gender: "Male", // Default selection
    address: "",
    email: "",
    phone_number: "",
    hire_date: "",
    role: "Employee",
    department: "",
    salary: "",
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Sending Data:", formData); // Debugging output
      await axios.post("http://127.0.0.1:5000/auth/register", formData);
      navigate("/");
    } catch (error) {
      alert("Registration failed");
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="first_name" placeholder="First Name" onChange={handleChange} required />
        <input type="text" name="last_name" placeholder="Last Name" onChange={handleChange} required />
        <input type="date" name="dob" title="Select Date of Birth" onChange={handleChange} required />

        <select name="gender" title="Select Gender" onChange={handleChange} required>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <input type="text" name="address" placeholder="Address" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="text" name="phone_number" placeholder="Phone Number" onChange={handleChange} required />
        <input type="date" name="hire_date" title="Select Hire Date" onChange={handleChange} required />

        <select name="role" title="Select Role" onChange={handleChange}>
          <option value="Employee">Employee</option>
          <option value="HR">HR</option>
        </select>

        <input type="text" name="department" placeholder="Department" onChange={handleChange} required />
        <input type="number" name="salary" placeholder="Salary" onChange={handleChange} required />
        <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />

        <button type="submit">Register</button>
      </form>

      {/* Already have an account? Redirect to Login Page */}
      <p>Already have an account?</p>
      <button onClick={() => navigate("/")}>Login</button>
    </div>
  );
};

export default Register;
