import React from "react";
import "./CreateBusinessCardButton.css";

const CreateBusinessCardButton = ({ onClick }) => {
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onClick?.(e);
  };

  return (
    <button 
      className="create-business-card-button" 
      onClick={handleClick}
      aria-label="Create business card"
    >
      <i className="fas fa-plus"></i> Create a Free Business Card
    </button>
  );
};

export default CreateBusinessCardButton;