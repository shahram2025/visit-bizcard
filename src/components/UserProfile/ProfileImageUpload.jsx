import React from "react";
import "./ProfileImageUpload.css";

const ProfileImageUpload = ({ profileImage, handleProfileImageUpload }) => {
  return (
    <div className="profile-upload-section">
      <input
        type="file"
        id="profileUpload"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleProfileImageUpload}
      />
      <label htmlFor="profileUpload" className="profile-image-container">
        <img
          src={
            profileImage ||
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%2394a3b8' viewBox='0 0 24 24'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3a3 3 0 110 6 3 3 0 010-6zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E"
          }
          alt="Profile Preview"
          className="profile-image"
        />
        <div className="upload-icon">
          <i className="fas fa-camera"></i>
        </div>
      </label>
    </div>
  );
};

export default ProfileImageUpload;