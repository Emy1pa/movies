import React, { Profiler } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Home,
  Calendar,
  BarChart2,
  LogOut,
  UserPen,
  Heart,
} from "lucide-react";

import "./sidebar.css";

const SideBar = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <Link to="/">
          <h1>MovieShow</h1>
        </Link>
      </div>
      <nav className="sidebar-nav">
        <ul>
          {[
            { icon: Home, text: "Home", href: "/" },
            { icon: Calendar, text: "Reservations", href: "/history" },
            { icon: UserPen, text: "Profile", href: "/profileUpdate" },
            { icon: Heart, text: "Favorites", href: "/favorites" },
          ].map((item, index) => (
            <li key={index}>
              <Link to={item.href} className="nav-link">
                <item.icon className="icon" />
                <span>{item.text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      {isLoggedIn && (
        <div className="sidebar-footer">
          <button className="btn-logout" onClick={handleLogout}>
            <LogOut className="icon" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default SideBar;
