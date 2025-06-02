import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./DetailModal.module.css";

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const DetailModal = ({ member, onClose }) => {
  const [activeImage, setActiveImage] = useState(
    member ? member.frontImage || member.frontCardImage : null
  );
  const [showMap, setShowMap] = useState(false);
  const [coordinates, setCoordinates] = useState(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (e.target.classList.contains(styles["modal-overlay"])) {
        onClose();
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [onClose]);

  const handleAddressClick = () => {
    if (member.addressLocation) {
      setCoordinates([51.505, -0.09]); // London coordinates as example
      setShowMap(true);
    }
  };

  if (!member) {
    return (
      <div className={styles["modal-overlay"]}>
        <div className={styles["modal-content"]}>
          <p>No member data available.</p>
          <button className={styles["close-btn"]} onClick={onClose}>
            &times;
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles["modal-overlay"]}>
      <div className={styles["modal-content"]}>
        {/* Close Button */}
        <button className={styles["close-btn"]} onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 6L18 18" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Large Business Card Display */}
        <div className={styles["detail-display"]}>
          {activeImage && (
            <img
              src={activeImage}
              alt="Business Card"
              className={styles["detail-main-image"]}
            />
          )}
        </div>

        {/* Thumbnails for Switching Sides */}
        <div className={styles["detail-thumbnails"]}>
          {(member.frontImage || member.frontCardImage) && (
            <img
              src={member.frontImage || member.frontCardImage}
              alt="Front Side"
              className={`${styles.thumbnail} ${
                activeImage === (member.frontImage || member.frontCardImage) ? styles.active : ""
              }`}
              onClick={() => setActiveImage(member.frontImage || member.frontCardImage)}
            />
          )}
          {(member.backImage || member.backCardImage) && (
            <img
              src={member.backImage || member.backCardImage}
              alt="Back Side"
              className={`${styles.thumbnail} ${
                activeImage === (member.backImage || member.backCardImage) ? styles.active : ""
              }`}
              onClick={() => setActiveImage(member.backImage || member.backCardImage)}
            />
          )}
        </div>

        {/* Member Details */}
        <div className={styles["detail-info"]}>
          <div className={styles["info-section"]}>
            <h3>User Information</h3>
            <div className={styles["info-list"]}>
              <div className={styles["info-item"]}>
                <span className={styles["info-label"]}>Name:</span>
                <span className={styles["info-value"]}>{member.fullName || `${member.firstName} ${member.lastName}`}</span>
              </div>
              {member.position && (
                <div className={styles["info-item"]}>
                  <span className={styles["info-label"]}>Position:</span>
                  <span className={styles["info-value"]}>{member.position}</span>
                </div>
              )}
              {member.company && (
                <div className={styles["info-item"]}>
                  <span className={styles["info-label"]}>Company:</span>
                  <span className={styles["info-value"]}>{member.company}</span>
                </div>
              )}
              {member.phoneNumber && (
                <div className={styles["info-item"]}>
                  <span className={styles["info-label"]}>Phone:</span>
                  <a href={`tel:${member.phoneNumber}`} className={`${styles["info-value"]} ${styles.clickable}`}>
                    {member.phoneNumber}
                    <span className={styles["action-icon"]}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 4H9L11 9L8 10C9.5 12.5 12 15 14 16L15 13L20 15V19C20 20 19 21 18 21C10 21 3 14 3 6C3 5 4 4 5 4Z" fill="#007AFF"/>
                      </svg>
                    </span>
                  </a>
                </div>
              )}
              {member.email && (
                <div className={styles["info-item"]}>
                  <span className={styles["info-label"]}>Email:</span>
                  <a href={`mailto:${member.email}`} className={`${styles["info-value"]} ${styles.clickable}`}>
                    {member.email}
                    <span className={styles["action-icon"]}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M22 6L12 13L2 6" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </a>
                </div>
              )}
              {member.website && (
                <div className={styles["info-item"]}>
                  <span className={styles["info-label"]}>Website:</span>
                  <a href={member.website} target="_blank" rel="noopener noreferrer" className={`${styles["info-value"]} ${styles.clickable}`}>
                    {member.website}
                    <span className={styles["action-icon"]}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 13V19C18 20.1 17.1 21 16 21H5C3.9 21 3 20.1 3 19V8C3 6.9 3.9 6 5 6H11" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M15 3H21V9" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M10 14L21 3" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </a>
                </div>
              )}
              {member.department && (
                <div className={styles["info-item"]}>
                  <span className={styles["info-label"]}>Department:</span>
                  <span className={styles["info-value"]}>{member.department}</span>
                </div>
              )}
              {member.industry && (
                <div className={styles["info-item"]}>
                  <span className={styles["info-label"]}>Industry:</span>
                  <span className={styles["info-value"]}>{member.industry}</span>
                </div>
              )}
            </div>
          </div>

          {member.addressLocation && (
            <div className={styles["info-section"]}>
              <h3>Address</h3>
              <div className={styles["info-list"]}>
                <div className={styles["info-item"]}>
                  <button className={`${styles["info-value"]} ${styles.clickable} ${styles["address-btn"]}`} onClick={handleAddressClick}>
                    {member.addressLocation}
                    <span className={styles["action-icon"]}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </button>
                </div>
              </div>
              {showMap && coordinates && (
                <div className={styles["map-container"]}>
                  <MapContainer center={coordinates} zoom={13} style={{ height: '200px', borderRadius: '8px' }}>
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={coordinates}>
                      <Popup>{member.company || member.fullName}</Popup>
                    </Marker>
                  </MapContainer>
                </div>
              )}
            </div>
          )}

          {member.note && (
            <div className={styles["info-section"]}>
              <h3>Notes</h3>
              <div className={styles["info-list"]}>
                <div className={styles["info-item"]}>
                  <span className={styles["info-value"]}>{member.note}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailModal;