import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchStaff, createStaff, updateStaff, deleteStaff } from '../../store/slices/staffSlice'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../components/Toast'
import {
  Box, Paper, Button, Typography, TextField,
  Select, MenuItem, InputLabel, FormControl,
  Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, Chip, CircularProgress, InputAdornment,
  Grid, Avatar, Card, CardContent, CardActions,
} from '@mui/material'
import { Add, Edit, Delete, Search, Close, Pause, PlayArrow } from '@mui/icons-material'

const ROLES = ['Manager', 'Bartender', 'Waitress', 'Security', 'Chef', 'Host', 'Cleaner']

const ROLE_ICONS = {
  Manager: '👔', Bartender: '🍺', Waitress: '🍽️',
  Security: '🛡️', Chef: '👨‍🍳', Host: '🎤', Cleaner: '🧹',
}

const EMPTY_FORM = { name: '', email: '', role: 'Bartender', phone: '', status: 'active' }

export default function Staff() {
  const dispatch = useDispatch()
  const { tenant } = useAuth()
  const toast = useToast()

  const { items: staff, loading } = useSelector(s => s.staff)

  const [open,    setOpen]    = useState(false)
  const [editing, setEditing] = useState(null)
  const [form,    setForm]    = useState(EMPTY_FORM)
  const [search,  setSearch]  = useState('')
  const [saving,  setSaving]  = useState(false)

  useEffect(() => {
    if (tenant?.id) dispatch(fetchStaff(tenant.id))
  }, [tenant?.id])

  function openNew() {
    setEditing(null)
    setForm(EMPTY_FORM)
    setOpen(true)
  }

  function openEdit(s) {
    setEditing(s)
    setForm({ ...s })
    setOpen(true)
  }

  // ── Save staff ─────────────────────────────────────────────
  async function handleSave() {
    if (!form.name || !form.email) {
      toast('Name and email required', 'error')
      return
    }
    setSaving(true)
    try {
      if (editing) {
        await dispatch(updateStaff({ id: editing.id, data: form })).unwrap()
        toast('Staff updated!', 'success')
      } else {
        await dispatch(createStaff({ ...form, tenant_id: tenant.id })).unwrap()
        toast('Staff added!', 'success')
      }
      setOpen(false)
    } catch {
      toast('Failed', 'error')
    }
    setSaving(false)
  }

  const filtered = staff.filter(s =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.role?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}><CircularProgress /></Box>
  }

  return (
    <Box>
      {/* ── Page header ── */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ mb: 0.5 }}>👥 Staff Management</Typography>
          <Typography sx={{ color: '#3d5068', fontSize: 13 }}>
            {staff.length} members · {staff.filter(s => s.status === 'active').length} active
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={openNew}>Add Staff</Button>
      </Box>

      {/* ── Role summary chips ── */}
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
        {ROLES.map(r => {
          const count = staff.filter(s => s.role === r).length
          return count > 0 ? (
            <Chip
              key={r}
              label={`${ROLE_ICONS[r]} ${r} (${count})`}
              variant="outlined"
              size="small"
              sx={{ borderColor: '#1e2a3a', color: '#7a90a8' }}
            />
          ) : null
        })}
      </Box>

      {/* ── Search ── */}
      <TextField
        size="small" placeholder="Search staff..." value={search}
        onChange={e => setSearch(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search sx={{ fontSize: 18, color: '#3d5068' }} />
            </InputAdornment>
          ),
        }}
        sx={{ width: 260, mb: 3 }}
      />

      {/* ── Staff cards grid ── */}
      <Grid container spacing={2}>
        {filtered.map(s => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={s.id}>
            <Card
              sx={{
                bgcolor: '#111720', border: '1px solid #1e2a3a', borderRadius: 2.5,
                transition: 'all 0.2s', '&:hover': { borderColor: '#243344' },
              }}
            >
              <CardContent sx={{ pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 1.5 }}>
                  <Avatar
                    sx={{
                      width: 42, height: 42,
                      background: 'linear-gradient(135deg, #2a5fa8, #4f9cf9)',
                      borderRadius: 2, fontSize: 18,
                    }}
                  >
                    {ROLE_ICONS[s.role] || '👤'}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: 14 }}>{s.name}</Typography>
                    <Typography sx={{ fontSize: 12, color: '#7ab8ff' }}>{s.role}</Typography>
                  </Box>
                  <Chip label={s.status} size="small" color={s.status === 'active' ? 'success' : 'warning'} />
                </Box>
                <Typography sx={{ fontSize: 12, color: '#3d5068', mb: 0.5 }}>📧 {s.email}</Typography>
                <Typography sx={{ fontSize: 12, color: '#3d5068' }}>📞 {s.phone || 'N/A'}</Typography>
              </CardContent>

              <CardActions sx={{ px: 2, pb: 2, gap: 1 }}>
                <Button
                  size="small" variant="outlined"
                  startIcon={<Edit sx={{ fontSize: 14 }} />}
                  onClick={() => openEdit(s)}
                  sx={{ fontSize: 12 }}
                >
                  Edit
                </Button>
                <IconButton
                  size="small"
                  sx={{ color: s.status === 'active' ? '#f0a742' : '#3dd68c' }}
                  onClick={() => dispatch(updateStaff({
                    id:   s.id,
                    data: { status: s.status === 'active' ? 'off-duty' : 'active' },
                  }))}
                >
                  {s.status === 'active' ? <Pause fontSize="small" /> : <PlayArrow fontSize="small" />}
                </IconButton>
                <IconButton
                  size="small" sx={{ color: '#f06474', ml: 'auto' }}
                  onClick={() => dispatch(deleteStaff(s.id))}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}

        {filtered.length === 0 && (
          <Grid item xs={12}>
            <Box sx={{ textAlign: 'center', py: 8, color: '#3d5068' }}>
              <Typography sx={{ fontSize: 44, opacity: 0.5, mb: 1.5 }}>👥</Typography>
              <Typography>No staff found</Typography>
            </Box>
          </Grid>
        )}
      </Grid>

      {/* ── Add / Edit Dialog ── */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">{editing ? '✏️ Edit Staff' : '👤 Add Staff'}</Typography>
          <IconButton onClick={() => setOpen(false)} size="small" sx={{ color: '#3d5068' }}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <TextField
            fullWidth label="Full Name *"
            value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
            sx={{ mt: 1, mb: 2 }} size="small"
          />
          <TextField
            fullWidth label="Email *" type="email"
            value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
            sx={{ mb: 2 }} size="small"
          />
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Role *</InputLabel>
              <Select
                value={form.role}
                onChange={e => setForm({ ...form, role: e.target.value })}
                label="Role *"
              >
                {ROLES.map(r => (
                  <MenuItem key={r} value={r}>{ROLE_ICONS[r]} {r}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth label="Phone"
              value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
              size="small"
            />
          </Box>
          <FormControl fullWidth size="small">
            <InputLabel>Status</InputLabel>
            <Select
              value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value })}
              label="Status"
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="off-duty">Off Duty</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button variant="outlined" onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : editing ? '✅ Update' : '✅ Add Staff'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
