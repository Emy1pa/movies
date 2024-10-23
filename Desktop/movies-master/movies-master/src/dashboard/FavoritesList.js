import React, { useState, useEffect } from "react";
import axios from "axios";
import "./favoriteList.css";
import { Link } from "react-router-dom";

const FavoritesList = () => {
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const userId = localStorage.getItem("userId");
        const cachedFavorites = JSON.parse(
          localStorage.getItem("cachedFavorites") || "{}"
        );

        if (!token || !userId) {
          throw new Error("Authentication information is missing");
        }

        const response = await axios.get(
          `http://localhost:8800/api/favorites/user/${userId}`,
          {
            headers: { token: token },
          }
        );
        const serverFavorites = Array.isArray(response.data)
          ? response.data
          : response.data.favorites || [];

        const mergedFavorites = serverFavorites.map((fav) => ({
          ...fav,
          isCached: cachedFavorites[fav.movie?._id] !== undefined,
        }));

        setFavorites(mergedFavorites);
        const cachedMovieIds = Object.entries(cachedFavorites)
          .filter(([_, isFav]) => isFav)
          .map(([movieId]) => movieId);

        // setFavorites(Array.isArray(response.data) ? response.data : []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching favorites:", error);
        setError(error.message || "An error occurred while fetching favorites");
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  if (loading) {
    return <div className="loading">Loading favorites...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="favorites-container">
      <h2>My Favorites</h2>
      {favorites.length === 0 ? (
        <p className="no-favorites">You haven't added any favorites yet.</p>
      ) : (
        <div className="favorites-grid">
          {favorites.map((favorite) => (
            <div key={favorite._id} className="movie-card">
              <div className="movie-image-container">
                <img
                  src={
                    favorite.movie?.image?.url ||
                    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                  }
                  alt={favorite.movie?.title}
                  className="movie-image"
                />
              </div>
              <div className="movie-infos">
                <h3>{favorite.movie?.title}</h3>
                <p className="genre">{favorite.movie?.genre}</p>
                <p className="published-date">
                  Published:{" "}
                  {new Date(favorite.movie?.published_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
      <Link to={"/dashboard"} className="return-back-link">
        return back
      </Link>
    </div>
  );
};

export default FavoritesList;
