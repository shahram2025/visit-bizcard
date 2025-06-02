import React from "react";
import "./Header.css";

function Header({ profileImage, onProfileClick }) {
  return (
    <header className="header">
      {/* Profile Image Placeholder */}
      <div className="profile-image-container" onClick={onProfileClick}>
        <img
          src={profileImage}
          alt="User Profile"
          className="profile-image"
        />
      </div>

      {/* Logo */}
      <div className="logo">VISIT</div>
    </header>
  );
}

export default Header;