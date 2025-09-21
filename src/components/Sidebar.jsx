import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaLeaf,
  FaTachometerAlt,
  FaNewspaper,
  FaQuestionCircle,
  FaCrown,
  FaBars,
  FaTimes,
  FaSignOutAlt,
} from "react-icons/fa";
import "./../styles/Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);

  const handleLogout = () => {
    // your logout logic
    navigate("/login");
  };

  return (
    <nav className={`sidebar ${isOpen ? "open" : "collapsed"}`}>
      <div className="sidebar-header">
        {/* Only render brand when open */}
        {isOpen && (
          <div className="logo-block">
            <FaLeaf className="eco-logo" />
            <span className="eco-text"><a href="/">EcoEducate</a></span>
          </div>
        )}
        <button
          className="toggle-btn"
          aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          onClick={() => setIsOpen((v) => !v)}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      <ul className="sidebar-links">
        <li>
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "active" : "")}>
            <span className="icon-bg green-bg"><FaTachometerAlt /></span>
            {isOpen && <span>Dashboard</span>}
          </NavLink>
        </li>
        <li>
          <NavLink to="/news" className={({ isActive }) => (isActive ? "active" : "")}>
            <span className="icon-bg blue-bg"><FaNewspaper /></span>
            {isOpen && <span>News</span>}
          </NavLink>
        </li>
        <li>
          <NavLink to="/quizzes" className={({ isActive }) => (isActive ? "active" : "")}>
            <span className="icon-bg yellow-bg"><FaQuestionCircle /></span>
            {isOpen && <span>Quizzes</span>}
          </NavLink>
        </li>
        <li>
          <NavLink to="/leaderboard" className={({ isActive }) => (isActive ? "active" : "")}>
            <span className="icon-bg purple-bg"><FaCrown /></span>
            {isOpen && <span>Leaderboard</span>}
          </NavLink>
        </li>
      </ul>

      <button className="logout-button" onClick={handleLogout}>
        <FaSignOutAlt className="logout-icon" />
        {isOpen && <span>Log Out</span>}
      </button>
    </nav>
  );
}

export default Sidebar;
