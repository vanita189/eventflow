import { useState } from 'react'
import { Box, Typography, TextField, Button, Grid, Chip, Paper } from '@mui/material'
import { Add } from '@mui/icons-material'

const PRESET_PACKAGES = [
  {
    name:        'Basic',
    description: 'Entry only',
    price:       '', capacity: '',
    includes:    ['General entry', 'Access to event area'],
    icon:        '🎟️',
  },
  {
    name:        'VIP',
    description: 'Entry + Drinks',
    price:       '', capacity: '',
    includes:    ['Priority entry', 'Welcome drink', 'Dedicated seating'],
    icon:        '🥂',
  },
  {
    name:        'Premium',
    description: 'Entry + Food + Drinks',
    price:       '', capacity: '',
    includes:    ['VIP entry', '3 course meal', 'Unlimited drinks'],
    icon:        '👑',
  },
  {
    name:        'Table',
    description: 'Reserved Table',
    price:       '', capacity: '',
    includes:    ['Reserved table', 'Table service', 'Personalised menu'],
    icon:        '🪑',
  },
]

export default function EventFormStep2({ packages, onChange }) {
  const [selected, setSelected] = useState(packages || [])

  // ── Toggle preset package ──────────────────────────────────
  function togglePackage(preset) {
    const exists  = selected.find(p => p.name === preset.name)
    const updated = exists
      ? selected.filter(p => p.name !== preset.name)
      : [...selected, { ...preset, price: '', capacity: '' }]
    setSelected(updated)
    onChange(updated)
  }

  // ── Update package field ───────────────────────────────────
  function updatePackage(name, key, val) {
    const updated = selected.map(p => p.name === name ? { ...p, [key]: val } : p)
    setSelected(updated)
    onChange(updated)
  }

  // ── Add custom package ─────────────────────────────────────
  function addCustom() {
    const updated = [...selected, {
      name: '', description: '', price: '', capacity: '',
      includes: [], icon: '✨', custom: true,
    }]
    setSelected(updated)
    onChange(updated)
  }

  // ── Remove custom package ──────────────────────────────────
  function removeCustom(i) {
    const updated = selected.filter((_, idx) => idx !== i)
    setSelected(updated)
    onChange(updated)
  }

  return (
    <Box>
      {/* ── Section header ── */}
      <Typography
        sx={{
          fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.5,
          color: '#3d5068', fontWeight: 700, mb: 1.5, pb: 1, borderBottom: '1px solid #1e2a3a',
        }}
      >
        📦 Select Packages
      </Typography>
      <Typography sx={{ fontSize: 13, color: '#3d5068', mb: 2 }}>
        Select packages to offer guests. Each package can have its own price and capacity.
      </Typography>

      {/* ── Preset package selector ── */}
      <Grid container spacing={1.5} sx={{ mb: 3 }}>
        {PRESET_PACKAGES.map(preset => {
          const isSelected = selected.find(p => p.name === preset.name)
          return (
            <Grid item xs={12} sm={6} md={3} key={preset.name}>
              <Box
                onClick={() => togglePackage(preset)}
                sx={{
                  border:     `2px solid ${isSelected ? '#4f9cf9' : '#1e2a3a'}`,
                  borderRadius: 2,
                  p:          2,
                  cursor:     'pointer',
                  bgcolor:    isSelected ? 'rgba(79,156,249,0.06)' : '#0d1117',
                  transition: 'all 0.2s',
                  textAlign:  'center',
                  '&:hover':  { borderColor: isSelected ? '#4f9cf9' : '#243344' },
                }}
              >
                <Typography sx={{ fontSize: 28, mb: 0.5 }}>{preset.icon}</Typography>
                <Typography sx={{ fontWeight: 700, fontSize: 13, mb: 0.3 }}>{preset.name}</Typography>
                <Typography sx={{ fontSize: 11, color: '#3d5068', mb: 1 }}>{preset.description}</Typography>
                {preset.includes.map((inc, i) => (
                  <Typography key={i} sx={{ fontSize: 10, color: '#3dd68c', mb: 0.3 }}>✓ {inc}</Typography>
                ))}
                <Chip
                  label={isSelected ? '✓ Added' : '+ Add'}
                  size="small"
                  sx={{
                    mt: 1.5, fontSize: 10, height: 20, cursor: 'pointer',
                    bgcolor: isSelected ? '#4f9cf9' : '#1e2a3a',
                    color:   isSelected ? '#fff' : '#3d5068',
                  }}
                />
              </Box>
            </Grid>
          )
        })}
      </Grid>

      {/* ── Configure selected packages ── */}
      {selected.length > 0 && (
        <Box>
          <Typography
            sx={{
              fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.5,
              color: '#3d5068', fontWeight: 700, mb: 2, pb: 1, borderBottom: '1px solid #1e2a3a',
            }}
          >
            ⚙️ Configure Packages
          </Typography>

          {selected.map((pkg, i) => (
            <Paper key={i} sx={{ p: 2.5, mb: 2, bgcolor: '#0d1117', border: '1px solid #1e2a3a' }}>
              {/* Package header */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Typography sx={{ fontSize: 22 }}>{pkg.icon}</Typography>
                {pkg.custom ? (
                  <TextField
                    size="small" placeholder="Package name"
                    value={pkg.name}
                    onChange={e => updatePackage(pkg.name, 'name', e.target.value)}
                    sx={{ maxWidth: 200 }}
                  />
                ) : (
                  <Typography sx={{ fontWeight: 700, color: '#7ab8ff', fontSize: 14 }}>
                    {pkg.name} Package
                  </Typography>
                )}
                {pkg.custom && (
                  <Button size="small" color="error" onClick={() => removeCustom(i)} sx={{ ml: 'auto' }}>
                    ✕ Remove
                  </Button>
                )}
              </Box>

              {/* Price + Capacity */}
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <TextField
                  fullWidth label="Price (₹) *" type="number" placeholder="0 for free"
                  value={pkg.price} onChange={e => updatePackage(pkg.name, 'price', e.target.value)}
                  size="small"
                />
                <TextField
                  fullWidth label="Capacity (slots)" type="number" placeholder="Leave empty = unlimited"
                  value={pkg.capacity} onChange={e => updatePackage(pkg.name, 'capacity', e.target.value)}
                  size="small"
                />
              </Box>

              {pkg.custom && (
                <TextField
                  fullWidth label="Description" placeholder="What's included?"
                  value={pkg.description} onChange={e => updatePackage(pkg.name, 'description', e.target.value)}
                  size="small" sx={{ mt: 2 }}
                />
              )}
            </Paper>
          ))}
        </Box>
      )}

      {/* ── Add custom package ── */}
      <Button variant="outlined" startIcon={<Add />} onClick={addCustom} size="small">
        Add Custom Package
      </Button>

      {selected.length === 0 && (
        <Typography sx={{ color: 'error.main', fontSize: 12, mt: 1.5 }}>
          ⚠️ Please add at least one package
        </Typography>
      )}
    </Box>
  )
}
