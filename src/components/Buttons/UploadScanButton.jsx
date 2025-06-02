import React from "react";
import "./UploadScanButton.css";

const UploadScanButton = ({ onClick }) => {
  const handleClick = (e) => {
    // Safely handle the click event
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    console.log("Upload button clicked"); // Debug log
    if (onClick) onClick();
  };

  return (
    <button 
      className="upload-scan-button" 
      onClick={handleClick}
      aria-label="Upload business card"
    >
      <i className="fas fa-upload"></i> Upload Your Business Card
    </button>
  );
};

export default UploadScanButton;