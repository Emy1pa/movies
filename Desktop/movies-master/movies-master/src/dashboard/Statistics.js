// Statistics.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Users,
  Film,
  MessageCircle,
  Star,
  Calendar,
  Heart,
  Monitor,
  Home,
} from "lucide-react";
import "./statistics.css";
import { Link } from "react-router-dom";

const StatCard = ({ icon: Icon, title, value }) => (
  <div className="stat-card">
    <div className="stat-header">
      <div className="stat-icon-container">
        <Icon className="stat-icon" />
      </div>
    </div>
    <h3 className="stat-title">{title}</h3>
    <p className="stat-value">{value || "0"}</p>
  </div>
);

const Statistics = () => {
  const [stats, setStats] = useState({
    clients: { value: 0 },
    movies: { value: 0 },
    comments: { value: 0 },
    reservations: { value: 0 },
    averageRating: { value: 0 },
    favorites: { value: 0 },
    screens: { value: 0 },
    rooms: { value: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await axios.get(
          "http://localhost:8800/api/statistics",
          {
            headers: {
              token: token,
            },
          }
        );

        const data = response.data;
        if (data && typeof data === "object") {
          setStats({
            clients: { value: data.clients?.value || 0 },
            movies: { value: data.movies?.value || 0 },
            comments: { value: data.comments?.value || 0 },
            reservations: { value: data.reservations?.value || 0 },
            averageRating: { value: data.averageRating?.value || 0 },
            favorites: { value: data.favorites?.value || 0 },
            screens: { value: data.screens?.value || 0 },
            rooms: { value: data.rooms?.value || 0 },
          });
        } else {
          throw new Error("Invalid data format received from server");
        }
      } catch (err) {
        console.error("Error fetching statistics:", err);
        setError(err.message || "Failed to fetch statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="statistics-dashboard">
        <div className="loading-container">
          <div className="loader"></div>
          <p>Loading statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="statistics-dashboard">
        <div className="error-container">
          <p>Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="retry-button"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const statsConfig = [
    {
      icon: Users,
      title: "Total Users",
      value: stats.clients.value,
    },
    {
      icon: Film,
      title: "Total Movies",
      value: stats.movies.value,
    },
    {
      icon: MessageCircle,
      title: "Total Comments",
      value: stats.comments.value,
    },
    {
      icon: Star,
      title: "Average Rating",
      value: `${Number(stats.averageRating.value).toFixed(1)} / 5`,
    },
    {
      icon: Calendar,
      title: "Total Reservations",
      value: stats.reservations.value,
    },
    {
      icon: Heart,
      title: "Total Favorites",
      value: stats.favorites.value,
    },
    {
      icon: Monitor,
      title: "Total Screens",
      value: stats.screens.value,
    },
    {
      icon: Home,
      title: "Total Rooms",
      value: stats.rooms.value,
    },
  ];

  return (
    <div className="statistics-dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard Statistics</h1>
      </div>

      <div className="stats-grid">
        {statsConfig.map((stat, index) => (
          <StatCard
            key={index}
            icon={stat.icon}
            title={stat.title}
            value={stat.value}
          />
        ))}
      </div>
      <Link to={"/adminDashboard"} className="return-back-link">
        return back
      </Link>
    </div>
  );
};

export default Statistics;
