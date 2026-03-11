import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchEvents, createEvent, updateEvent, deleteEvent } from '../../store/slices/eventsSlice'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../components/Toast'
import {
  Box, Paper, Button, Typography, TextField,
  Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, Chip, CircularProgress, InputAdornment,
  Tabs, Tab, Table, TableHead, TableRow, TableCell,
  TableBody, TableContainer, Avatar,
} from '@mui/material'
import { Add, Edit, Delete, Search, Close } from '@mui/icons-material'
import EventFormStep1 from '../../components/EventFormStep1'
import EventFormStep2 from '../../components/EventFormStep2'

const EMPTY_FORM = {
  title: '', description: '', date: '', time: '', capacity: '',
  status: 'upcoming', lat: 51.505, lng: -0.09,
  location_address: '', image_url: '', packages: [],
}

const STATUS_COLOR = { upcoming: 'primary', completed: 'success', cancelled: 'error' }

export default function Events() {
  const dispatch = useDispatch()
  const { tenant } = useAuth()
  const toast = useToast()

  const { items: events, loading } = useSelector(s => s.events)

  const [open,     setOpen]     = useState(false)
  const [editing,  setEditing]  = useState(null)
  const [formStep, setFormStep] = useState(0)
  const [form,     setForm]     = useState(EMPTY_FORM)
  const [saving,   setSaving]   = useState(false)
  const [search,   setSearch]   = useState('')
  const [filter,   setFilter]   = useState('all')

  useEffect(() => {
    if (tenant?.id) dispatch(fetchEvents(tenant.id))
  }, [tenant?.id])

  // ── Open create dialog ─────────────────────────────────────
  function openNew() {
    setEditing(null)
    setForm({ ...EMPTY_FORM })
    setFormStep(0)
    setOpen(true)
  }

  // ── Open edit dialog ───────────────────────────────────────
  function openEdit(ev) {
    setEditing(ev)
    setForm({ ...ev, packages: ev.event_packages || [] })
    setFormStep(0)
    setOpen(true)
  }

  // ── Save event ─────────────────────────────────────────────
  async function handleSave() {
    if (!form.title || !form.date || !form.time || !form.capacity) {
      toast('Fill required fields in Step 1', 'error')
      return
    }
    if (!form.packages?.length) {
      toast('Add at least one package in Step 2', 'error')
      return
    }

    setSaving(true)
    try {
      const payload = { ...form, tenant_id: tenant.id }
      if (editing) {
        await dispatch(updateEvent({ id: editing.id, data: payload })).unwrap()
        toast('Event updated!', 'success')
      } else {
        await dispatch(createEvent(payload)).unwrap()
        toast('Event created!', 'success')
      }
      setOpen(false)
    } catch (err) {
      toast(err.message || 'Failed', 'error')
    }
    setSaving(false)
  }

  // ── Delete event ───────────────────────────────────────────
  async function handleDelete(id) {
    if (!confirm('Delete this event?')) return
    await dispatch(deleteEvent(id)).unwrap()
    toast('Event deleted', 'info')
  }

  // ── Filter events ──────────────────────────────────────────
  const filtered = events.filter(e => {
    const matchSearch = e.title?.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || e.status === filter
    return matchSearch && matchFilter
  })

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}><CircularProgress /></Box>
  }

  return (
    <Box>
      {/* ── Page header ── */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ mb: 0.5 }}>🎉 Events Management</Typography>
          <Typography sx={{ color: '#3d5068', fontSize: 13 }}>
            {events.length} total · {events.filter(e => e.status === 'upcoming').length} upcoming
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={openNew}>
          Create Event
        </Button>
      </Box>

      {/* ── Table ── */}
      <Paper sx={{ p: 3 }}>
        {/* Search + filter */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            size="small" placeholder="Search events..." value={search}
            onChange={e => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ fontSize: 18, color: '#3d5068' }} />
                </InputAdornment>
              ),
            }}
            sx={{ width: 240 }}
          />
          <Tabs
            value={filter}
            onChange={(e, v) => setFilter(v)}
            sx={{ '& .MuiTab-root': { minHeight: 36, py: 0, fontSize: 12 } }}
          >
            {['all', 'upcoming', 'completed', 'cancelled'].map(f => (
              <Tab key={f} value={f} label={f.charAt(0).toUpperCase() + f.slice(1)} />
            ))}
          </Tabs>
        </Box>

        {/* Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {['Event', 'Date & Time', 'Location', 'Capacity', 'Packages', 'Status', 'Actions'].map(h => (
                  <TableCell key={h}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} sx={{ textAlign: 'center', py: 8, color: '#3d5068' }}>
                    <Typography sx={{ fontSize: 40, opacity: 0.5, mb: 1 }}>🎉</Typography>
                    <Typography>No events found</Typography>
                  </TableCell>
                </TableRow>
              ) : filtered.map(ev => (
                <TableRow key={ev.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar
                        src={ev.image_url}
                        variant="rounded"
                        sx={{ width: 40, height: 40, bgcolor: '#1e2a3a', fontSize: 18 }}
                      >
                        🎉
                      </Avatar>
                      <Box>
                        <Typography sx={{ fontWeight: 600, fontSize: 13 }}>{ev.title}</Typography>
                        <Typography sx={{ fontSize: 12, color: '#3d5068' }}>
                          {ev.description?.slice(0, 40)}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontSize: 13 }}>📅 {ev.date}</Typography>
                    <Typography sx={{ fontSize: 12, color: '#3d5068' }}>⏰ {ev.time}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      sx={{
                        fontSize: 12, color: '#3d5068',
                        maxWidth: 130, overflow: 'hidden',
                        textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}
                    >
                      📍 {ev.location_address || 'Not set'}
                    </Typography>
                  </TableCell>
                  <TableCell>{ev.capacity}</TableCell>
                  <TableCell>{ev.event_packages?.length || 0} packages</TableCell>
                  <TableCell>
                    <Chip label={ev.status} size="small" color={STATUS_COLOR[ev.status] || 'default'} />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton size="small" onClick={() => openEdit(ev)} sx={{ color: '#7ab8ff' }}>
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(ev.id)} sx={{ color: '#f06474' }}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* ── Create / Edit Dialog ── */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
          <Typography variant="h6">
            {editing ? '✏️ Edit Event' : '🎉 Create New Event'}
          </Typography>
          <IconButton onClick={() => setOpen(false)} size="small" sx={{ color: '#3d5068' }}>
            <Close />
          </IconButton>
        </DialogTitle>

        {/* Step tabs */}
        <Box sx={{ px: 3 }}>
          <Tabs
            value={formStep}
            onChange={(e, v) => setFormStep(v)}
            sx={{ borderBottom: '1px solid #1e2a3a', mb: 3 }}
          >
            <Tab label="📋 Basic Info" value={0} sx={{ fontSize: 13, textTransform: 'none', fontWeight: 600 }} />
            <Tab label="📦 Packages"  value={1} sx={{ fontSize: 13, textTransform: 'none', fontWeight: 600 }} />
          </Tabs>
        </Box>

        <DialogContent sx={{ pt: 0 }}>
          {formStep === 0 && <EventFormStep1 form={form} onChange={setForm} />}
          {formStep === 1 && (
            <EventFormStep2
              packages={form.packages}
              onChange={pkgs => setForm(f => ({ ...f, packages: pkgs }))}
            />
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          {formStep === 1 && (
            <Button variant="outlined" onClick={() => setFormStep(0)}>← Back</Button>
          )}
          {formStep === 0 && (
            <Button variant="outlined" onClick={() => setOpen(false)}>Cancel</Button>
          )}
          {formStep === 0 && (
            <Button variant="contained" onClick={() => setFormStep(1)}>Next: Packages →</Button>
          )}
          {formStep === 1 && (
            <Button variant="contained" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : editing ? '✅ Update Event' : '✅ Create Event'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  )
}
