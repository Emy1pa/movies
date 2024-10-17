import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./EditMovie.css";

const EditMovie = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    duration: "",
    genre: "",
    description: "",
    published_at: new Date().toISOString().split("T")[0],
    visibility: "public",
  });
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [currentImage, setCurrentImage] = useState("");
  const [currentVideo, setCurrentVideo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMovie = async () => {
      if (!id) {
        setError("Movie ID is missing");
        setLoading(false);
        return;
      }
      try {
        const token = localStorage.getItem("authToken");
        console.log("Token:", token);

        const response = await axios.get(
          `http://localhost:8800/api/movies/${id}`,
          {
            headers: {
              token: token,
            },
          }
        );
        const movie = response.data;
        setFormData({
          title: movie.title,
          duration: movie.duration,
          genre: movie.genre,
          description: movie.description,
          published_at: movie.published_at
            ? movie.published_at.split("T")[0]
            : "",
          visibility: movie.visibility || "public",
        });
        setCurrentImage(movie.image?.url || "");
        setCurrentVideo(movie.video?.url || "");
      } catch (err) {
        setError("Failed to fetch movie details");
        console.error("Error fetching movie:", err);
      }
    };

    fetchMovie();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (type === "image") {
      setImage(file);
    } else {
      setVideo(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("authToken");
      const formDataToSend = new FormData();

      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });

      if (image) formDataToSend.append("image", image);
      if (video) formDataToSend.append("video", video);

      await axios.put(
        `http://localhost:8800/api/movies/${id}`,
        formDataToSend,
        {
          headers: {
            token: token,
            "Content-Type": "multipart/form-data",
          },
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
        }
      );

      navigate("/admin/movies");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update movie");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-movie-container">
      <header className="header">
        <div className="header-content">
          <h1 className="page-title">Edit Movie</h1>
        </div>
      </header>

      <form className="create-movie-form" onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            maxLength="200"
          />
        </div>
        <div className="form-group">
          <label htmlFor="duration">Duration (minutes)</label>
          <input
            type="number"
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            required
            min="1"
          />
        </div>
        <div className="form-group">
          <label htmlFor="genre">Genre</label>
          <input
            type="text"
            id="genre"
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            required
            maxLength="50"
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            maxLength="1000"
          />
        </div>

        <div className="form-group">
          <label>Movie Poster</label>
          <div className="file-upload-container">
            <label className="file-upload-label">
              <svg
                className="file-upload-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
              </svg>
              <span className="file-upload-text">
                {image ? "Change image" : "Click to update movie poster"}
              </span>
              <input
                type="file"
                className="file-upload-input"
                onChange={(e) => handleFileChange(e, "image")}
                accept="image/*"
              />
            </label>
            {(image || currentImage) && (
              <div className="media-preview">
                <img
                  src={image ? URL.createObjectURL(image) : currentImage}
                  alt="Preview"
                  className="image-preview"
                />
                <p className="preview-filename">
                  {image ? image.name : "Current image"}
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="form-group">
          <label>Video</label>
          <div className="file-upload-container">
            <label className="file-upload-label">
              <svg
                className="file-upload-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
              </svg>
              <span className="file-upload-text">
                {video ? "Change video" : "Click to update movie video"}
              </span>
              <input
                type="file"
                className="file-upload-input"
                onChange={(e) => handleFileChange(e, "video")}
                accept="video/*"
              />
            </label>
            {(video || currentVideo) && (
              <div className="media-preview">
                <video
                  className="video-preview"
                  controls
                  src={video ? URL.createObjectURL(video) : currentVideo}
                />
                <p className="preview-filename">
                  {video ? video.name : "Current video"}
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="published_at">Publication Date</label>
          <input
            type="date"
            id="published_at"
            name="published_at"
            value={formData.published_at}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="visibility">Visibility</label>
          <select
            id="visibility"
            name="visibility"
            value={formData.visibility}
            onChange={handleChange}
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/movies")}
          >
            <span className="btn-content">Cancel</span>
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            <span className="btn-content">
              {loading ? (
                <>
                  <div className="loading-spinner" />
                  Updating...
                </>
              ) : (
                "Update Movie"
              )}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditMovie;
