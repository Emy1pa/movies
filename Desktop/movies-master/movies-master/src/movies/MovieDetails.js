import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./movie-details.css";
import { Heart, X } from "lucide-react";
import { FaHeart } from "react-icons/fa";
import MovieComments from "../dashboard/MovieComments";
import MovieRating from "./MovieRating";
import RelatedMovies from "./RelatedMovies";
import { jwtDecode } from "jwt-decode";

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isWatchModalOpen, setIsWatchModalOpen] = useState(false);

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

    const getUserRole = () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          localStorage.setItem("userRole", decodedToken.role);

          setUserRole(decodedToken.role);
        } catch (error) {
          console.error("Error decoding token:", error);
        }
      }
    };

    fetchMovie();
    checkIfFavorite();
    getUserRole();
  }, [id]);

  // const checkIfFavorite = async () => {
  //   try {
  //     const userId = localStorage.getItem("userId");
  //     const token = localStorage.getItem("authToken");
  //     const response = await axios.get(
  //       `http://localhost:8800/api/favorites/user/${userId}`,
  //       {
  //         headers: {
  //           token: token,
  //         },
  //       }
  //     );
  //     const favorites = response.data;

  //     const favoriteMovie = favorites.find(
  //       (fav) => fav.movie?.toString() === id
  //     );
  //     setIsFavorite(!!favoriteMovie);
  //   } catch (err) {
  //     console.error("Error checking favorites:", err);
  //   }
  // };

  // const handleFavoriteToggle = async () => {
  //   const userId = localStorage.getItem("userId");
  //   const token = localStorage.getItem("authToken");
  //   if (userRole !== "client") return;

  //   try {
  //     if (isFavorite) {
  //       console.log("Removing favorite:", { user: userId, movie: id });

  //       await axios.delete(`http://localhost:8800/api/favorites`, {
  //         headers: {
  //           token: token,
  //           "Content-Type": "application/json",
  //         },
  //         data: { user: userId, movie: id },
  //       });
  //       setIsFavorite(false);
  //     } else {
  //       console.log("Adding favorite:", { user: userId, movie: id });

  //       await axios.post(
  //         `http://localhost:8800/api/favorites`,
  //         { user: userId, movie: id },
  //         {
  //           headers: {
  //             token: token,
  //             "Content-Type": "application/json",
  //           },
  //         }
  //       );

  //       setIsFavorite(true);
  //     }
  //   } catch (err) {
  //     console.error("Error toggling favorite:", err);
  //   }
  //   console.log("Sending favorite:", { user: userId, movie: id });
  // };
  const checkIfFavorite = async () => {
    try {
      const cachedFavorites = JSON.parse(
        localStorage.getItem("cachedFavorites") || "{}"
      );
      if (cachedFavorites[id] !== undefined) {
        setIsFavorite(cachedFavorites[id]);
        return;
      }

      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("authToken");
      if (userId && token) {
        const response = await axios.get(
          `http://localhost:8800/api/favorites/user/${userId}`,
          {
            headers: { token: token },
          }
        );
        const favorites = response.data;
        const favoriteMovie = favorites.find(
          (fav) => fav.movie?.toString() === id
        );
        const isFav = !!favoriteMovie;
        setIsFavorite(isFav);

        cachedFavorites[id] = isFav;
        localStorage.setItem(
          "cachedFavorites",
          JSON.stringify(cachedFavorites)
        );
      }
    } catch (err) {
      console.error("Error checking favorites:", err);
    }
  };

  const handleFavoriteToggle = async () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("authToken");

    const newFavoriteState = !isFavorite;
    setIsFavorite(newFavoriteState);

    const cachedFavorites = JSON.parse(
      localStorage.getItem("cachedFavorites") || "{}"
    );
    cachedFavorites[id] = newFavoriteState;
    localStorage.setItem("cachedFavorites", JSON.stringify(cachedFavorites));

    if (userRole === "client" && userId && token) {
      try {
        if (newFavoriteState) {
          await axios.post(
            `http://localhost:8800/api/favorites`,
            { user: userId, movie: id },
            {
              headers: {
                token: token,
                "Content-Type": "application/json",
              },
            }
          );
          cachedFavorites[id] = true;
        } else {
          await axios.delete(`http://localhost:8800/api/favorites`, {
            headers: {
              token: token,
              "Content-Type": "application/json",
            },
            data: { user: userId, movie: id },
          });
          console.log("User ID:", userId);
          console.log("Movie ID:", id);
          delete cachedFavorites[id];
        }
        localStorage.setItem(
          "cachedFavorites",
          JSON.stringify(cachedFavorites)
        );
      } catch (err) {
        console.error("Error toggling favorite:", err);
        setIsFavorite(!newFavoriteState);
        if (!newFavoriteState) {
          cachedFavorites[id] = true;
        } else {
          delete cachedFavorites[id];
        }
        cachedFavorites[id] = !newFavoriteState;
        localStorage.setItem(
          "cachedFavorites",
          JSON.stringify(cachedFavorites)
        );
      }
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!movie) return <div className="error">Movie not found</div>;

  const isClient = userRole === "client";
  const handleWatchMovie = () => {
    setIsWatchModalOpen(true);
  };

  const closeWatchModal = () => {
    console.log("Closing modal...");
    setIsWatchModalOpen(false);
  };
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

          <div className="movie-action-buttons">
            {isClient && (
              <>
                <Link
                  to={`/screenings/${movie._id}`}
                  className="book-now-button"
                >
                  Book Now
                </Link>
                <button
                  className="watch-movie-button"
                  onClick={handleWatchMovie}
                >
                  Watch Movie
                </button>
              </>
            )}
          </div>

          <div
            className={`favorite-icon ${!isClient ? "disabled" : ""}`}
            onClick={handleFavoriteToggle}
            style={{ cursor: isClient ? "pointer" : "not-allowed" }}
            title={!isClient ? "Only clients can add favorites" : ""}
          >
            {isFavorite ? (
              <FaHeart style={{ color: isClient ? "red" : "#ccc" }} />
            ) : (
              <Heart style={{ color: isClient ? "gray" : "#ccc" }} />
            )}
          </div>
        </div>
        {isWatchModalOpen && (
          <div className="watch-modal-overlay">
            <div className="watch-modal">
              <button className="close-modal" onClick={closeWatchModal}>
                <X size={24} />
              </button>
              <h2>{movie.title}</h2>
              <div className="video-container">
                {movie.video && movie.video.url ? (
                  <video controls className="video-player">
                    <source
                      src={movie.video.url}
                      type={`video/${movie.video.format}`}
                    />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div className="video-placeholder">
                    <img
                      src={
                        movie.image?.url ||
                        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                      }
                      alt={`${movie.title} poster`}
                    />
                    <p>Video not available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <MovieRating movieId={movie._id} />
      <MovieComments movieId={movie._id} />
      <RelatedMovies currentMovie={movie} />
    </div>
  );
};

export default MovieDetails;
