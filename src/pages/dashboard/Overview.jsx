import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAnalytics } from '../../store/slices/analyticsSlice'
import { fetchEvents } from '../../store/slices/eventsSlice'
import { fetchBookings } from '../../store/slices/bookingsSlice'
import { useAuth } from '../../context/AuthContext'
import {
  Box, Grid, Paper, Typography, Chip,
  Alert, Button, CircularProgress,
} from '@mui/material'
import { TrendingUp } from '@mui/icons-material'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line,
} from 'recharts'
import { format } from 'date-fns'

// ── Custom chart tooltip ──────────────────────────────────────
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <Box sx={{ bgcolor: '#111720', border: '1px solid #1e2a3a', borderRadius: 2, p: 1.5, fontSize: 12 }}>
      <Typography sx={{ color: '#7ab8ff', mb: 0.5, fontSize: 12 }}>{label}</Typography>
      {payload.map((p, i) => (
        <Typography key={i} sx={{ color: p.color, fontSize: 12 }}>
          {p.name}: {p.name === 'revenue' ? `₹${p.value}` : p.value}
        </Typography>
      ))}
    </Box>
  )
}

export default function Overview() {
  const dispatch = useDispatch()
  const { tenant, trialDaysLeft, isTrialActive } = useAuth()
  const { data: analytics, loading } = useSelector(s => s.analytics)
  const { items: events }            = useSelector(s => s.events)
  const { items: bookings }          = useSelector(s => s.bookings)

  useEffect(() => {
    if (tenant?.id) {
      dispatch(fetchAnalytics(tenant.id))
      dispatch(fetchEvents(tenant.id))
      dispatch(fetchBookings(tenant.id))
    }
  }, [tenant?.id])

  if (loading || !analytics) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress />
      </Box>
    )
  }

  const upcomingEvents  = events.filter(e => e.status === 'upcoming').slice(0, 4)
  const recentBookings  = bookings.slice(0, 5)
  const daysLeft        = trialDaysLeft()

  const STATS = [
    { icon: '🎉', label: 'Total Events',   value: analytics.totalEvents,                                                                change: 'All time' },
    { icon: '🎟️', label: 'Total Bookings', value: analytics.totalBookings,                                                             change: 'Confirmed' },
    { icon: '💰', label: 'Total Revenue',  value: `₹${analytics.totalRevenue.toLocaleString()}`,                                      change: 'All time' },
    { icon: '📈', label: 'Avg/Booking',    value: analytics.totalBookings ? `₹${Math.round(analytics.totalRevenue / analytics.totalBookings)}` : '₹0', change: 'Per booking' },
  ]

  return (
    <Box>
      {/* Trial banner */}
      {isTrialActive() && (
        <Alert
          severity="success"
          sx={{ mb: 3 }}
          action={<Button color="inherit" size="small">Upgrade Now</Button>}
        >
          🎁 Free Trial Active — <strong>{daysLeft} days remaining</strong>
        </Alert>
      )}

      {/* Greeting */}
      <Typography variant="h5" sx={{ mb: 0.5 }}>
        Good Evening, {tenant?.name} 🍺
      </Typography>
      <Typography sx={{ color: '#3d5068', fontSize: 13, mb: 3 }}>
        {format(new Date(), 'EEEE, d MMMM yyyy')}
      </Typography>

      {/* ── KPI Stats ── */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {STATS.map((s, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Paper sx={{ p: 2.5 }}>
              <Typography sx={{ fontSize: 24, mb: 1.5 }}>{s.icon}</Typography>
              <Typography sx={{ fontSize: 26, fontWeight: 700, fontFamily: '"Playfair Display"', color: '#e2eaf4' }}>
                {s.value}
              </Typography>
              <Typography sx={{ fontSize: 11, color: '#3d5068', textTransform: 'uppercase', letterSpacing: 0.8, mt: 0.5, mb: 1 }}>
                {s.label}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <TrendingUp sx={{ fontSize: 12, color: '#3dd68c' }} />
                <Typography sx={{ fontSize: 11, color: '#3dd68c' }}>{s.change}</Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* ── Charts ── */}
      <Grid container spacing={2.5} sx={{ mb: 2.5 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography sx={{ fontWeight: 600, mb: 2 }}>💰 Monthly Revenue</Typography>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={analytics.monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2a3a" />
                <XAxis dataKey="month" tick={{ fill: '#3d5068', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#3d5068', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v}`} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="revenue" name="revenue" fill="#4f9cf9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography sx={{ fontWeight: 600, mb: 2 }}>🎟️ Bookings Trend</Typography>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={analytics.monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2a3a" />
                <XAxis dataKey="month" tick={{ fill: '#3d5068', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#3d5068', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Line type="monotone" dataKey="bookings" name="bookings" stroke="#7ab8ff" strokeWidth={2.5} dot={{ fill: '#7ab8ff', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* ── Recent bookings + upcoming events ── */}
      <Grid container spacing={2.5}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography sx={{ fontWeight: 600, mb: 2 }}>🧾 Recent Bookings</Typography>
            {recentBookings.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6, color: '#3d5068' }}>
                <Typography sx={{ fontSize: 40, mb: 1.5, opacity: 0.5 }}>🎟️</Typography>
                <Typography sx={{ fontSize: 13.5 }}>No bookings yet</Typography>
              </Box>
            ) : recentBookings.map(b => (
              <Box
                key={b.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  py: 1.5,
                  borderBottom: '1px solid #1e2a3a',
                  flexWrap: 'wrap',
                  gap: 1,
                  '&:last-child': { borderBottom: 0 },
                }}
              >
                <Box>
                  <Typography sx={{ fontWeight: 600, fontSize: 13 }}>{b.customer_name}</Typography>
                  <Typography sx={{ fontSize: 12, color: '#3d5068' }}>{b.customer_email}</Typography>
                </Box>
                <Typography sx={{ fontSize: 13 }}>{b.tickets} ticket{b.tickets > 1 ? 's' : ''}</Typography>
                <Typography sx={{ color: '#7ab8ff', fontWeight: 700, fontSize: 13 }}>
                  ₹{Number(b.total_amount).toFixed(0)}
                </Typography>
                <Chip label={b.status} size="small" color={b.status === 'confirmed' ? 'success' : 'warning'} />
              </Box>
            ))}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography sx={{ fontWeight: 600, mb: 2 }}>📅 Upcoming Events</Typography>
            {upcomingEvents.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6, color: '#3d5068' }}>
                <Typography sx={{ fontSize: 40, opacity: 0.5, mb: 1 }}>🎉</Typography>
                <Typography sx={{ fontSize: 13 }}>No upcoming events</Typography>
              </Box>
            ) : upcomingEvents.map(e => (
              <Box
                key={e.id}
                sx={{ bgcolor: '#0d1117', border: '1px solid #1e2a3a', borderRadius: 2, p: 1.5, mb: 1.5 }}
              >
                <Typography sx={{ fontWeight: 600, fontSize: 13, mb: 0.5 }}>{e.title}</Typography>
                <Typography sx={{ fontSize: 12, color: '#3d5068' }}>
                  📅 {e.date} · ⏰ {e.time}
                </Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
