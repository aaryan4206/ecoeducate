import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import './../styles/Sidebar.css'

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // your logout logic (e.g., firebase signOut)
    navigate("/login");
  };

  return (
    <nav className="sidebar">
      <ul className="sidebar-links">
        <li>
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? "active" : ""}>
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/news" className={({ isActive }) => isActive ? "active" : ""}>
            News
          </NavLink>
        </li>
        <li>
          <NavLink to="/quizzes" className={({ isActive }) => isActive ? "active" : ""}>
            Quizzes
          </NavLink>
        </li>
        <li>
          <NavLink to="/leaderboard" className={({ isActive }) => isActive ? "active" : ""}>
            Leaderboard
          </NavLink>
        </li>
      </ul>

      <button className="logout-button" onClick={handleLogout}>
        Log Out
      </button>
    </nav>
  );
}

export default Sidebar;
