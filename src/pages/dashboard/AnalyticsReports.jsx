import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAnalytics } from '../../store/slices/analyticsSlice'
import { useAuth } from '../../context/AuthContext'
import {
  Box, Paper, Typography, Grid, CircularProgress,
  LinearProgress, Tabs, Tab, Button, Avatar,
  Table, TableHead, TableRow, TableCell,
  TableBody, TableContainer, Chip,
} from '@mui/material'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell,
} from 'recharts'
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns'

// ── Custom chart tooltip ──────────────────────────────────────
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <Box sx={{ bgcolor: '#111720', border: '1px solid #1e2a3a', borderRadius: 2, p: 1.5 }}>
      <Typography sx={{ color: '#7ab8ff', mb: 0.5, fontSize: 12 }}>{label}</Typography>
      {payload.map((p, i) => (
        <Typography key={i} sx={{ color: p.color, fontSize: 12 }}>
          {p.name}: {p.name === 'revenue' ? `₹${p.value}` : p.value}
        </Typography>
      ))}
    </Box>
  )
}

const PIE_COLORS = ['#4f9cf9', '#7ab8ff', '#2a5fa8', '#3dd68c', '#f0a742']

// ── Analytics page ────────────────────────────────────────────
export function Analytics() {
  const dispatch = useDispatch()
  const { tenant } = useAuth()
  const { data, loading } = useSelector(s => s.analytics)

  useEffect(() => {
    if (tenant?.id) dispatch(fetchAnalytics(tenant.id))
  }, [tenant?.id])

  if (loading || !data) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}><CircularProgress /></Box>
  }

  const pieData = data.topEvents.map((e, i) => ({
    name:  e.name,
    value: e.revenue,
    color: PIE_COLORS[i % PIE_COLORS.length],
  }))

  const STATS = [
    { icon: '💰', label: 'Total Revenue',  value: `₹${data.totalRevenue.toLocaleString()}` },
    { icon: '🎟️', label: 'Total Bookings', value: data.totalBookings },
    { icon: '🎉', label: 'Total Events',   value: data.totalEvents },
    { icon: '📈', label: 'Avg/Booking',    value: data.totalBookings ? `₹${Math.round(data.totalRevenue / data.totalBookings)}` : '₹0' },
  ]

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 0.5 }}>📊 Revenue & Analytics</Typography>
      <Typography sx={{ color: '#3d5068', fontSize: 13, mb: 3 }}>
        Real-time performance from your Supabase data
      </Typography>

      {/* ── KPI cards ── */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {STATS.map((s, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Paper sx={{ p: 2.5 }}>
              <Typography sx={{ fontSize: 24, mb: 1 }}>{s.icon}</Typography>
              <Typography sx={{ fontSize: 24, fontWeight: 700, fontFamily: '"Playfair Display"' }}>
                {s.value}
              </Typography>
              <Typography sx={{ fontSize: 11, color: '#3d5068', textTransform: 'uppercase', letterSpacing: 0.8, mt: 0.5 }}>
                {s.label}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* ── Revenue + bookings charts ── */}
      <Grid container spacing={2.5} sx={{ mb: 2.5 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography sx={{ fontWeight: 600, mb: 2 }}>💰 Monthly Revenue</Typography>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={data.monthly}>
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
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={data.monthly}>
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

      {/* ── Top events + pie ── */}
      <Grid container spacing={2.5}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography sx={{ fontWeight: 600, mb: 2 }}>🏆 Top Events by Revenue</Typography>
            {data.topEvents.length === 0 ? (
              <Typography sx={{ color: '#3d5068', textAlign: 'center', py: 4 }}>No data yet</Typography>
            ) : data.topEvents.map((e, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Avatar
                  sx={{ width: 28, height: 28, bgcolor: i === 0 ? '#4f9cf9' : '#1e2a3a', fontSize: 12, fontWeight: 700 }}
                >
                  {i + 1}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 0.5 }}>{e.name}</Typography>
                  <LinearProgress
                    variant="determinate"
                    value={data.topEvents[0].revenue ? (e.revenue / data.topEvents[0].revenue) * 100 : 0}
                  />
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography sx={{ color: '#7ab8ff', fontWeight: 700, fontSize: 13 }}>
                    ₹{e.revenue.toLocaleString()}
                  </Typography>
                  <Typography sx={{ fontSize: 11, color: '#3d5068' }}>{e.bookings} bookings</Typography>
                </Box>
              </Box>
            ))}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography sx={{ fontWeight: 600, mb: 2 }}>🥧 Revenue Distribution</Typography>
            {pieData.length === 0 ? (
              <Typography sx={{ color: '#3d5068', textAlign: 'center', py: 4 }}>No data yet</Typography>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={pieData} cx="50%" cy="50%" outerRadius={90} dataKey="value"
                    label={({ name, percent }) => `${name.slice(0, 8)} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false} fontSize={10}
                  >
                    {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip
                    formatter={v => [`₹${v}`, 'Revenue']}
                    contentStyle={{ background: '#111720', border: '1px solid #1e2a3a', borderRadius: 8, fontSize: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

// ── Reports page ──────────────────────────────────────────────
export function Reports() {
  const { tenant } = useAuth()
  const { data }   = useSelector(s => s.analytics)
  const { items: bookings } = useSelector(s => s.bookings)
  const { items: events }   = useSelector(s => s.events)
  const [tab, setTab] = useState(0)

  // Monthly report (last 6 months)
  const monthlyReport = Array.from({ length: 6 }, (_, i) => {
    const d     = subMonths(new Date(), 5 - i)
    const start = startOfMonth(d).toISOString()
    const end   = endOfMonth(d).toISOString()
    const mb    = bookings.filter(b => b.created_at >= start && b.created_at <= end && b.status === 'confirmed')
    const me    = events.filter(e => e.date >= start.slice(0, 10) && e.date <= end.slice(0, 10))
    const revenue = mb.reduce((s, b) => s + Number(b.total_amount || 0), 0)
    return {
      month:    format(d, 'MMMM yyyy'),
      events:   me.length,
      bookings: mb.length,
      revenue,
      avg:      mb.length ? Math.round(revenue / mb.length) : 0,
    }
  })

  // Event report
  const eventReport = events.map(ev => {
    const evb     = bookings.filter(b => b.event_id === ev.id && b.status === 'confirmed')
    const revenue = evb.reduce((s, b) => s + Number(b.total_amount || 0), 0)
    const sold    = evb.reduce((s, b) => s + Number(b.tickets || 0), 0)
    return {
      ...ev,
      revenue,
      sold,
      fill: ev.capacity ? Math.round((sold / ev.capacity) * 100) : 0,
    }
  })

  const STATUS_COLOR = { upcoming: 'primary', completed: 'success', cancelled: 'error' }

  return (
    <Box>
      {/* ── Page header ── */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ mb: 0.5 }}>📋 Reports</Typography>
          <Typography sx={{ color: '#3d5068', fontSize: 13 }}>
            Real data from your Supabase database
          </Typography>
        </Box>
        <Button variant="outlined" onClick={() => window.print()}>🖨️ Print</Button>
      </Box>

      {/* ── Summary KPIs ── */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {[
          { icon: '💰', label: '6-Month Revenue',  val: `₹${monthlyReport.reduce((s, m) => s + m.revenue, 0).toLocaleString()}` },
          { icon: '🎟️', label: '6-Month Bookings', val: monthlyReport.reduce((s, m) => s + m.bookings, 0) },
          { icon: '🎉', label: '6-Month Events',   val: monthlyReport.reduce((s, m) => s + m.events, 0) },
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

      {/* ── Tabbed tables ── */}
      <Paper sx={{ p: 3 }}>
        <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 3, borderBottom: '1px solid #1e2a3a' }}>
          <Tab label="📅 Month-wise" sx={{ textTransform: 'none', fontWeight: 600 }} />
          <Tab label="🎉 Event-wise" sx={{ textTransform: 'none', fontWeight: 600 }} />
        </Tabs>

        {tab === 0 && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {['Month', 'Events', 'Bookings', 'Revenue', 'Avg/Booking'].map(h => (
                    <TableCell key={h}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {monthlyReport.map((m, i) => (
                  <TableRow key={i}>
                    <TableCell sx={{ fontWeight: 600 }}>{m.month}</TableCell>
                    <TableCell>{m.events}</TableCell>
                    <TableCell>{m.bookings}</TableCell>
                    <TableCell sx={{ color: '#7ab8ff', fontWeight: 700 }}>₹{m.revenue.toLocaleString()}</TableCell>
                    <TableCell>₹{m.avg}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {tab === 1 && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {['Event', 'Date', 'Capacity', 'Sold', 'Fill Rate', 'Revenue', 'Status'].map(h => (
                    <TableCell key={h}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {eventReport.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} sx={{ textAlign: 'center', py: 6, color: '#3d5068' }}>
                      No events yet
                    </TableCell>
                  </TableRow>
                ) : eventReport.map((e, i) => (
                  <TableRow key={i}>
                    <TableCell sx={{ fontWeight: 600 }}>{e.title}</TableCell>
                    <TableCell sx={{ color: '#3d5068' }}>{e.date}</TableCell>
                    <TableCell>{e.capacity}</TableCell>
                    <TableCell>{e.sold}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LinearProgress variant="determinate" value={e.fill} sx={{ width: 80 }} />
                        <Typography sx={{ fontSize: 12 }}>{e.fill}%</Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: '#7ab8ff', fontWeight: 700 }}>₹{e.revenue.toLocaleString()}</TableCell>
                    <TableCell>
                      <Chip label={e.status} size="small" color={STATUS_COLOR[e.status] || 'default'} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  )
}
