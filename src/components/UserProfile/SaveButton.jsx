import React from "react";
import "./SaveButton.css";

const SaveButton = ({ onClick }) => {
  return (
    <button type="submit" className="save-profile-btn" onClick={onClick}>
      Save Profile
    </button>
  );
};

export default SaveButton;