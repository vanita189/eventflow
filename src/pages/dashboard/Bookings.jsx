import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBookings, createBooking, updateBookingStatus } from '../../store/slices/bookingsSlice'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../components/Toast'
import {
  Box, Paper, Button, Typography, TextField,
  Select, MenuItem, InputLabel, FormControl,
  Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, Chip, CircularProgress, InputAdornment,
  Grid, Table, TableHead, TableRow, TableCell,
  TableBody, TableContainer, Tabs, Tab,
} from '@mui/material'
import { Add, Search, Close, CheckCircle, Cancel } from '@mui/icons-material'

const EMPTY_FORM = {
  customer_name: '', customer_email: '', tickets: 1,
  total_amount: '', status: 'confirmed', event_id: '',
}

const STATUS_COLOR = { confirmed: 'success', pending: 'warning', cancelled: 'error' }

export function Bookings() {
  const dispatch = useDispatch()
  const { tenant } = useAuth()
  const toast = useToast()

  const { items: bookings, loading } = useSelector(s => s.bookings)
  const { items: events }            = useSelector(s => s.events)

  const [search,  setSearch]  = useState('')
  const [filter,  setFilter]  = useState('all')
  const [open,    setOpen]    = useState(false)
  const [form,    setForm]    = useState(EMPTY_FORM)
  const [saving,  setSaving]  = useState(false)

  useEffect(() => {
    if (tenant?.id) dispatch(fetchBookings(tenant.id))
  }, [tenant?.id])

  // ── Save booking ───────────────────────────────────────────
  async function handleSave() {
    if (!form.customer_name || !form.customer_email || !form.total_amount) {
      toast('Fill required fields', 'error')
      return
    }
    setSaving(true)
    try {
      await dispatch(createBooking({ ...form, tenant_id: tenant.id })).unwrap()
      toast('Booking added!', 'success')
      setOpen(false)
      setForm(EMPTY_FORM)
    } catch {
      toast('Failed', 'error')
    }
    setSaving(false)
  }

  // ── Filter bookings ────────────────────────────────────────
  const filtered = bookings.filter(b => {
    const matchSearch = (
      b.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      b.customer_email?.toLowerCase().includes(search.toLowerCase())
    )
    const matchFilter = filter === 'all' || b.status === filter
    return matchSearch && matchFilter
  })

  const totalRevenue = bookings
    .filter(b => b.status === 'confirmed')
    .reduce((s, b) => s + Number(b.total_amount || 0), 0)

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}><CircularProgress /></Box>
  }

  return (
    <Box>
      {/* ── Page header ── */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ mb: 0.5 }}>🎟️ Tickets & Bookings</Typography>
          <Typography sx={{ color: '#3d5068', fontSize: 13 }}>
            {bookings.length} bookings · ₹{totalRevenue.toLocaleString()} revenue
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>
          Add Booking
        </Button>
      </Box>

      {/* ── KPI cards ── */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {[
          { icon: '🎟️', label: 'Total Bookings', val: bookings.length },
          { icon: '✅', label: 'Confirmed',       val: bookings.filter(b => b.status === 'confirmed').length },
          { icon: '💰', label: 'Revenue',         val: `₹${totalRevenue.toLocaleString()}` },
        ].map((s, i) => (
          <Grid item xs={12} md={4} key={i}>
            <Paper sx={{ p: 2.5 }}>
              <Typography sx={{ fontSize: 24, mb: 1 }}>{s.icon}</Typography>
              <Typography sx={{ fontSize: 24, fontWeight: 700, fontFamily: '"Playfair Display"' }}>{s.val}</Typography>
              <Typography sx={{ fontSize: 11, color: '#3d5068', textTransform: 'uppercase', letterSpacing: 0.8, mt: 0.5 }}>
                {s.label}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* ── Table ── */}
      <Paper sx={{ p: 3 }}>
        {/* Search + filter */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <TextField
            size="small" placeholder="Search customer..." value={search}
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
            {['all', 'confirmed', 'pending', 'cancelled'].map(f => (
              <Tab key={f} value={f} label={f.charAt(0).toUpperCase() + f.slice(1)} />
            ))}
          </Tabs>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {['Customer', 'Event', 'Tickets', 'Amount', 'Date', 'Status', 'Actions'].map(h => (
                  <TableCell key={h}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map(b => (
                <TableRow key={b.id}>
                  <TableCell>
                    <Typography sx={{ fontWeight: 600, fontSize: 13 }}>{b.customer_name}</Typography>
                    <Typography sx={{ fontSize: 12, color: '#3d5068' }}>{b.customer_email}</Typography>
                  </TableCell>
                  <TableCell sx={{ color: '#3d5068', fontSize: 13 }}>
                    {b.events?.title || '—'}
                  </TableCell>
                  <TableCell>{b.tickets}</TableCell>
                  <TableCell sx={{ color: '#7ab8ff', fontWeight: 700 }}>
                    ₹{Number(b.total_amount).toFixed(0)}
                  </TableCell>
                  <TableCell sx={{ color: '#3d5068', fontSize: 12 }}>
                    {new Date(b.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Chip label={b.status} size="small" color={STATUS_COLOR[b.status] || 'default'} />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      {b.status !== 'confirmed' && (
                        <IconButton
                          size="small" sx={{ color: '#3dd68c' }}
                          onClick={() => dispatch(updateBookingStatus({ id: b.id, status: 'confirmed' }))}
                        >
                          <CheckCircle fontSize="small" />
                        </IconButton>
                      )}
                      {b.status !== 'cancelled' && (
                        <IconButton
                          size="small" sx={{ color: '#f06474' }}
                          onClick={() => dispatch(updateBookingStatus({ id: b.id, status: 'cancelled' }))}
                        >
                          <Cancel fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* ── Add Booking Dialog ── */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">🎟️ Add Booking</Typography>
          <IconButton onClick={() => setOpen(false)} size="small" sx={{ color: '#3d5068' }}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <TextField
            fullWidth label="Customer Name *"
            value={form.customer_name}
            onChange={e => setForm({ ...form, customer_name: e.target.value })}
            sx={{ mt: 1, mb: 2 }} size="small"
          />
          <TextField
            fullWidth label="Customer Email *" type="email"
            value={form.customer_email}
            onChange={e => setForm({ ...form, customer_email: e.target.value })}
            sx={{ mb: 2 }} size="small"
          />
          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel>Event</InputLabel>
            <Select
              value={form.event_id}
              onChange={e => setForm({ ...form, event_id: e.target.value })}
              label="Event"
            >
              <MenuItem value="">Select event</MenuItem>
              {events.map(ev => (
                <MenuItem key={ev.id} value={ev.id}>{ev.title}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
            <TextField
              fullWidth label="Tickets *" type="number"
              value={form.tickets}
              onChange={e => setForm({ ...form, tickets: e.target.value })}
              size="small"
            />
            <TextField
              fullWidth label="Total Amount (₹) *" type="number"
              value={form.total_amount}
              onChange={e => setForm({ ...form, total_amount: e.target.value })}
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
              <MenuItem value="confirmed">Confirmed</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button variant="outlined" onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : '✅ Add Booking'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
