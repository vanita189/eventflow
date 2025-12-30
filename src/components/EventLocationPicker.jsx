import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { FaSearch } from "react-icons/fa";

// Fix default marker icon in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Component to recenter map on search
const RecenterMap = ({ position }) => {
  const map = useMap();
  if (position) map.setView(position, 14);
  return null;
};

// Marker with click-to-select
const LocationMarker = ({ position, setPosition, setAddress }) => {
  useMapEvents({
    click: async (e) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      setPosition([lat, lng]);

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );
        const data = await res.json();
        setAddress(data.display_name || "Address not found");
      } catch {
        setAddress("Address not found");
      }
    },
  });

  return position ? <Marker position={position} /> : null;
};

function EventLocationPicker({ onLocationSelect }) {
  const [position, setPosition] = useState(null); // no default marker
  const [address, setAddress] = useState("");
  const [search, setSearch] = useState("");

  const handleSearch = async () => {
    if (!search) return;

    try {
      // Use Nominatim search API, allows streets, areas, etc.
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(search)}&addressdetails=1&limit=1`
      );
      const data = await res.json();
      if (data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        setPosition([lat, lon]);
        setAddress(data[0].display_name);
      } else {
        alert("Location not found. Try a different keyword.");
      }
    } catch (err) {
      console.error(err);
      alert("Error searching location");
    }
  };

  // Send selected location to parent
  if (position) onLocationSelect?.({ lat: position[0], lng: position[1], address });

  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "10px",
        padding: "12px",
        maxWidth: "500px",
        margin: "auto",
        backgroundColor: "#fafafa",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      {/* Search box */}
      <div style={{ display: "flex", marginBottom: "12px", position: "relative" }}>
        <FaSearch
          style={{
            position: "absolute",
            left: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "#555",
          }}
        />
        <input
          type="text"
          placeholder="Search area, street, or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            padding: "6px 10px 6px 30px", // padding-left for icon
            borderRadius: "6px",
            border: "1px solid #ccc",
            outline: "none",
          }}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: "6px 12px",
            marginLeft: "5px",
            border: "none",
            borderRadius: "6px",
            backgroundColor: "#4f46e5",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </div>

      {/* Map */}
      <div style={{ overflowX: "hidden", borderRadius: "8px", border: "1px solid #ddd" }}>
        <MapContainer
          center={[20, 78]}
          zoom={5}
          style={{ height: "250px", width: "100%", borderRadius: "8px" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <RecenterMap position={position} />
          <LocationMarker
            position={position}
            setPosition={setPosition}
            setAddress={setAddress}
          />
        </MapContainer>
      </div>

      {/* Selected address */}
      {address && (
        <div
          style={{
            marginTop: "10px",
            fontWeight: 500,
            padding: "6px 10px",
            backgroundColor: "#eef2ff",
            borderRadius: "6px",
            border: "1px solid #d0d5ff",
            color: "#1e40af",
            fontSize: "14px",
          }}
        >
          📍 Selected Address: {address}
        </div>
      )}
    </div>
  );
}

export default EventLocationPicker;
