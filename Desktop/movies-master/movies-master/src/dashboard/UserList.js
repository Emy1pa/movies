import React, { useState, useEffect } from "react";
import axios from "axios";
import "./user.css";
import { Link } from "react-router-dom";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8800/api/auth/users",
          {
            headers: {
              token: token,
            },
          }
        );
        console.log("Fetched users:", response.data);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, [token]);

  const handleBanUser = async (userId, currentStatus) => {
    console.log("User ID:", userId, "Current Status:", currentStatus);

    const newStatus = currentStatus === "banned" ? "active" : "banned";
    console.log("New Status:", newStatus);

    try {
      await axios.post(
        `http://localhost:8800/api/auth/users/${userId}/ban`,
        {
          accountStatus: newStatus,
        },
        {
          headers: {
            token: token,
          },
        }
      );
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, accountStatus: newStatus } : user
        )
      );
      const response = await axios.get("http://localhost:8800/api/auth/users", {
        headers: {
          token: token,
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  return (
    <div className="user-list">
      <h2>User List</h2>
      <div className="user-grid">
        {users.map((user) => (
          <div key={user._id} className="user-card">
            <div className="user-image-container">
              <img
                src={
                  user.image?.url ||
                  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                }
                alt={`${user.firstName} ${user.lastName}`}
                className="user-image"
              />
            </div>
            <div className="user-info">
              <h3>
                {user.firstName} {user.lastName}
              </h3>
              <p>Phone: {user.phoneNumber}</p>
              <p>Role: {user.role}</p>
              <p>Subscription: {user.subscriptionType}</p>
              <p>Status: {user.accountStatus || "active"}</p>
            </div>
            {user.role !== "admin" && (
              <button
                onClick={() => handleBanUser(user._id, user.accountStatus)}
                className={`toggle-ban-button ${
                  user.accountStatus === "banned" ? "unban" : "ban"
                }`}
              >
                {user.accountStatus === "banned" ? "Unban User" : "Ban User"}
              </button>
            )}
          </div>
        ))}
      </div>
      <Link to={"/adminDashboard"} className="return-back-link">
        return back
      </Link>
    </div>
  );
};

export default UserList;
