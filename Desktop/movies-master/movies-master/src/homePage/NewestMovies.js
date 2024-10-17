import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Calendar, Film } from "lucide-react";
import "./newest-movies.css";

const NewestMovies = () => {
  const [newestMovies, setNewestMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewestMovies = async () => {
      try {
        const response = await axios.get("http://localhost:8800/api/movies");
        const sortedMovies = response.data.sort(
          (a, b) => new Date(b.published_at) - new Date(a.published_at)
        );
        setNewestMovies(sortedMovies.slice(0, 8)); // Display top 4 newest movies
        setLoading(false);
      } catch (err) {
        console.error("Error fetching newest movies:", err);
        setError("Failed to load newest movies");
        setLoading(false);
      }
    };
    fetchNewestMovies();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
        <div>Loading newest movies...</div>
      </div>
    );
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  if (newestMovies.length === 0) {
    return <div className="no-newest-movies">No movies found</div>;
  }

  return (
    <div className="newest-movies-container">
      <div className="newest-movies-header">
        <h2 className="newest-movies-title">Newest Releases</h2>
      </div>
      <div className="newest-movies-grid">
        {newestMovies.map((movie) => (
          <Link
            key={movie._id}
            to={`/movies/${movie._id}`}
            className="newest-movie-card"
          >
            <div className="movie-image-container">
              <img
                src={movie.image?.url || "/api/placeholder/300/450"}
                alt={movie.title}
                className="movie-image"
              />
            </div>
            <div className="movie-info">
              <h3 className="movie-title">{movie.title}</h3>
              <div className="movie-metadata">
                <span className="movie-year">
                  <Calendar size={14} />
                  {new Date(movie.published_at).getFullYear()}
                </span>
                <span className="movie-genre">
                  <Film size={14} />
                  {movie.genre}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default NewestMovies;
