import React, { useEffect, useState } from "react";
import "./home.css";
import NewestMovies from "./NewestMovies";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
const HomePage = () => {
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const role = decodedToken.role;
        setUserRole(role);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);
  const handleButtonClick = () => {
    if (userRole === "admin") {
      navigate("/adminDashboard");
    } else if (userRole === "client") {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };
  return (
    <>
      <div className="home-page">
        <div className="content">
          <h1>Welcome to MovieShow</h1>
          <h2>Your Gateway to Cinematic Adventures</h2>
          <p>
            Discover the latest blockbusters, hidden gems, and binge-worthy TV
            series. From heart-pounding action to laugh-out-loud comedies, we've
            got your entertainment covered.
          </p>
          <div className="features">
            <div className="feature">
              <h3>Vast Library</h3>
              <p>Access thousands of titles across all genres</p>
            </div>
            <div className="feature">
              <h3>Personalized Recommendations</h3>
              <p>Get tailored suggestions based on your preferences</p>
            </div>
            <div className="feature">
              <h3>HD Streaming</h3>
              <p>Enjoy crystal-clear video and audio quality</p>
            </div>
          </div>
          <button className="cta-button" onClick={handleButtonClick}>
            {userRole === "admin"
              ? "Go to your dashboard"
              : userRole === "client"
              ? "Go to your dashboard"
              : "Start Your Cinematic Journey"}
          </button>
        </div>
      </div>
      <div>
        <NewestMovies />
      </div>
    </>
  );
};

export default HomePage;
