import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./shared.css";
import "./reset.css";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isValidToken, setIsValidToken] = useState(false);
  const [email, setEmail] = useState("");
  const { userId, token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8800/password/verify-token/${userId}/${token}`
        );
        if (response.data.message === "Token is valid") {
          setIsValidToken(true);
          setEmail(response.data.email);
        }
      } catch (error) {
        console.log(error);
      }
    };
    verifyToken();
  }, [userId, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:8800/password/reset-password/${userId}/${token}`,
        { password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.message === "Password reset successful") {
        navigate("/success");
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (!isValidToken) {
    return (
      <div className="movieshow-container reset-password-container">
        <div className="movieshow-content reset-password-content">
          <h3 className="movieshow-heading reset-password-heading">
            Reset Password
          </h3>
          <p className="reset-password-message">
            {message || "Invalid or expired token."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="movieshow-container reset-password-container">
      <div className="movieshow-content reset-password-content">
        <h3 className="movieshow-heading reset-password-heading">
          Reset Your Password
        </h3>
        <p className="reset-password-email">for {email}</p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="password" className="reset-password-label">
            New Password
          </label>
          <input
            type="password"
            id="password"
            className="movieshow-input reset-password-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="movieshow-button reset-password-button"
          >
            Reset Password
          </button>
          {message && (
            <p className="movieshow-message reset-password-message">
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
