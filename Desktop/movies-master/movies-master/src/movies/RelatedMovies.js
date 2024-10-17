import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Calendar, Film } from "lucide-react";
import "./related.css";
const RelatedMovies = ({ currentMovie }) => {
  const [relatedMovies, setRelatedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRelatedMovies = async () => {
      if (!currentMovie) {
        console.log("No current movie provided");
        return;
      }

      try {
        const currentYear = new Date(currentMovie.published_at).getFullYear();
        const response = await axios.get("http://localhost:8800/api/movies");
        console.log("API response:", response.data);

        const filtered = response.data.filter((movie) => {
          const movieYear = new Date(movie.published_at).getFullYear();
          return (
            movie._id !== currentMovie._id &&
            (movie.genre === currentMovie.genre ||
              Math.abs(movieYear - currentYear) <= 2)
          );
        });

        console.log("Filtered movies:", filtered);
        setRelatedMovies(filtered.slice(0, 4));
        setLoading(false);
      } catch (err) {
        console.error("Error fetching related movies:", err);
        setError("Failed to load related movies");
        setLoading(false);
      }
    };

    fetchRelatedMovies();
  }, [currentMovie]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
        <div>Loading related movies...</div>
      </div>
    );
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  if (relatedMovies.length === 0) {
    return <div className="no-related-movies">No related movies found</div>;
  }

  return (
    <div className="related-movies-container">
      <div className="related-movies-header">
        <h2 className="related-movies-title">Related Movies</h2>
      </div>
      <div className="related-movies-grid">
        {relatedMovies.map((movie) => (
          <Link
            key={movie._id}
            to={`/movies/${movie._id}`}
            className="related-movie-card"
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

export default RelatedMovies;
