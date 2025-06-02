import React, { useState, useEffect } from 'react';
import L from 'leaflet'; // Leaflet library
import 'leaflet/dist/leaflet.css'; // Leaflet CSS
import './UserProfile.css'; // Custom CSS

const UserProfile = () => {
  // State for profile data
  const [profileData, setProfileData] = useState({
    name: '',
    phone: '',
    businessType: '',
    company: '',
    position: '',
    website: '',
    address: '',
    notes: '',
    profileImage: null,
    businessCardFront: null,
    businessCardBack: null,
    location: { lat: null, lng: null }, // Added for map location
  });

  const [isEditing, setIsEditing] = useState(true);
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [showMap, setShowMap] = useState(false); // Toggle map visibility
  const [map, setMap] = useState(null); // Leaflet map instance
  const [marker, setMarker] = useState(null); // Leaflet marker instance
  const [isLoading, setIsLoading] = useState(false); // Loading state for reverse geocoding
  const [isSaved, setIsSaved] = useState(false); // State to track if profile is saved

  // Initialize the map
  useEffect(() => {
    if (showMap && !map) {
      const leafletMap = L.map('map').setView([51.505, -0.09], 13); // Default center and zoom
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(leafletMap);
      setMap(leafletMap);

      // Add click event to the map
      leafletMap.on('click', handleMapClick);
    }
  }, [showMap, map]);

  // Add/update marker on the map
  useEffect(() => {
    if (map && profileData.location.lat && profileData.location.lng) {
      if (marker) {
        marker.setLatLng([profileData.location.lat, profileData.location.lng]);
      } else {
        const newMarker = L.marker([profileData.location.lat, profileData.location.lng], {
          draggable: true,
        }).addTo(map);
        setMarker(newMarker);

        // Update location when marker is dragged
        newMarker.on('dragend', (e) => {
          const { lat, lng } = e.target.getLatLng();
          setProfileData((prev) => ({
            ...prev,
            location: { lat, lng },
          }));
          reverseGeocode(lat, lng); // Convert lat/lng to address
        });
      }
    }
  }, [map, profileData.location, marker]);

  // Auto-save functionality
  useEffect(() => {
    if (!isEditing) return;
    const saveData = () => {
      localStorage.setItem('profileData', JSON.stringify(profileData));
      console.log('Profile auto-saved:', profileData);
    };
    const interval = setInterval(saveData, 5000); // Auto-save every 5 seconds
    return () => clearInterval(interval);
  }, [profileData, isEditing]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle business type change
  const handleBusinessTypeChange = (e) => {
    const { value } = e.target;
    setProfileData((prev) => ({ ...prev, businessType: value }));
    setShowOtherInput(value === 'Other');
  };

  // Handle image upload
  const handleImageUpload = (file, type) => {
    if (file) {
      setProfileData((prev) => ({ ...prev, [type]: file }));
    }
  };

  // Handle save/edit toggle
  const handleSave = () => {
    setIsEditing((prev) => !prev);
    if (isEditing) {
      console.log('Profile saved:', profileData);
      setIsSaved(true); // Show success feedback
      setTimeout(() => setIsSaved(false), 3000); // Hide feedback after 3 seconds
    }
  };

  // Handle map click
  const handleMapClick = async (e) => {
    const { lat, lng } = e.latlng;
    setProfileData((prev) => ({
      ...prev,
      location: { lat, lng },
    }));
    await reverseGeocode(lat, lng); // Convert lat/lng to address
    setShowMap(false); // Hide map after selecting a location
  };

  // Reverse geocode using Nominatim (OpenStreetMap)
  const reverseGeocode = async (lat, lng) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      if (data.display_name) {
        setProfileData((prev) => ({
          ...prev,
          address: data.display_name,
        }));
      }
    } catch (error) {
      console.error('Error reverse geocoding:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="user-profile">
      {/* Title at the Top */}
      <h1>User Profile</h1>

      {/* Save/Edit Button with Feedback */}
      <button
        className={`save-button ${isSaved ? 'saved' : ''}`}
        onClick={handleSave}
      >
        {isEditing ? (isSaved ? 'Saved!' : 'Save Profile') : 'Edit Profile'}
      </button>

      {/* Profile Image Section */}
      <div className="profile-image-container">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e.target.files[0], 'profileImage')}
          disabled={!isEditing}
          id="profileImageInput"
          style={{ display: 'none' }}
        />
        <label htmlFor="profileImageInput" className="profile-image-wrapper">
          {profileData.profileImage ? (
            <img
              src={URL.createObjectURL(profileData.profileImage)}
              alt="Profile"
              className="profile-image"
              loading="lazy"
            />
          ) : (
            <div className="profile-image-placeholder">Upload Profile Image</div>
          )}
        </label>
      </div>

      {/* Form Section */}
      <div className="profile-form">
        <h2>Personal Details</h2>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={profileData.name}
          onChange={handleInputChange}
          disabled={!isEditing}
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={profileData.phone}
          onChange={handleInputChange}
          disabled={!isEditing}
        />
        <select
          name="businessType"
          value={profileData.businessType}
          onChange={handleBusinessTypeChange}
          disabled={!isEditing}
        >
          <option value="">Select Business Type</option>
          <option value="Accounting">Accounting</option>
          <option value="Advertising/Marketing">Advertising/Marketing</option>
          <option value="Other">Other</option>
        </select>
        {showOtherInput && (
          <input
            type="text"
            name="businessTypeOther"
            placeholder="Specify Business Type"
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        )}
        <input
          type="text"
          name="company"
          placeholder="Company"
          value={profileData.company}
          onChange={handleInputChange}
          disabled={!isEditing}
        />
        <input
          type="text"
          name="position"
          placeholder="Position"
          value={profileData.position}
          onChange={handleInputChange}
          disabled={!isEditing}
        />
        <input
          type="url"
          name="website"
          placeholder="Company Website"
          value={profileData.website}
          onChange={handleInputChange}
          disabled={!isEditing}
        />

        {/* Address Section */}
        <div className="address-section">
          <input
            type="text"
            name="address"
            placeholder="Address/Location"
            value={profileData.address}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
          <button
            type="button"
            className="map-button"
            onClick={() => setShowMap((prev) => !prev)}
            disabled={!isEditing || isLoading}
          >
            {isLoading ? 'Loading...' : showMap ? 'Hide Map' : 'Find on Map'}
          </button>
        </div>

        {/* Map Section */}
        {showMap && (
          <div className="map-container">
            <h3>Click on the map to select a location</h3>
            <div id="map" style={{ height: '300px', width: '100%' }}></div>
          </div>
        )}

        <textarea
          name="notes"
          placeholder="Notes"
          value={profileData.notes}
          onChange={handleInputChange}
          disabled={!isEditing}
        />
      </div>

      {/* Business Card Section */}
      <div className="business-card-container">
        <h2>Business Card</h2>
        <div className="business-card-wrapper">
          <div className="business-card">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files[0], 'businessCardFront')}
              disabled={!isEditing}
              id="businessCardFront"
              style={{ display: 'none' }}
            />
            <label htmlFor="businessCardFront" className="business-card-upload-label">
              {profileData.businessCardFront ? (
                <div className="business-card-preview">
                  <img
                    src={URL.createObjectURL(profileData.businessCardFront)}
                    alt="Business Card Front"
                    className="business-card-image"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="business-card-placeholder">Front</div>
              )}
            </label>
          </div>
          <div className="business-card">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files[0], 'businessCardBack')}
              disabled={!isEditing}
              id="businessCardBack"
              style={{ display: 'none' }}
            />
            <label htmlFor="businessCardBack" className="business-card-upload-label">
              {profileData.businessCardBack ? (
                <div className="business-card-preview">
                  <img
                    src={URL.createObjectURL(profileData.businessCardBack)}
                    alt="Business Card Back"
                    className="business-card-image"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="business-card-placeholder">Back</div>
              )}
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;