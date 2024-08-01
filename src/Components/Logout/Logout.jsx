import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Logout.css";

const Logout = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [confirmLogout, setConfirmLogout] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn"); // Clear login state from localStorage
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <div className="logout-container">
      <div className="logout-box">
        <h2>Logout</h2>
        {confirmLogout ? (
          <div>
            <p>Are you sure you want to log out?</p>
            <button className="confirm-btn" onClick={handleLogout}>
              Yes, Log me out
            </button>
            <button
              className="cancel-btn"
              onClick={() => setConfirmLogout(false)}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button className="logout-btn" onClick={() => setConfirmLogout(true)}>
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default Logout;
