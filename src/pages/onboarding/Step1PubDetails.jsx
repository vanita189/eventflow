import { useState } from 'react'
import {
  Box, Paper, TextField, Button,
  Typography, Alert, Avatar, IconButton,
} from '@mui/material'
import { PhotoCamera } from '@mui/icons-material'
import { supabase } from '../../lib/supabase'

export default function Step1PubDetails({ data, onChange, onNext }) {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', description: '', logo_url: '', ...data,
  })
  const [err,         setErr]         = useState('')
  const [uploading,   setUploading]   = useState(false)

  function update(key, val) {
    const updated = { ...form, [key]: val }
    setForm(updated)
    onChange(updated)
  }

  // ── Logo upload ────────────────────────────────────────────
  async function handleLogoUpload(e) {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    try {
      const ext      = file.name.split('.').pop()
      const fileName = `logos/${Date.now()}.${ext}`
      const { error: upErr } = await supabase.storage
        .from('uploads')
        .upload(fileName, file, { upsert: true })

      if (upErr) throw upErr

      const { data: urlData } = supabase.storage
        .from('uploads')
        .getPublicUrl(fileName)

      update('logo_url', urlData.publicUrl)
    } catch (e) {
      console.error('Logo upload failed:', e)
    }
    setUploading(false)
  }

  function handleNext() {
    if (!form.name || !form.phone) {
      setErr('Venue name and phone are required')
      return
    }
    setErr('')
    onNext()
  }

  return (
    <Paper sx={{ p: { xs: 2.5, sm: 4.5 }, width: '100%', maxWidth: 600 }}>

      {/* ── Header ── */}
      <Box sx={{ textAlign: 'center', mb: 3.5 }}>
        <Typography sx={{ fontSize: 40, mb: 1.5 }}>🏠</Typography>
        <Typography variant="h5" sx={{ mb: 0.5 }}>Tell us about your venue</Typography>
        <Typography sx={{ color: '#3d5068', fontSize: 13 }}>
          Basic information to get started
        </Typography>
      </Box>

      {err && <Alert severity="error" sx={{ mb: 2 }}>{err}</Alert>}

      {/* ── Logo Upload ── */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Box sx={{ position: 'relative' }}>
          <Avatar
            src={form.logo_url}
            sx={{
              width: 80, height: 80,
              bgcolor: '#1e2a3a',
              border: '2px dashed #243344',
              fontSize: 32,
            }}
          >
            🏢
          </Avatar>
          <IconButton
            component="label"
            size="small"
            disabled={uploading}
            sx={{
              position: 'absolute', bottom: -4, right: -4,
              bgcolor: '#4f9cf9', color: '#fff',
              width: 26, height: 26,
              '&:hover': { bgcolor: '#7ab8ff' },
            }}
          >
            <PhotoCamera sx={{ fontSize: 14 }} />
            <input type="file" accept="image/*" hidden onChange={handleLogoUpload} />
          </IconButton>
        </Box>
      </Box>
      <Typography sx={{ textAlign: 'center', fontSize: 11, color: '#3d5068', mb: 3 }}>
        {uploading ? 'Uploading...' : 'Click camera to upload your venue logo'}
      </Typography>

      {/* ── Form fields ── */}
      <TextField
        fullWidth label="Venue Name *" placeholder="e.g. The Golden Pint"
        value={form.name} onChange={e => update('name', e.target.value)}
        sx={{ mb: 2 }} size="small"
      />

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 2 }}>
        <TextField
          fullWidth label="Contact Email" type="email" placeholder="venue@email.com"
          value={form.email} onChange={e => update('email', e.target.value)}
          size="small"
        />
        <TextField
          fullWidth label="Phone Number *" placeholder="+91 9999999999"
          value={form.phone} onChange={e => update('phone', e.target.value)}
          size="small"
        />
      </Box>

      <TextField
        fullWidth label="Description" placeholder="Tell customers about your venue..."
        value={form.description} onChange={e => update('description', e.target.value)}
        multiline rows={3} sx={{ mb: 3 }} size="small"
      />

      {/* ── Navigation ── */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" onClick={handleNext}>
          Next: Location →
        </Button>
      </Box>
    </Paper>
  )
}
