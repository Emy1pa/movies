import React from "react";
import "./home.css";

const HomePage = () => {
  return (
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
        <button className="cta-button">Start Your Cinematic Journey</button>
      </div>
    </div>
  );
};

export default HomePage;
