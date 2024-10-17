import React, { useState } from "react";
import { X, Upload } from "lucide-react";
import "./update.css";

export default function ProfileUpdate({ isOpen, onClose, infos, onUpdate }) {
  const [formData, setFormData] = useState({
    firstName: infos.firstName || "",
    lastName: infos.lastName || "",
    phoneNumber: infos.phoneNumber || "",
    address: infos.address || "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevState) => ({
        ...prevState,
        image: file,
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("firstName", formData.firstName);
    formDataToSend.append("lastName", formData.lastName);
    formDataToSend.append("phoneNumber", formData.phoneNumber);
    formDataToSend.append("address", formData.address);
    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `http://localhost:8800/api/auth/user/${infos._id}`,
        {
          method: "PUT",
          headers: {
            token: `${token}`,
          },
          body: formDataToSend,
        }
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("API error response:", errorResponse);
        throw new Error("Failed to update profile");
      }

      const updatedUser = await response.json();
      onUpdate(updatedUser);
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Update Profile</h2>
          <button onClick={onClose} className="modal-close-btn">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-form-group">
            <label htmlFor="firstName" className="modal-label">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="modal-input"
            />
          </div>
          <div className="modal-form-group">
            <label htmlFor="lastName" className="modal-label">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="modal-input"
            />
          </div>
          <div className="modal-form-group">
            <label htmlFor="phoneNumber" className="modal-label">
              Phone Number
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="modal-input"
            />
          </div>
          <div className="modal-form-group">
            <label htmlFor="address" className="modal-label">
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="modal-input"
            />
          </div>
          <div className="modal-form-group">
            <label htmlFor="image" className="modal-label">
              Profile Image
            </label>
            <div className="file-input-wrapper">
              <input
                type="file"
                id="image"
                name="image"
                onChange={handleImageChange}
                className="file-input"
                style={{ display: "none" }}
              />
              <button
                type="button"
                className="file-input-button"
                onClick={() => document.getElementById("image").click()}
              >
                <Upload size={20} />
                Choose File
              </button>
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="image-preview"
                  onClick={() => document.getElementById("image").click()}
                  style={{ cursor: "pointer" }}
                />
              )}
            </div>
          </div>
          <button type="submit" className="modal-submit-btn">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
