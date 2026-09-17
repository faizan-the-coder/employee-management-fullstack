import React, { useEffect, useState } from "react";
import axios from "axios";
import Logout from "../components/Logout";
import "../styles/EmployeeDashboard.css";


const EmployeeDashboard = () => {
  const [employee, setEmployee] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchEmployeeDetails();
  }, []);

  const fetchEmployeeDetails = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("http://127.0.0.1:5000/api/employee", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployee(res.data);
      setFormData(res.data);
    } catch (error) {
      console.error("Error fetching employee details:", error);
    }
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.put("http://127.0.0.1:5000/api/employee", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditing(false);
      fetchEmployeeDetails();
    } catch (error) {
      console.error("Error updating employee details:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="employee-dashboard">
      <h2>Employee Dashboard</h2>
      <Logout />
      {employee ? (
        <div>
          {editing ? (
            <>
              <label>First Name:</label>
              <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} />
              
              <label>Last Name:</label>
              <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} />
              
              {/* <label>Email:</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} /> */}
              
              <label>Phone Number:</label>
              <input type="text" name="phone_number" value={formData.phone_number} onChange={handleChange} />
              
              <label>Department:</label>
              <input type="text" name="department" value={formData.department} onChange={handleChange} />
              
              <label>Salary:</label>
              <input type="number" name="salary" value={formData.salary} onChange={handleChange} />
              
              <label>Gender:</label>
              <select name="gender" value={formData.gender} onChange={handleChange}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              
              <label>Address:</label>
              <textarea name="address" value={formData.address} onChange={handleChange}></textarea>
              
              <label>Hire Date:</label>
              <input type="date" name="hire_date" value={formData.hire_date} onChange={handleChange} />
              
              {/* <label>Role:</label>
              <select name="role" value={formData.role} onChange={handleChange}>
                <option value="Employee">Employee</option>
                <option value="HR">HR</option>
              </select> */}

              <button onClick={handleUpdate}>Save</button>
              <button onClick={() => setEditing(false)}>Cancel</button>
            </>
          ) : (
            <>
              <p><strong>First Name:</strong> {employee.first_name}</p>
              <p><strong>Last Name:</strong> {employee.last_name}</p>
              {/* <p><strong>Email:</strong> {employee.email}</p> */}
              <p><strong>Phone Number:</strong> {employee.phone_number}</p>
              <p><strong>Department:</strong> {employee.department}</p>
              <p><strong>Salary:</strong> ${employee.salary}</p>
              <p><strong>Gender:</strong> {employee.gender}</p>
              <p><strong>Address:</strong> {employee.address}</p>
              <p><strong>Hire Date:</strong> {employee.hire_date}</p>
              {/* <p><strong>Role:</strong> {employee.role}</p> */}
              
              <button onClick={() => setEditing(true)}>Edit</button>
            </>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default EmployeeDashboard;
