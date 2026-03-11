import { useState } from 'react'
import {
  Box, Paper, TextField, Button,
  Typography, Switch, FormControlLabel,
} from '@mui/material'

export default function Step3FirstEvent({ data, onChange, onBack, onNext }) {
  const [skip, setSkip] = useState(!data?.title)
  const [form, setForm] = useState({
    title: '', date: '', time: '', capacity: '', description: '', ...data,
  })

  function update(key, val) {
    const updated = { ...form, [key]: val }
    setForm(updated)
    onChange(updated)
  }

  function handleNext() {
    onChange(skip ? null : form)
    onNext()
  }

  return (
    <Paper sx={{ p: { xs: 2.5, sm: 4.5 }, width: '100%', maxWidth: 600 }}>

      {/* ── Header ── */}
      <Box sx={{ textAlign: 'center', mb: 3.5 }}>
        <Typography sx={{ fontSize: 40, mb: 1.5 }}>🎉</Typography>
        <Typography variant="h5" sx={{ mb: 0.5 }}>Create your first event</Typography>
        <Typography sx={{ color: '#3d5068', fontSize: 13 }}>
          Optional — you can create events from your dashboard later
        </Typography>
      </Box>

      {/* ── Skip toggle ── */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          bgcolor: '#0d1117',
          border: '1px solid #1e2a3a',
          borderRadius: 2,
          p: 1.5,
          mb: 3,
          cursor: 'pointer',
        }}
        onClick={() => setSkip(!skip)}
      >
        <Switch checked={!skip} size="small" color="primary" onChange={() => setSkip(!skip)} />
        <Typography sx={{ fontSize: 13, color: '#7a90a8' }}>
          {skip ? 'Skip for now' : 'Creating first event'}
        </Typography>
      </Box>

      {/* ── Event form ── */}
      {!skip && (
        <>
          <TextField
            fullWidth label="Event Title *" placeholder="e.g. Quiz Night"
            value={form.title} onChange={e => update('title', e.target.value)}
            sx={{ mb: 2 }} size="small"
          />

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 2 }}>
            <TextField
              fullWidth label="Date *" type="date"
              value={form.date} onChange={e => update('date', e.target.value)}
              size="small" InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth label="Time" type="time"
              value={form.time} onChange={e => update('time', e.target.value)}
              size="small" InputLabelProps={{ shrink: true }}
            />
          </Box>

          <TextField
            fullWidth label="Capacity" type="number" placeholder="e.g. 100"
            value={form.capacity} onChange={e => update('capacity', e.target.value)}
            sx={{ mb: 2 }} size="small"
          />

          <TextField
            fullWidth label="Description" placeholder="Tell people about this event..."
            value={form.description} onChange={e => update('description', e.target.value)}
            multiline rows={3} sx={{ mb: 3 }} size="small"
          />
        </>
      )}

      {/* ── Navigation ── */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: skip ? 0 : 1 }}>
        <Button variant="outlined" onClick={onBack}>← Back</Button>
        <Button variant="contained" onClick={handleNext}>
          {skip ? 'Skip → Choose Plan' : 'Next: Choose Plan →'}
        </Button>
      </Box>
    </Paper>
  )
}
