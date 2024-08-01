import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./Components/Login/Login";
import Dashboard from "./Components/Dashboard/Dashboard";
import MemberManagement from "./Components/MemberManagement/MemberManagement";
import TransactionManagement from "./Components/TransactionManagement/TransactionManagement";
import PointsManagement from "./Components/PointsManagement/PointsManagement";
import AddMember from "./Components/MemberManagement/AddMember";
import Sidebar from "./Components/Sidebar/Sidebar";
import Logout from "./Components/Logout/Logout";
import "./App.css";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn");
    if (storedIsLoggedIn === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem("isLoggedIn", "true");
    } else {
      localStorage.removeItem("isLoggedIn");
    }
  }, [isLoggedIn]);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div className="App">
        {isLoggedIn && <Sidebar handleLogout={handleLogout} />}
        <div className="main-content">
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route
              path="/dashboard"
              element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />}
            />
            <Route
              path="/member-management"
              element={
                isLoggedIn ? <MemberManagement /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/points-management"
              element={
                isLoggedIn ? <PointsManagement /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/transaction-management"
              element={
                isLoggedIn ? (
                  <TransactionManagement />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/add-member"
              element={isLoggedIn ? <AddMember /> : <Navigate to="/login" />}
            />
            <Route
              path="/logout"
              element={<Logout setIsLoggedIn={setIsLoggedIn} />}
            />
            <Route
              path="/"
              element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
