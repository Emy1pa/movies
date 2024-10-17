import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./movie-details.css";
import { Heart } from "lucide-react";
import { FaHeart } from "react-icons/fa";
import MovieComments from "../dashboard/MovieComments";
import MovieRating from "./MovieRating";
import RelatedMovies from "./RelatedMovies";

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8800/api/movies/${id}`
        );
        setMovie(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching movie:", err);
        setError(`Error fetching movie details: ${err.message}`);
        setLoading(false);
      }
    };

    fetchMovie();
    checkIfFavorite();
  }, [id]);

  const checkIfFavorite = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `http://localhost:8800/api/favorites/user/${userId}`,
        {
          headers: {
            token: token,
          },
        }
      );
      const favorites = response.data;

      const favoriteMovie = favorites.find(
        (fav) => fav.movie.toString() === id
      );
      setIsFavorite(!!favoriteMovie);
    } catch (err) {
      console.error("Error checking favorites:", err);
    }
  };

  const handleFavoriteToggle = async () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("authToken");
    console.log("User ID:", userId);

    console.log("Token:", token);

    try {
      if (isFavorite) {
        await axios.delete(`http://localhost:8800/api/favorites`, {
          headers: {
            token: token,
          },
          data: { user: userId, movie: id },
        });
        setIsFavorite(false);
      } else {
        await axios.post(
          `http://localhost:8800/api/favorites`,
          { user: userId, movie: id },
          {
            headers: {
              token: token,
            },
          }
        );
        setIsFavorite(true);
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!movie) return <div className="error">Movie not found</div>;

  return (
    <div className="movie-details-container">
      <Link to="/movies" className="back-button">
        &larr; Back to Movies
      </Link>
      <div className="movie-details-content">
        <div className="movie-details-image">
          <img
            src={movie.image?.url || "/api/placeholder/400/600"}
            alt={movie.title}
          />
        </div>
        <div className="movie-details-info">
          <h1>{movie.title}</h1>
          <p>
            <span className="info-label">Duration:</span> {movie.duration}{" "}
            minutes
          </p>
          <p>
            <span className="info-label">Genre:</span> {movie.genre}
          </p>
          <p>
            <span className="info-label">Description:</span> {movie.description}
          </p>
          <p>
            <span className="info-label">Published At:</span>{" "}
            {new Date(movie.published_at).toLocaleDateString()}
          </p>

          <div
            className="favorite-icon"
            onClick={handleFavoriteToggle}
            style={{ cursor: "pointer" }}
          >
            {isFavorite ? (
              <FaHeart style={{ color: "red" }} />
            ) : (
              <Heart style={{ color: "gray" }} />
            )}{" "}
          </div>
          <MovieRating movieId={movie._id} />
          <Link to={`/screenings/${movie._id}`} className="book-now-button">
            Book Now
          </Link>
        </div>
      </div>
      <MovieComments movieId={movie._id} />
      <RelatedMovies currentMovie={movie} />
    </div>
  );
};

export default MovieDetails;
