import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CreateMovie.css";

const CreateMovie = () => {
  const navigate = useNavigate();
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

      await axios.post("http://localhost:8800/api/movies", formDataToSend, {
        headers: {
          token: token,
          "Content-Type": "multipart/form-data",
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });

      navigate("/admin/movies");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create movie");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-movie-container">
      <header className="header">
        <div className="header-content">
          <h1 className="page-title">Create New Movie</h1>
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
                {image ? "Change image" : "Click to upload movie poster"}
              </span>
              <input
                type="file"
                className="file-upload-input"
                onChange={(e) => handleFileChange(e, "image")}
                accept="image/*"
              />
            </label>
            {image && (
              <div className="media-preview">
                <img
                  src={URL.createObjectURL(image)}
                  alt="Preview"
                  className="image-preview"
                />
                <p className="preview-filename">{image.name}</p>
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
                {video ? "Change video" : "Click to upload movie video"}
              </span>
              <input
                type="file"
                className="file-upload-input"
                onChange={(e) => handleFileChange(e, "video")}
                accept="video/*"
              />
            </label>
            {video && (
              <div className="media-preview">
                <video
                  className="video-preview"
                  controls
                  src={URL.createObjectURL(video)}
                />
                <p className="preview-filename">{video.name}</p>
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
            onClick={() => navigate("/admin/movies")}
          >
            <span className="btn-content">Cancel</span>
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            <span className="btn-content">
              {loading ? (
                <>
                  <div className="loading-spinner" />
                  Creating...
                </>
              ) : (
                "Create Movie"
              )}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateMovie;
