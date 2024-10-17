import React from "react";
import { useNavigate } from "react-router-dom";
import "./shared.css";
import "./check.css";

export default function CheckEmail() {
  const navigate = useNavigate();

  return (
    <div className="movieshow-container check-email-container">
      <div className="movieshow-content check-email-content">
        <div className="movieshow-icon check-email-icon">✉️</div>
        <h2 className="movieshow-heading check-email-heading">
          Please check your email
        </h2>
        <p className="check-email-text">
          A link to reset your password has been sent to your email address.
        </p>
        <button
          className="movieshow-button check-email-button"
          onClick={() => navigate("/login")}
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}
