import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./movies.css";

const MovieList = ({ movies, genres }) => {
  const [filteredMovies, setFilteredMovies] = useState(movies);
  const [titleFilter, setTitleFilter] = useState("");
  const [genreFilter, setGenreFilter] = useState("");

  useEffect(() => {
    const filtered = movies.filter((movie) => {
      const titleMatch = movie.title
        .toLowerCase()
        .includes(titleFilter.toLowerCase());
      const genreMatch = genreFilter === "" || movie.genre === genreFilter;
      return titleMatch && genreMatch;
    });
    setFilteredMovies(filtered);
  }, [titleFilter, genreFilter, movies]);

  return (
    <div className="movies-container">
      <h1 className="movies-title">Movies</h1>
      <div className="filters-container">
        <div className="filter-group">
          <label htmlFor="title-filter">Title:</label>
          <input
            id="title-filter"
            type="text"
            placeholder="Filter by title"
            value={titleFilter}
            onChange={(e) => setTitleFilter(e.target.value)}
            className="filter-input"
          />
        </div>
        <div className="filter-group">
          <label htmlFor="genre-filter">Genre:</label>
          <select
            id="genre-filter"
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
            className="filter-input"
          >
            <option value="">All Genres</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="movies-grid">
        {filteredMovies.map((movie) => (
          <div key={movie._id} className="movie-card">
            <div className="movie-image-container">
              <img
                src={
                  movie.image?.url ||
                  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                }
                alt={movie.title}
                className="movie-image"
              />
            </div>
            <div className="movie-infos">
              <h2 className="movie-title">{movie.title}</h2>
              <div className="movie-duration">
                <span className="icon">🕒</span>
                <span>{movie.duration} min</span>
              </div>
              <div className="movie-genre">
                <span className="icon">🎬</span>
                <span>{movie.genre}</span>
              </div>
              <Link to={`/movie/${movie._id}`} className="show-details-btn">
                Show Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get("http://localhost:8800/api/movies");
        setMovies(response.data);

        const uniqueGenres = [
          ...new Set(response.data.map((movie) => movie.genre)),
        ];
        setGenres(uniqueGenres);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
  }, []);

  return <MovieList movies={movies} genres={genres} />;
};

export default Movies;
