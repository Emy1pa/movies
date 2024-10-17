import React, { useEffect, useState } from "react";
import "./reservation-history.css";
import { Link } from "react-router-dom";
const Reservations = ({ userId }) => {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState("");

  const fetchUserReservations = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `http://localhost:8800/api/reservations/user/${userId}`,
        {
          method: "GET",
          headers: {
            token: `${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch reservations");
      }
      const data = await response.json();
      setReservations(data);
    } catch (error) {
      console.error("Error fetching reservations:", error);
      setError("Failed to fetch reservations");
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserReservations();
    }
  }, [userId]);

  return (
    <div className="reservations-container">
      <h1 className="reservations-title">Your Reservations</h1>
      {error && <div className="error-message">{error}</div>}
      {reservations.length > 0 ? (
        <div className="reservations-grid">
          {reservations.map((reservation) => (
            <div key={reservation._id} className="reservation-card">
              <div className="reservation-details">
                <p>
                  <span>Room:</span> {reservation.room.name}
                </p>
                <p>
                  <span>Price:</span> ${reservation.totalPrice}
                </p>
                <p>
                  <span>Seats:</span>
                </p>
                <div className="seats-grid">
                  {reservation.seats.map((seat, index) => (
                    <span key={index} className="seat-badge">
                      R{seat.row}C{seat.column}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-reservations">
          <p>No reservations found.</p>
        </div>
      )}
      <Link to={"/dashboard"} className="return-back-link">
        return back
      </Link>
    </div>
  );
};

export default Reservations;
