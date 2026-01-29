import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useEffect, useRef, useState } from "react";
import { Box, TextField, Typography, List, ListItem, ListItemButton } from "@mui/material";
import "leaflet/dist/leaflet.css";

function Location({ value, onChange }) {
    const [position, setPosition] = useState(value);
    const [search, setSearch] = useState("");
    const [results, setResults] = useState([]);
    const [address, setAddress] = useState("");
    const debounceRef = useRef(null);

    // 🔍 SAFE SEARCH (debounced)
    const handleSearch = (query) => {
        if (!query || query.length < 3) {
            setResults([]);
            return;
        }

        clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(async () => {
            try {
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                        query
                    )}&countrycodes=in`
                );

                if (!res.ok) throw new Error("API blocked");

                const data = await res.json();
                setResults(data);
            } catch (error) {
                console.error("Location search failed:", error);
                setResults([]);
            }
        }, 500); // ⏳ debounce delay
    };

    function LocationMarker() {
        useMapEvents({
            click(e) {
                setPosition(e.latlng);
                onChange(e.latlng);
                reverseGeocode(e.latlng.lat, e.latlng.lng);
            },
        });

        return position ? <Marker position={position} /> : null;
    }

    const reverseGeocode = async (lat, lng) => {
        try {
            const res = await fetch(`/api/geocode/reverse?lat=${lat}&lon=${lng}`)

            const data = await res.json();
            setAddress(data.display_name || "");
        } catch {
            setAddress("");
        }
    };

    const handleSelectLocation = (item) => {
        const latlng = {
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon),
        };

        setPosition(latlng);
        setAddress(item.display_name);
        onChange(latlng);
        setResults([]);
        setSearch(item.display_name);
    };

    return (
        <Box>
            <Box sx={{ position: "relative", zIndex: 1000 }}>
                <TextField
                    fullWidth
                    value={search}
                    placeholder="Search location here..."
                    onChange={(e) => {
                        setSearch(e.target.value);
                        handleSearch(e.target.value);
                    }}
                    sx={{
                        mb:2,
                        mt: 0.5,
                        "& .MuiOutlinedInput-root": {
                            borderRadius: "12px",
                            background: "#fff",
                        },
                    }} />
            </Box>

            {results.length > 0 && (
                <List
                    sx={{
                        maxHeight: 150,
                        overflowY: "auto",
                        border: "1px solid #ddd",
                        mb: 1,
                    }}
                >
                    {results.map((item) => (
                        <ListItem key={item.place_id} disablePadding>
                            <ListItemButton onClick={() => handleSelectLocation(item)}>
                                <Typography variant="body2">
                                    {item.display_name}
                                </Typography>
                            </ListItemButton>
                        </ListItem>

                    ))}
                </List>
            )}

            <MapContainer
                center={position ? [position.lat, position.lng] : [12.9716, 77.5946]}
                zoom={13}
                style={{ height: 300, width: "100%" }}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationMarker />
            </MapContainer>

            {position && (
                <Box mt={1}>
                    <Typography variant="body2">
                        <strong>Selected Location</strong>
                    </Typography>
                    <Typography variant="caption">{address}</Typography>
                    <Typography variant="caption">
                        Lat: {position.lat}, Lng: {position.lng}
                    </Typography>
                </Box>
            )}
        </Box>
    );
}

export default Location;
