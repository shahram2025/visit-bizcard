import React from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import PropTypes from "prop-types";
import "./ThirdeyeButton.css";

const ThirdeyeButton = ({ isActive, onClick }) => {
  return (
    <button
      className={`icon-btn third-eye-toggle ${isActive ? "active" : ""}`}
      onClick={onClick}
      aria-label={isActive ? "Close Third Eye" : "Open Third Eye"}
    >
      {isActive ? (
        <FaEyeSlash className="eye-icon" />
      ) : (
        <FaEye className="eye-icon" />
      )}
      <span className="toggle-label">
        {isActive ? "Close Radius" : "Open Radius"}
      </span>
    </button>
  );
};

ThirdeyeButton.propTypes = {
  isActive: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default ThirdeyeButton;