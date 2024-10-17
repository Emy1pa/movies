import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MovieGallery.css";
import { Link } from "react-router-dom";
import EditMovie from "./EditMovie";

const MovieGallery = () => {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    movieId: null,
    movieTitle: "",
  });

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get("http://localhost:8800/api/movies");
        setMovies(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching movies:", error);
        setError("Failed to load movies. Please try again later.");
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  const openDeleteModal = (movieId, movieTitle) => {
    setDeleteModal({
      isOpen: true,
      movieId,
      movieTitle,
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      movieId: null,
      movieTitle: "",
    });
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(
        `http://localhost:8800/api/movies/${deleteModal.movieId}`,
        {
          headers: {
            token: token,
          },
        }
      );
      setMovies(movies.filter((movie) => movie._id !== deleteModal.movieId));
      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting movie:", error);
      setError("Failed to delete movie. Please try again later.");
    }
  };

  const handleEdit = (movie) => {
    console.log("Edit movie:", movie);
  };

  const DeleteConfirmationModal = () => {
    if (!deleteModal.isOpen) return null;

    return (
      <div
        className="modal-backdrop"
        onClick={(e) => {
          if (e.target.className === "modal-backdrop") closeDeleteModal();
        }}
      >
        <div className="modal">
          <div className="modal-header">
            <h3 className="modal-title">Delete Movie</h3>
            <button className="modal-close" onClick={closeDeleteModal}>
              <svg
                className="icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="modal-content">
            Are you sure you want to delete "{deleteModal.movieTitle}"? This
            action cannot be undone.
          </div>
          <div className="modal-actions">
            <button
              className="modal-btn modal-btn-cancel"
              onClick={closeDeleteModal}
            >
              Cancel
            </button>
            <button
              className="modal-btn modal-btn-confirm"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="loading">Loading movies...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div>
      <header className="header">
        <div className="header-content">
          <h1 className="page-title">Featured Movies</h1>
          <Link to={"/movies/create"}>
            <button
              className="btn"
              onClick={() => console.log("Create new movie")}
            >
              <svg
                className="icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              Add Movie
            </button>
          </Link>
        </div>
      </header>

      <div className="container">
        <div className="movies-grid">
          {movies.map((movie, index) => (
            <div className="movie-card" key={movie._id || index}>
              <div className="movie-image-container">
                <img
                  className="movie-image"
                  src={movie.image?.url}
                  alt={movie.title}
                  onError={(e) => {
                    e.target.src =
                      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
                  }}
                />
              </div>
              <div className="movie-content">
                <h2 className="movie-title">{movie.title}</h2>
                <div className="movie-details">
                  <div>
                    <span className="genre-badge">{movie.genre}</span>
                  </div>
                  <div>{movie.duration} minutes</div>
                  <div>
                    {new Date(movie.published_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                  <div className="movie-actions">
                    <Link to={`/admin/movies/edit/${movie._id}`}>
                      <button className="action-btn">
                        <svg
                          className="icon"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        Edit
                      </button>
                    </Link>
                    <button
                      className="action-btn"
                      onClick={() => openDeleteModal(movie._id, movie.title)}
                    >
                      <svg
                        className="icon"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <DeleteConfirmationModal />
    </div>
  );
};

export default MovieGallery;
