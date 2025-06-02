import React from "react";
import "./ContinueButton.css";

const ContinueButton = ({ onClick, disabled = false }) => {
  return (
    <button className={`continue-button ${disabled ? "disabled" : ""}`} onClick={onClick} disabled={disabled}>
      Continue
    </button>
  );
};

export default ContinueButton; // Ensure default export