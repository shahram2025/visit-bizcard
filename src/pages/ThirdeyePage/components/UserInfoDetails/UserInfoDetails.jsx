import React from 'react';
import PropTypes from 'prop-types';
import './UserInfoDetails.css';

const UserInfoDetails = ({ user, onClose }) => {
  return (
    <div className="user-details-modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        <div className="user-header">
          <img
            src={user.photo}
            alt={user.name}
            className="user-avatar"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://i.pravatar.cc/150?img=0";
            }}
          />
          <h3>{user.name}</h3>
        </div>
        <div className="user-details">
          <p><strong>Distance:</strong> {user.distance}m away</p>
          <p><strong>Location:</strong> {user.location[0].toFixed(5)}, {user.location[1].toFixed(5)}</p>
        </div>
      </div>
    </div>
  );
};

UserInfoDetails.propTypes = {
  user: PropTypes.shape({
    photo: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    location: PropTypes.arrayOf(PropTypes.number).isRequired,
    distance: PropTypes.number.isRequired
  }).isRequired,
  onClose: PropTypes.func.isRequired
};

export default UserInfoDetails;