import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove JWT Token
    navigate("/"); // Redirect to Login Page
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;
