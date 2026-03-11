import { useState } from 'react'
import {
  Box, TextField, Typography, Button,
  MenuItem, Select, InputLabel, FormControl,
} from '@mui/material'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// ── Map click handler ─────────────────────────────────────────
function MapClick({ onSelect }) {
  useMapEvents({ click: e => onSelect(e.latlng.lat, e.latlng.lng) })
  return null
}

export default function EventFormStep1({ form, onChange }) {
  const [searching, setSearching] = useState(false)

  function update(key, val) {
    onChange({ ...form, [key]: val })
  }

  // ── Search location by name ────────────────────────────────
  async function searchLocation() {
    if (!form.location_address) return
    setSearching(true)
    try {
      const res  = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(form.location_address)}&limit=1`)
      const data = await res.json()
      if (data.length > 0) {
        onChange({
          ...form,
          lat:              parseFloat(data[0].lat),
          lng:              parseFloat(data[0].lon),
          location_address: data[0].display_name,
        })
      }
    } catch (e) {
      console.error('Location search error:', e)
    }
    setSearching(false)
  }

  // ── Reverse geocode on map click ───────────────────────────
  async function handleMapClick(lat, lng) {
    try {
      const res  = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
      const data = await res.json()
      onChange({ ...form, lat, lng, location_address: data.display_name || '' })
    } catch {
      onChange({ ...form, lat, lng })
    }
  }

  return (
    <Box>
      {/* ── Section: Basic Info ── */}
      <Typography
        sx={{
          fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.5,
          color: '#3d5068', fontWeight: 700, mb: 2, pb: 1, borderBottom: '1px solid #1e2a3a',
        }}
      >
        📋 Basic Information
      </Typography>

      <TextField
        fullWidth label="Event Title *" placeholder="e.g. Quiz Night, Live Music"
        value={form.title || ''} onChange={e => update('title', e.target.value)}
        sx={{ mb: 2 }} size="small"
      />

      <TextField
        fullWidth label="Description" placeholder="Describe your event..."
        value={form.description || ''} onChange={e => update('description', e.target.value)}
        multiline rows={2} sx={{ mb: 2 }} size="small"
      />

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 2 }}>
        <TextField
          fullWidth label="Date *" type="date"
          value={form.date || ''} onChange={e => update('date', e.target.value)}
          size="small" InputLabelProps={{ shrink: true }}
        />
        <TextField
          fullWidth label="Time *" type="time"
          value={form.time || ''} onChange={e => update('time', e.target.value)}
          size="small" InputLabelProps={{ shrink: true }}
        />
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 3 }}>
        <TextField
          fullWidth label="Capacity *" type="number" placeholder="Max guests"
          value={form.capacity || ''} onChange={e => update('capacity', e.target.value)}
          size="small"
        />
        <FormControl fullWidth size="small">
          <InputLabel>Status</InputLabel>
          <Select value={form.status || 'upcoming'} onChange={e => update('status', e.target.value)} label="Status">
            <MenuItem value="upcoming">Upcoming</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* ── Section: Event Image ── */}
      <Typography
        sx={{
          fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.5,
          color: '#3d5068', fontWeight: 700, mb: 2, pb: 1, borderBottom: '1px solid #1e2a3a',
        }}
      >
        🖼️ Event Image
      </Typography>

      <TextField
        fullWidth label="Image URL" placeholder="Paste image URL or upload below..."
        value={form.image_url || ''} onChange={e => update('image_url', e.target.value)}
        sx={{ mb: 1 }} size="small"
      />

      {form.image_url && (
        <Box
          component="img"
          src={form.image_url}
          alt="Event preview"
          sx={{
            width: '100%', height: 140, objectFit: 'cover',
            borderRadius: 2, border: '1px solid #1e2a3a', mb: 3,
          }}
          onError={e => { e.target.style.display = 'none' }}
        />
      )}

      {!form.image_url && <Box sx={{ mb: 3 }} />}

      {/* ── Section: Location ── */}
      <Typography
        sx={{
          fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.5,
          color: '#3d5068', fontWeight: 700, mb: 2, pb: 1, borderBottom: '1px solid #1e2a3a',
        }}
      >
        📍 Event Location
      </Typography>

      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <TextField
          fullWidth label="Search Location" placeholder="Search address or venue..."
          value={form.location_address || ''} onChange={e => update('location_address', e.target.value)}
          onKeyDown={e => e.key === 'Enter' && searchLocation()}
          size="small"
        />
        <Button
          variant="outlined" onClick={searchLocation}
          disabled={searching} sx={{ flexShrink: 0, minWidth: 80 }}
        >
          {searching ? '⏳' : '🔍'}
        </Button>
      </Box>

      <Box sx={{ borderRadius: 2, overflow: 'hidden', border: '1px solid #1e2a3a', height: 260 }}>
        <MapContainer
          center={[form.lat || 51.505, form.lng || -0.09]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap" />
          <Marker position={[form.lat || 51.505, form.lng || -0.09]} />
          <MapClick onSelect={handleMapClick} />
        </MapContainer>
      </Box>

      <Typography sx={{ fontSize: 11, color: '#3d5068', mt: 1 }}>
        📍 Click on map to pin exact location
      </Typography>
    </Box>
  )
}
