import React from 'react';
import './PlusIcon.css';

const PlusIcon = ({ onClick }) => {
  return (
    <button id="plusIcon" className="plus-icon" onClick={onClick}>
      +
    </button>
  );
};

export default PlusIcon;