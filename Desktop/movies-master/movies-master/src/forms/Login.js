import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./form.css";

export default function Login({ setIsLoggedIn }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { email, password } = formData;
    if (!email) {
      toast.error("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Email is invalid");
      return false;
    }
    if (!password) {
      toast.error("Password is required");
      return false;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      try {
        const response = await axios.post(
          "http://localhost:8800/api/auth/login",
          formData
        );

        console.log("API Response:", response.data);

        const { token, role, userId, accountStatus } = response.data;
        const user = response.data;

        if (!user || !role || !user) {
          throw new Error("User data or role is missing from the response");
        }
        if (accountStatus === "banned") {
          toast.error("Your account has been banned. Please contact support.");
          setLoading(false);
          return;
        }
        localStorage.setItem("authToken", token);
        localStorage.setItem("userId", userId);
        localStorage.setItem("userRole", role); // Add this line to store the role

        setIsLoggedIn(true);

        toast.success("Login successful!");
        if (role === "client") {
          navigate("/dashboard");
        } else if (role === "admin") {
          navigate("/adminDashboard");
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Login error:", error.response?.data || error.message);
        toast.error(
          error.response?.data?.message || "Login failed. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Welcome Back</h2>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        <div className="form-footer">
          <div className="forgot-password">
            <Link to="/forgot">Forgot Password?</Link>
          </div>
          <div className="register-link">
            <span>Don't have an account? </span>
            <Link to="/register">Sign up</Link>
          </div>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}
