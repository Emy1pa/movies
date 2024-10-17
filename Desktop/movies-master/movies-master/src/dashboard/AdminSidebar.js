import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, Film, BarChart2, Users, LogOut, UserPen } from "lucide-react";
import "./admin.css";
const AdminSidebar = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <Link to="/admin">
          <h1>MovieShow Admin</h1>
        </Link>
      </div>
      <nav className="sidebar-nav">
        <ul>
          {[
            { icon: Home, text: "Home", href: "/" },
            { icon: Film, text: "Movies", href: "/admin/movies" },
            { icon: BarChart2, text: "Statistics", href: "/admin/statistics" },
            { icon: Users, text: "Users", href: "/admin/users" },
            { icon: UserPen, text: "Profile", href: "/profileUpdate" },
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

export default AdminSidebar;
