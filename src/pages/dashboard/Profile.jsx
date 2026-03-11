import { useState, useEffect } from 'react'
import {
  Box, Paper, Typography, TextField, Button,
  Avatar, IconButton, Grid, Alert, Divider, Chip,
} from '@mui/material'
import { PhotoCamera, Edit, Save, Cancel } from '@mui/icons-material'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../components/Toast'
import { supabase } from '../../lib/supabase'

export default function Profile() {
  const { user, tenant, subscription, refreshTenant, trialDaysLeft, isTrialActive } = useAuth()
  const toast = useToast()

  const [editing,   setEditing]   = useState(false)
  const [saving,    setSaving]    = useState(false)
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({
    name: '', email: '', phone: '', description: '', logo_url: '',
  })

  // ── Populate form from tenant ──────────────────────────────
  useEffect(() => {
    if (tenant) {
      setForm({
        name:        tenant.name        || '',
        email:       tenant.email       || '',
        phone:       tenant.phone       || '',
        description: tenant.description || '',
        logo_url:    tenant.logo_url    || '',
      })
    }
  }, [tenant])

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

      setForm(f => ({ ...f, logo_url: urlData.publicUrl }))
      toast('Logo updated!', 'success')
    } catch (e) {
      toast('Logo upload failed', 'error')
    }
    setUploading(false)
  }

  // ── Save changes ───────────────────────────────────────────
  async function handleSave() {
    if (!form.name || !form.phone) {
      toast('Name and phone are required', 'error')
      return
    }

    setSaving(true)
    try {
      const { error } = await supabase
        .from('tenants')
        .update({
          name:        form.name,
          email:       form.email,
          phone:       form.phone,
          description: form.description,
          logo_url:    form.logo_url,
        })
        .eq('id', tenant.id)

      if (error) throw error

      await refreshTenant()
      setEditing(false)
      toast('Profile updated!', 'success')
    } catch (err) {
      toast(err.message || 'Update failed', 'error')
    }
    setSaving(false)
  }

  function handleCancel() {
    setForm({
      name:        tenant.name        || '',
      email:       tenant.email       || '',
      phone:       tenant.phone       || '',
      description: tenant.description || '',
      logo_url:    tenant.logo_url    || '',
    })
    setEditing(false)
  }

  // ── Subscription label ─────────────────────────────────────
  const subLabel = () => {
    if (!subscription) return { label: 'No Plan', color: 'default' }
    if (subscription.plan === 'trial') return { label: `Trial · ${trialDaysLeft()} days left`, color: 'success' }
    return { label: subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1), color: 'primary' }
  }
  const sub = subLabel()

  return (
    <Box>
      {/* ── Page header ── */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ mb: 0.5 }}>👤 Profile & Settings</Typography>
          <Typography sx={{ color: '#3d5068', fontSize: 13 }}>
            Manage your venue details and account
          </Typography>
        </Box>
        {!editing ? (
          <Button variant="outlined" startIcon={<Edit />} onClick={() => setEditing(true)}>
            Edit Profile
          </Button>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="outlined" startIcon={<Cancel />} onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="contained" startIcon={<Save />} onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        )}
      </Box>

      <Grid container spacing={3}>

        {/* ── Left: Logo + subscription ── */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
              <Avatar
                src={form.logo_url}
                sx={{
                  width: 100, height: 100,
                  bgcolor: '#1e2a3a',
                  border: '3px solid #243344',
                  fontSize: 40,
                  mx: 'auto',
                }}
              >
                🏢
              </Avatar>
              {editing && (
                <IconButton
                  component="label"
                  size="small"
                  disabled={uploading}
                  sx={{
                    position: 'absolute', bottom: 0, right: 0,
                    bgcolor: '#4f9cf9', color: '#fff',
                    width: 30, height: 30,
                    '&:hover': { bgcolor: '#7ab8ff' },
                  }}
                >
                  <PhotoCamera sx={{ fontSize: 16 }} />
                  <input type="file" accept="image/*" hidden onChange={handleLogoUpload} />
                </IconButton>
              )}
            </Box>

            <Typography variant="h6" sx={{ fontSize: 18, mb: 0.5 }}>
              {tenant?.name || 'Your Venue'}
            </Typography>
            <Typography sx={{ fontSize: 13, color: '#3d5068', mb: 2 }}>
              {user?.email}
            </Typography>

            <Chip label={sub.label} color={sub.color} size="small" sx={{ mb: 2 }} />

            <Divider sx={{ mb: 2 }} />

            {/* Account info */}
            <Box sx={{ textAlign: 'left' }}>
              <Typography sx={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.2, color: '#3d5068', fontWeight: 700, mb: 1.5 }}>
                Account Info
              </Typography>
              {[
                { label: 'Member since', value: new Date(user?.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) },
                { label: 'Plan',         value: subscription?.plan || 'None' },
                { label: 'Status',       value: subscription?.status || 'Inactive' },
              ].map((item, i) => (
                <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography sx={{ fontSize: 12, color: '#3d5068' }}>{item.label}</Typography>
                  <Typography sx={{ fontSize: 12, color: '#e2eaf4', fontWeight: 600 }}>{item.value}</Typography>
                </Box>
              ))}
            </Box>
          </Paper>

          {/* Trial info */}
          {isTrialActive() && (
            <Paper
              sx={{
                p: 2.5, mt: 2,
                background: 'rgba(61,214,140,0.06)',
                border: '1px solid rgba(61,214,140,0.2)',
              }}
            >
              <Typography sx={{ color: '#3dd68c', fontWeight: 700, fontSize: 13, mb: 0.5 }}>
                🎁 Free Trial Active
              </Typography>
              <Typography sx={{ fontSize: 12, color: '#3d5068' }}>
                {trialDaysLeft()} days remaining. Upgrade anytime to keep full access.
              </Typography>
              <Button variant="contained" size="small" fullWidth sx={{ mt: 1.5 }}>
                Upgrade Now
              </Button>
            </Paper>
          )}
        </Grid>

        {/* ── Right: Edit form ── */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography
              sx={{
                fontSize: 11, textTransform: 'uppercase',
                letterSpacing: 1.5, color: '#3d5068', fontWeight: 700, mb: 2.5,
                pb: 1, borderBottom: '1px solid #1e2a3a',
              }}
            >
              🏢 Venue Information
            </Typography>

            <TextField
              fullWidth label="Venue Name" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              disabled={!editing} sx={{ mb: 2 }} size="small"
            />

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 2 }}>
              <TextField
                fullWidth label="Contact Email" type="email" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                disabled={!editing} size="small"
              />
              <TextField
                fullWidth label="Phone Number" value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                disabled={!editing} size="small"
              />
            </Box>

            <TextField
              fullWidth label="Description" value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              disabled={!editing} multiline rows={3} sx={{ mb: 2 }} size="small"
            />

            {tenant?.address && (
              <TextField
                fullWidth label="Address" value={tenant.address}
                disabled size="small"
                helperText="To update address, please contact support"
              />
            )}
          </Paper>

          {/* Account settings */}
          <Paper sx={{ p: 3, mt: 2 }}>
            <Typography
              sx={{
                fontSize: 11, textTransform: 'uppercase',
                letterSpacing: 1.5, color: '#3d5068', fontWeight: 700,
                mb: 2.5, pb: 1, borderBottom: '1px solid #1e2a3a',
              }}
            >
              🔐 Account
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
              <Box>
                <Typography sx={{ fontSize: 13, fontWeight: 600 }}>Email Address</Typography>
                <Typography sx={{ fontSize: 12, color: '#3d5068' }}>{user?.email}</Typography>
              </Box>
              <Chip label="Verified" color="success" size="small" />
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Alert severity="info" sx={{ fontSize: 12 }}>
              To change your email or password, use the forgot password flow from the login page.
            </Alert>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
