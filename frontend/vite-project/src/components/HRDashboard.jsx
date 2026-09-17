import React, { useEffect, useState } from "react";
import axios from "axios";
import Logout from "../components/Logout";
import { useNavigate } from "react-router-dom";
import "../styles/HrDashboard.css";


const HrDashboard = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("http://127.0.0.1:5000/api/employees", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(res.data);
      setFilteredEmployees(res.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = employees.filter(
      (emp) =>
        emp.id.toString().includes(query) ||
        emp.role.toLowerCase().includes(query) ||
        emp.first_name.toLowerCase().includes(query) ||
        emp.last_name.toLowerCase().includes(query) ||
        emp.email.toLowerCase().includes(query) ||
        emp.phone_number.includes(query) ||
        emp.department.toLowerCase().includes(query) ||
        emp.salary.toString().includes(query)
    );
    setFilteredEmployees(filtered);
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee.id);
    setFormData(employee);
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `http://127.0.0.1:5000/api/employee`,
        { id: editingEmployee, ...formData },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingEmployee(null);
      fetchEmployees();
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    const loggedInUserId = localStorage.getItem("user_id");
    console.log(loggedInUserId)
    console.log(id.toString())

    try {
      if (id.toString() === loggedInUserId) {
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
        navigate("/register");
      }
      await axios.delete(`http://127.0.0.1:5000/api/employee/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchEmployees();
    } catch (error) {
      console.error("Error deleting employee:", error.response?.data || error.message);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="hr-dashboard">
      <h2>HR Dashboard</h2>
      <div className="logout-container">
      <Logout />
      </div>

      {/* Search Input */}
      <div className="search-container">
      <input
        type="text"
        placeholder="Search Employee..."
        value={searchQuery}
        onChange={handleSearch}
      />
      </div>
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Department</th>
            <th>Salary</th>
            <th>Gender</th>
            <th>Address</th>
            <th>Hire Date</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map((emp) => (
            <tr key={emp.id}>
              {editingEmployee === emp.id ? (
                <>
                  <td><input type="text" name="first_name" value={formData.first_name} onChange={handleChange} /></td>
                  <td><input type="text" name="last_name" value={formData.last_name} onChange={handleChange} /></td>
                  <td><input type="email" name="email" value={formData.email} onChange={handleChange} /></td>
                  <td><input type="text" name="phone_number" value={formData.phone_number} onChange={handleChange} /></td>
                  <td><input type="text" name="department" value={formData.department} onChange={handleChange} /></td>
                  <td><input type="number" name="salary" value={formData.salary} onChange={handleChange} /></td>
                  <td>
                    <select name="gender" value={formData.gender} onChange={handleChange}>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </td>
                  <td><input type="text" name="address" value={formData.address} onChange={handleChange} /></td>
                  <td><input type="date" name="hire_date" value={formData.hire_date} onChange={handleChange} /></td>
                  <td>
                    <select name="role" value={formData.role} onChange={handleChange}>
                      <option value="Employee">Employee</option>
                      <option value="HR">HR</option>
                    </select>
                  </td>
                  <td>
                    <button className="save-btn" onClick={handleUpdate}>Save</button>
                    <button className="cancel-btn" onClick={() => setEditingEmployee(null)}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{emp.first_name}</td>
                  <td>{emp.last_name}</td>
                  <td>{emp.email}</td>
                  <td>{emp.phone_number}</td>
                  <td>{emp.department}</td>
                  <td>${emp.salary}</td>
                  <td>{emp.gender}</td>
                  <td>{emp.address}</td>
                  <td>{emp.hire_date}</td>
                  <td>{emp.role}</td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEdit(emp)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(emp.id)}>Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default HrDashboard;
