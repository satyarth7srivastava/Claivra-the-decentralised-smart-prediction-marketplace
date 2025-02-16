"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix marker icon issue in Leaflet for Next.js
const markerIcon = new L.Icon({
  iconUrl: "/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const Map = () => {
  // Set position to NIT Patna Campus
  const position: [number, number] = [25.6207, 85.1729];

  return (
    <MapContainer
      center={position}
      zoom={15} // Increased zoom level for better visibility
      style={{ height: "380px", width: "100%" }}
      scrollWheelZoom={true}
    >
      {/* Tile Layer */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Marker at NIT Patna */}
      <Marker position={position} icon={markerIcon}>
        <Popup>📍 NIT Patna Campus</Popup>
      </Marker>
    </MapContainer>
  );
};

export default Map;