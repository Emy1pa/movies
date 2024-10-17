import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";
import "./available-screenings.css";

const AvailableScreenings = () => {
  const [screenings, setScreenings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { movieId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchScreenings = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8800/api/screenings`
        );
        setScreenings(response.data);
        setLoading(false);
      } catch (err) {
        setError("Error fetching screenings");
        setLoading(false);
      }
    };

    fetchScreenings();
  }, [movieId]);

  const handleReservation = (screeningId) => {
    navigate(`/reservation/${screeningId}`);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="available-screenings">
      <h2 className="screenings-title">Available Screenings</h2>
      <div className="available-screenings-container">
        {screenings.map((screening) => (
          <div key={screening._id} className="screening-card">
            <h3>{screening.movie?.title}</h3>
            <div className="screening-info">
              <p>
                <span>Date:</span> {format(new Date(screening.dateTime), "PPP")}
              </p>
              <p>
                <span>Time:</span> {format(new Date(screening.dateTime), "p")}
              </p>
              <p>
                <span>Room:</span> {screening.room.name}
              </p>
              <p>
                <span>Price:</span> ${screening.price.toFixed(2)}
              </p>
            </div>
            <button
              onClick={() => handleReservation(screening._id)}
              className="reserve-button"
            >
              Reserve Seats
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvailableScreenings;
