import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import ThirdeyeButton from '../../components/Buttons/ThirdeyeButton';
import UserMarker from './components/UserMarker/UserMarker';
import UserInfoDetails from './components/UserInfoDetails/UserInfoDetails';
import './ThirdeyePage.css';

// Configure Leaflet markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const DEFAULT_LOCATION = [51.505, -0.09];
const MIN_RADIUS = 50;
const MAX_RADIUS = 5000;
const DEFAULT_ZOOM = 13;
const USER_ZOOM = 16;

const ThirdeyePage = () => {
  const [currentLocation, setCurrentLocation] = useState(DEFAULT_LOCATION);
  const [isActive, setIsActive] = useState(false);
  const [searchRadius, setSearchRadius] = useState(1000);
  const [nearbyUsers, setNearbyUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const userMarker = useRef(null);
  const radiusCircle = useRef(null);

  // Handle map container height and initialization
  useLayoutEffect(() => {
    const calculateContainerHeight = () => {
      const header = document.querySelector('header');
      const footer = document.querySelector('footer');
      const headerHeight = header?.offsetHeight || 60;
      const footerHeight = footer?.offsetHeight || 60;
      return `calc(100vh - ${headerHeight + footerHeight}px)`;
    };

    const initializeMap = () => {
      if (!mapRef.current) return;

      // Set container height before map initialization
      mapRef.current.style.height = calculateContainerHeight();

      if (!mapInstance.current) {
        // Initialize map only once
        const map = L.map(mapRef.current, {
          zoomControl: false,
          preferCanvas: true,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19,
        }).addTo(map);

        map.setView(DEFAULT_LOCATION, DEFAULT_ZOOM);
        mapInstance.current = map;
      }

      // Force map to recalculate size
      setTimeout(() => {
        if (mapInstance.current) {
          mapInstance.current.invalidateSize();
        }
      }, 0);

      updateUserMarker(DEFAULT_LOCATION);
      initGeolocation();
    };

    initializeMap();

    // Handle window resize
    const handleResize = () => {
      if (mapRef.current) {
        mapRef.current.style.height = calculateContainerHeight();
        if (mapInstance.current) {
          setTimeout(() => mapInstance.current.invalidateSize(), 100);
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // Update nearby users when location or radius changes
  useEffect(() => {
    if (isActive && currentLocation) {
      updateNearbyUsers();
    }
  }, [currentLocation, searchRadius, isActive]);

  const initGeolocation = () => {
    if (!navigator.geolocation) {
      console.warn("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = [position.coords.latitude, position.coords.longitude];
        setCurrentLocation(coords);
        if (mapInstance.current) {
          mapInstance.current.setView(coords, USER_ZOOM);
          updateUserMarker(coords);
        }
      },
      (error) => console.error("Geolocation error:", error),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const updateUserMarker = (coords) => {
    if (!mapInstance.current) return;

    if (userMarker.current) {
      mapInstance.current.removeLayer(userMarker.current);
    }

    userMarker.current = L.marker(coords, {
      icon: L.divIcon({
        className: "user-position-marker",
        html: `
          <div class="pulse-effect"></div>
          <div class="user-position-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="#4361ee">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </div>
        `,
        iconSize: [32, 32],
      }),
      zIndexOffset: 1000,
    }).addTo(mapInstance.current);

    if (isActive && radiusCircle.current) {
      radiusCircle.current.setLatLng(coords);
    }
  };

  const updateNearbyUsers = () => {
    if (!currentLocation || !mapInstance.current) return;

    const mockUsers = [
      {
        id: 1,
        name: "Alice",
        photo: "https://i.pravatar.cc/80?img=1",
        location: [
          currentLocation[0] + (Math.random() * 0.01 - 0.005),
          currentLocation[1] + (Math.random() * 0.01 - 0.005)
        ]
      },
      {
        id: 2,
        name: "Bob",
        photo: "https://i.pravatar.cc/80?img=2",
        location: [
          currentLocation[0] + (Math.random() * 0.01 - 0.005),
          currentLocation[1] + (Math.random() * 0.01 - 0.005)
        ]
      }
    ];

    setNearbyUsers(mockUsers.filter(user => 
      mapInstance.current.distance(currentLocation, user.location) <= searchRadius
    ));
  };

  const toggleThirdEye = () => {
    if (isActive) {
      deactivateThirdEye();
    } else {
      activateThirdEye();
    }
  };

  const activateThirdEye = () => {
    const radiusInput = window.prompt(
      `Enter search radius (${MIN_RADIUS}-${MAX_RADIUS}m):`,
      searchRadius.toString()
    );
    
    const radius = Math.min(
      Math.max(parseInt(radiusInput || searchRadius, 10), MIN_RADIUS),
      MAX_RADIUS
    );
    
    if (isNaN(radius)) {
      alert(`Please enter a valid number between ${MIN_RADIUS} and ${MAX_RADIUS}`);
      return;
    }

    setSearchRadius(radius);
    setIsActive(true);
    showRadiusCircle(radius);
  };

  const deactivateThirdEye = () => {
    setIsActive(false);
    removeRadiusCircle();
    setNearbyUsers([]);
  };

  const showRadiusCircle = (radius) => {
    if (!currentLocation || !mapInstance.current) return;

    removeRadiusCircle();

    radiusCircle.current = L.circle(currentLocation, {
      color: "#4361ee",
      fillColor: "#4361ee",
      fillOpacity: 0.1,
      radius,
    }).addTo(mapInstance.current);
  };

  const removeRadiusCircle = () => {
    if (radiusCircle.current && mapInstance.current) {
      mapInstance.current.removeLayer(radiusCircle.current);
      radiusCircle.current = null;
    }
  };

  const handleUserClick = (user) => {
    const distance = mapInstance.current.distance(currentLocation, user.location);
    setSelectedUser({
      ...user,
      distance: Math.round(distance)
    });
  };

  return (
    <div className="thirdeye-container">
      <div ref={mapRef} className="thirdeye-map"></div>
      <div className="thirdeye-control">
        <ThirdeyeButton isActive={isActive} onClick={toggleThirdEye} />
      </div>

      {nearbyUsers.map(user => (
        <UserMarker
          key={user.id}
          user={user}
          mapInstance={mapInstance.current}
          currentLocation={currentLocation}
          onClick={handleUserClick}
        />
      ))}

      {selectedUser && (
        <UserInfoDetails
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
};

export default ThirdeyePage;