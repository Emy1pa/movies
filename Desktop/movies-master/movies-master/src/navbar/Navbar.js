import React, { useState } from "react";
import { User, Menu, X, LogOut } from "lucide-react";
import "./navbar.css";
import { Link } from "react-router-dom";

const Navbar = ({ isLoggedIn, handleLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          <div className="navbar-brand">
            <Link to={"/"} className="nav-link">
              <span className="logo">MovieShow</span>
            </Link>
          </div>
          <div className="navbar-menu">
            <div className="navbar-links">
              <Link to="/" className="nav-link">
                Homepage
              </Link>
              <Link to="/movies" className="nav-link">
                Movies
              </Link>
            </div>
          </div>
          <div className="navbar-auth">
            {isLoggedIn ? (
              <button
                onClick={() => {
                  handleLogout();
                  closeMobileMenu();
                }}
                className="logout-button"
              >
                <LogOut size={16} className="logout-icon" />
                <span>Logout</span>
              </button>
            ) : (
              <>
                <Link to="/register" className="nav-link">
                  Register
                </Link>
                <Link to="/login" className="login-button">
                  <User size={16} className="login-icon" />
                  <span>Login</span>
                </Link>
              </>
            )}
          </div>
          <div className="mobile-menu-toggle">
            <button
              onClick={toggleMobileMenu}
              className="menu-button"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X size={24} aria-hidden="true" />
              ) : (
                <Menu size={24} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
      <div className={`mobile-menu ${isMobileMenuOpen ? "open" : ""}`}>
        <Link to="/" className="nav-link" onClick={closeMobileMenu}>
          Homepage
        </Link>
        <Link to="/movies" className="nav-link" onClick={closeMobileMenu}>
          Movies
        </Link>
        {isLoggedIn ? (
          <button
            onClick={() => {
              handleLogout();
              closeMobileMenu();
            }}
            className="logout-button mobile"
          >
            <LogOut size={16} className="logout-icon" />
            <span>Logout</span>
          </button>
        ) : (
          <>
            <Link to="/register" className="nav-link" onClick={closeMobileMenu}>
              Register
            </Link>
            <Link
              to="/login"
              className="login-button mobile"
              onClick={closeMobileMenu}
            >
              <User
                size={16}
                className="login-icon"
                onClick={closeMobileMenu}
              />
              <span>Login</span>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
