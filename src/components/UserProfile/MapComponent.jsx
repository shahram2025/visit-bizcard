import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./MapComponent.css";

const MapComponent = ({ setAddressLocation }) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) {
      const map = L.map(mapRef.current).setView([51.505, -0.09], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      markerRef.current = L.marker([51.505, -0.09], { draggable: true }).addTo(map);

      markerRef.current.on("dragend", async () => {
        const latLng = markerRef.current.getLatLng();
        const address = await getAddressFromCoordinates(latLng.lat, latLng.lng);
        setAddressLocation(address);
      });

      map.on("click", async (e) => {
        const { lat, lng } = e.latlng;
        markerRef.current.setLatLng([lat, lng]);
        const address = await getAddressFromCoordinates(lat, lng);
        setAddressLocation(address);
      });

      return () => {
        map.remove();
      };
    }
  }, [setAddressLocation]);

  const getAddressFromCoordinates = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      return data.display_name || "Address not found";
    } catch (error) {
      console.error("Error fetching address:", error);
      return "Address not found";
    }
  };

  return (
    <div className="map-container">
      <div id="map" ref={mapRef}></div>
      <button
        type="button"
        className="close-map-btn"
        onClick={() => setAddressLocation("")}
      >
        Close Map
      </button>
    </div>
  );
};

export default MapComponent;