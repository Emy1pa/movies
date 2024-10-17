import React, { useEffect, useState } from "react";
import {
  Camera,
  Undo2,
  MapPin,
  Briefcase,
  Phone,
  CreditCard,
} from "lucide-react";
import { Link } from "react-router-dom";
import ProfileUpdate from "./ProfileUpdate";
import "./profile.css";
export default function UserProfile({ infos }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!infos) {
    return <div>Loading...</div>;
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const options = { weekday: "long", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const handleUpdateProfile = (updateData) => {
    console.log("updated profile data: ", updateData);
  };

  return (
    <div className="user-profile-container">
      <section className="profile-section">
        <div className="profile-card">
          <div className="profile-content">
            <div className="profile-image-container">
              <img
                src={
                  infos.image?.url ||
                  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                }
                alt={infos.firstName || "Profile"}
                className="profile-image"
              />
              <form className="profile-image-form">
                <label
                  htmlFor="file"
                  className="upload-icon"
                  title="Choose profile photo"
                >
                  <Camera size={20} />
                </label>
                {/* <input type="file" name="file" id="file" /> */}
                <button className="upload-btn" type="submit">
                  Upload
                </button>
              </form>
            </div>
            <h1 className="profile-username">
              {`${infos.firstName || ""} ${infos.lastName || ""}`}
            </h1>
            <p className="profile-bio">
              Hello, my name is {infos.firstName || "User"}, I am a movie lover
            </p>
            <div className="user-info">
              <div className="info-item">
                <MapPin size={16} />
                <span>{infos.address || "Address not provided"}</span>
              </div>
              <div className="info-item">
                <Briefcase size={16} />
                <span>{infos.role || "Role not specified"}</span>
              </div>
              <div className="info-item">
                <Phone size={16} />
                <span>{infos.phoneNumber || "Phone not provided"}</span>
              </div>
              <div className="info-item">
                <CreditCard size={16} />
                <span>
                  {infos.subscriptionType || "No active subscription"}
                </span>
              </div>
            </div>
            <div className="user-date-joined">
              <strong>Date Joined: </strong>
              <span>{formatDate(infos.createdAt) || "N/A"}</span>
            </div>
            <button
              className="update-profile-btn"
              onClick={() => {
                setIsModalOpen(true);
              }}
            >
              <Camera size={16} />
              Update Profile
            </button>
            <Link to={"/dashboard"}>
              <button className="update-profile-btn">
                <Undo2 size={16} />
                Cancel
              </button>
            </Link>
          </div>
        </div>
      </section>
      <ProfileUpdate
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdate={handleUpdateProfile}
        infos={infos}
      />
    </div>
  );
}

const UserInfos = ({ userId }) => {
  const [infos, setInfos] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(
          `http://localhost:8800/api/auth/user/${userId}`,
          {
            method: "GET",
            headers: {
              token: `${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setInfos(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      }
    };

    fetchData();
  }, [userId]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return <UserProfile infos={infos} />;
};

export { UserInfos };
