import React from "react";
import "./ReservationConfirmation.css";

const ReservationConfirmation = () => {
  return (
    <div className="confirmation-container">
      <div className="confirmation-card">
        <h2>Reservation Successful</h2>
        <p>Your reservation has been successfully made!</p>
        <button className="back-button" onClick={() => window.history.back()}>
          Go Back
        </button>
      </div>
    </div>
  );
};

export default ReservationConfirmation;
