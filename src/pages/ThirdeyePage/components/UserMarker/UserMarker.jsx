import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import PropTypes from 'prop-types';
import './UserMarker.css';

const UserMarker = ({ 
  user, 
  mapInstance,
  currentLocation,
  onClick 
}) => {
  const markerRef = useRef(null);
  const [distance, setDistance] = useState(0);

  // Create custom icon
  const createIcon = () => L.divIcon({
    className: "user-marker-icon",
    html: `
      <div class="user-marker-container">
        <img src="${user.photo}" 
             alt="${user.name}" 
             class="user-marker-avatar"
             onerror="this.onerror=null;this.src='https://i.pravatar.cc/80?img=0'"
        />
        <span class="user-marker-name">${user.name}</span>
      </div>
    `,
    iconSize: [50, 60],
    popupAnchor: [0, -20]
  });

  // Initialize marker
  useEffect(() => {
    if (!mapInstance || !user.location) return;

    // Calculate initial distance
    const initialDistance = mapInstance.distance(currentLocation, user.location);
    setDistance(Math.round(initialDistance));

    // Create and add marker to map
    markerRef.current = L.marker(user.location, {
      icon: createIcon(),
      zIndexOffset: 1000
    }).addTo(mapInstance);

    // Set up click handler
    markerRef.current.on('click', () => {
      onClick({ ...user, distance: Math.round(distance) });
    });

    // Cleanup function
    return () => {
      if (markerRef.current && mapInstance) {
        mapInstance.removeLayer(markerRef.current);
      }
    };
  }, [mapInstance, user.location]);

  // Update marker position if location changes
  useEffect(() => {
    if (markerRef.current && user.location) {
      markerRef.current.setLatLng(user.location);
      const newDistance = mapInstance.distance(currentLocation, user.location);
      setDistance(Math.round(newDistance));
    }
  }, [user.location, currentLocation]);

  return null; // No DOM rendering needed for this component
};

UserMarker.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    photo: PropTypes.string.isRequired,
    location: PropTypes.arrayOf(PropTypes.number).isRequired,
  }).isRequired,
  mapInstance: PropTypes.object,
  currentLocation: PropTypes.arrayOf(PropTypes.number),
  onClick: PropTypes.func,
};

UserMarker.defaultProps = {
  onClick: () => {}
};

export default React.memo(UserMarker);