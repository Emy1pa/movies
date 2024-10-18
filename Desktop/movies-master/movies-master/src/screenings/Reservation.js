import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./reservation.css";

const Reservation = () => {
  const [screening, setScreening] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { screeningId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchScreening = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8800/api/screenings/${screeningId}`
        );
        setScreening(response.data);
      } catch (err) {
        setError("Error fetching screening details");
      } finally {
        setLoading(false);
      }
    };

    fetchScreening();
  }, [screeningId]);

  const handleSeatSelection = (row, column) => {
    const seatIndex = selectedSeats.findIndex(
      (seat) => seat.row === row && seat.column === column
    );
    if (seatIndex === -1) {
      setSelectedSeats([...selectedSeats, { row, column }]);
    } else {
      setSelectedSeats(selectedSeats.filter((_, index) => index !== seatIndex));
    }
  };

  const handleReservation = async () => {
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");

    console.log("Token:", token);
    console.log("User ID:", userId);

    if (!token || !userId) {
      setError("User not authenticated. Please log in.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8800/api/reservations`,
        {
          user: userId,
          screening: screeningId,
          room: screening.room._id,
          seats: selectedSeats,
          totalPrice: selectedSeats.length * screening.price,
        },
        {
          headers: {
            token: token,
          },
        }
      );

      console.log("Reservation created:", response.data);
      navigate("/reservation-confirmation", {
        state: { reservation: response.data },
      });
    } catch (err) {
      if (err.response) {
        setError(
          `Error: ${err.response.data.message || "Unknown error occurred"}`
        );
      } else {
        setError("Error creating reservation. Please try again.");
      }
      console.error("Reservation error:", err);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!screening) return <div className="error">Screening not found</div>;

  return (
    <div className="reservation-container">
      <h1 className="reservation-title">Select Your Seats</h1>
      <div className="screening-info">
        <p>Movie: {screening.movie?.title}</p>
        <p>Room: {screening.room.name}</p>
        <p>Price: ${screening.price}</p>
      </div>
      <div className="seats-container">
        {Array.from({ length: screening.room.rowsCount }, (_, row) => (
          <div key={row} className="seat-row">
            {Array.from({ length: screening.room.seatsPerRow }, (_, column) => (
              <button
                key={`${row}-${column}`}
                className={`seat ${
                  selectedSeats.some(
                    (seat) => seat.row === row + 1 && seat.column === column + 1
                  )
                    ? "selected"
                    : ""
                }`}
                onClick={() => handleSeatSelection(row + 1, column + 1)}
              >
                {row + 1}-{column + 1}
              </button>
            ))}
          </div>
        ))}
      </div>
      <div className="reservation-summary">
        <p>Selected Seats: {selectedSeats.length}</p>
        <p>
          Total Price: ${(selectedSeats.length * screening.price).toFixed(2)}
        </p>
      </div>
      <button
        className="confirm-button"
        onClick={handleReservation}
        disabled={selectedSeats.length === 0}
      >
        Confirm Reservation
      </button>
    </div>
  );
};

export default Reservation;
