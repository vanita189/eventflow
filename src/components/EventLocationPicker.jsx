import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { FaSearch } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../redux/snackbar/snackbarSlice";

/* Fix default marker icon */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.flare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

/* Recenter map when value changes */
const RecenterMap = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) map.setView(position, 14);
  }, [position, map]);
  return null;
};

/* Marker + click handler */
const LocationMarker = ({ position, setPosition, setAddress, onChange }) => {
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
        const address = data.display_name || "Address not found";
        setAddress(address);

        onChange?.({ lat, lng, address });
      } catch {
        onChange?.({ lat, lng, address: "Address not found" });
      }
    },
  });

  return position ? <Marker position={position} /> : null;
};

function EventLocationPicker({ value, onChange }) {
  const [position, setPosition] = useState(null);
  const [address, setAddress] = useState("");
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  /* Load saved location */
  useEffect(() => {
    if (value?.lat && value?.lng) {
      setPosition([value.lat, value.lng]);
      setAddress(value.address || "");
    }
  }, [value]);

  const handleSearch = async () => {
    if (!search) return;

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          search
        )}&limit=1`
      );
      const data = await res.json();

      if (data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        const addr = data[0].display_name;

        setPosition([lat, lng]);
        setAddress(addr);

        onChange?.({ lat, lng, address: addr });
      } else {
        dispatch(
          showSnackbar({
            message: "Location not found",
            severity: "warning",
          })
        )
      }
    } catch {
      dispatch(
        showSnackbar({
          message: "Error searching location",
          severity: "error",
        })
      );
    }
  };

  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "10px",
        padding: "12px",
        backgroundColor: "#fafafa",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      {/* Search */}
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
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          style={{
            flex: 1,
            padding: "6px 10px 6px 30px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            outline: "none",
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: "6px 12px",
            marginLeft: "6px",
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
          onChange={onChange}
        />
      </MapContainer>

      {/* Address */}
      {address && (
        <div
          style={{
            marginTop: "10px",
            padding: "6px 10px",
            backgroundColor: "#eef2ff",
            borderRadius: "6px",
            border: "1px solid #d0d5ff",
            color: "#1e40af",
            fontSize: "14px",
          }}
        >
          📍 {address}
        </div>
      )}
    </div>
  );
}

export default EventLocationPicker;
