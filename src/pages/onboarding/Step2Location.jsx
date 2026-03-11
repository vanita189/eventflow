import { useState } from 'react'
import { Box, Paper, TextField, Button, Typography } from '@mui/material'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// ── Click handler for map ─────────────────────────────────────
function MapClick({ onSelect }) {
  useMapEvents({ click: e => onSelect(e.latlng.lat, e.latlng.lng) })
  return null
}

export default function Step2Location({ data, onChange, onBack, onNext }) {
  const [pos,       setPos]       = useState({ lat: data.lat || 51.505, lng: data.lng || -0.09 })
  const [address,   setAddress]   = useState(data.address || '')
  const [searching, setSearching] = useState(false)

  // ── Search by address ──────────────────────────────────────
  async function searchAddress() {
    if (!address) return
    setSearching(true)
    try {
      const res     = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`)
      const results = await res.json()
      if (results.length > 0) {
        const { lat, lon, display_name } = results[0]
        const newPos = { lat: parseFloat(lat), lng: parseFloat(lon) }
        setPos(newPos)
        setAddress(display_name)
        onChange({ ...newPos, address: display_name })
      }
    } catch (e) {
      console.error('Search error:', e)
    }
    setSearching(false)
  }

  // ── Reverse geocode on map click ───────────────────────────
  async function handleMapSelect(lat, lng) {
    setPos({ lat, lng })
    try {
      const res  = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
      const d    = await res.json()
      const addr = d.display_name || ''
      setAddress(addr)
      onChange({ lat, lng, address: addr })
    } catch {
      onChange({ lat, lng, address })
    }
  }

  return (
    <Paper sx={{ p: { xs: 2.5, sm: 4.5 }, width: '100%', maxWidth: 600 }}>

      {/* ── Header ── */}
      <Box sx={{ textAlign: 'center', mb: 3.5 }}>
        <Typography sx={{ fontSize: 40, mb: 1.5 }}>📍</Typography>
        <Typography variant="h5" sx={{ mb: 0.5 }}>Pin your venue on the map</Typography>
        <Typography sx={{ color: '#3d5068', fontSize: 13 }}>
          Search your address or click on the map
        </Typography>
      </Box>

      {/* ── Address search ── */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <TextField
          fullWidth label="Search Address" placeholder="Type your venue address..."
          value={address} onChange={e => setAddress(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && searchAddress()}
          size="small"
        />
        <Button
          variant="outlined" onClick={searchAddress}
          disabled={searching} sx={{ flexShrink: 0, minWidth: 80 }}
        >
          {searching ? '⏳' : '🔍 Search'}
        </Button>
      </Box>

      {/* ── Map ── */}
      <Box sx={{ borderRadius: 2, overflow: 'hidden', border: '1px solid #1e2a3a', height: 300, mb: 2 }}>
        <MapContainer
          center={[pos.lat, pos.lng]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution="© OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[pos.lat, pos.lng]} />
          <MapClick onSelect={handleMapSelect} />
        </MapContainer>
      </Box>

      <Typography sx={{ fontSize: 12, color: '#3d5068', mb: 3 }}>
        📍 {address || `${pos.lat.toFixed(4)}, ${pos.lng.toFixed(4)}`}
      </Typography>

      {/* ── Navigation ── */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="outlined" onClick={onBack}>← Back</Button>
        <Button
          variant="contained"
          onClick={() => { onChange({ ...pos, address }); onNext() }}
        >
          Next: First Event →
        </Button>
      </Box>
    </Paper>
  )
}
