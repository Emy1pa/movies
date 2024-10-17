import React, { useState, useEffect } from "react";
import { Star, StarHalf } from "lucide-react";
import axios from "axios";
import "./rate.css";
const MovieRating = ({ movieId }) => {
  const [rating, setRating] = useState(null);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [userRating, setUserRating] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("authToken");

  const api = axios.create({
    baseURL: "http://localhost:8800/api",
    headers: { token },
  });

  useEffect(() => {
    fetchRatings();
  }, [movieId]);

  const fetchRatings = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all ratings for the movie
      const allRatingsResponse = await api.get("/rates");
      const movieRatings = allRatingsResponse.data.filter(
        (rate) => rate.movie === movieId
      );

      // Calculate average rating
      if (movieRatings.length > 0) {
        const total = movieRatings.reduce(
          (sum, rate) => sum + rate.ratingValue,
          0
        );
        setAverageRating(total / movieRatings.length);
        setTotalRatings(movieRatings.length);
      }

      // Check if user has already rated
      const userRating = movieRatings.find((rate) => rate.user === userId);
      if (userRating) {
        setUserRating(userRating);
        setRating(userRating.ratingValue);
      }

      setLoading(false);
    } catch (err) {
      setError("Failed to load ratings");
      setLoading(false);
      console.error("Error fetching ratings:", err);
    }
  };

  const handleRating = async (value) => {
    try {
      setError(null);
      setLoading(true);

      if (userRating) {
        // Update existing rating
        await api.put(`/rates/${userRating._id}`, {
          ratingValue: value,
        });
      } else {
        // Create new rating
        await api.post("/rates", {
          user: userId,
          movie: movieId,
          ratingValue: value,
        });
      }

      setRating(value);
      await fetchRatings(); // Refresh ratings
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit rating");
      console.error("Error submitting rating:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMouseEnter = (value) => {
    setHoveredRating(value);
  };

  const handleMouseLeave = () => {
    setHoveredRating(0);
  };

  const renderStars = (displayRating) => {
    return [...Array(10)].map((_, index) => {
      const value = index + 1;
      const filled = value <= displayRating;
      const halfFilled =
        value === Math.ceil(displayRating) && displayRating % 1 !== 0;

      return (
        <button
          key={value}
          className={`star-button ${filled ? "filled" : ""} ${
            halfFilled ? "half-filled" : ""
          }`}
          onMouseEnter={() => handleMouseEnter(value)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleRating(value)}
          disabled={loading}
        >
          {halfFilled ? (
            <StarHalf className="star-icon" />
          ) : (
            <Star className="star-icon" />
          )}
        </button>
      );
    });
  };

  return (
    <div className="movie-rating">
      <div className="rating-header">
        <h3>Rate this Movie</h3>
        {averageRating > 0 && (
          <div className="average-rating">
            <span className="rating-value">{averageRating.toFixed(1)}</span>
            <span className="rating-count">({totalRatings} ratings)</span>
          </div>
        )}
      </div>

      <div className="stars-container">
        {renderStars(hoveredRating || rating || 0)}
      </div>

      {error && <div className="rating-error">{error}</div>}

      {rating && (
        <div className="user-rating">
          Your rating: <span className="rating-value">{rating}</span>/10
        </div>
      )}
    </div>
  );
};

export default MovieRating;
