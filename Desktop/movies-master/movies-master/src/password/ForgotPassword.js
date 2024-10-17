import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./shared.css";
import "./forgot.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8800/password/forgot-password",
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        setMessage("Check your email for the reset link.");
        navigate("/check-email");
      } else {
        console.error("Error response from server:", response.data);
        setMessage(response.data.message);
      }
    } catch (error) {
      console.error("Error sending reset email:", error);
      setMessage("An error occurred while sending the email.");
    }
  };

  return (
    <div className="movieshow-container forgot-password-container">
      <div className="movieshow-content forgot-password-content">
        <h3 className="movieshow-heading forgot-password-heading">
          Forgot Password
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="forgot-password-form-group">
            <label htmlFor="email" className="forgot-password-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="movieshow-input forgot-password-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="movieshow-button forgot-password-button"
          >
            Reset Password
          </button>
          {message && (
            <p className="movieshow-message forgot-password-message">
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
