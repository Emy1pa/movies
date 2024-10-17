import React from "react";
import { useNavigate } from "react-router-dom";
import "./shared.css";
import "./success.css";

export default function Success() {
  const navigate = useNavigate();

  return (
    <div className="movieshow-container success-container">
      <div className="movieshow-content success-content">
        <div className="movieshow-icon success-icon">✅</div>
        <h2 className="movieshow-heading success-heading">
          Password Reset Successful!
        </h2>
        <button
          className="movieshow-button success-button"
          onClick={() => navigate("/login")}
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}
