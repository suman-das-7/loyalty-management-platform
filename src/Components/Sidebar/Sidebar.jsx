import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = ({ handleLogout }) => {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    handleLogout();
    navigate("/login");
  };

  return (
    <div className="sidebar">
      <ul className="sidebar-nav">
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/member-management">Manage Members</Link>
        </li>
        <li>
          <Link to="/points-management">Points Management</Link>
        </li>
        <li>
          <Link to="/transaction-management">Transactions</Link>
        </li>
        <li>
          <button className="logout-btn" onClick={handleLogoutClick}>
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
