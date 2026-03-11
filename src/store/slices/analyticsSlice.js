import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axiosInstance from '../../api/axiosInstance'
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns'

export const fetchAnalytics = createAsyncThunk('analytics/fetch', async (tenantId) => {
  const [evRes, bkRes] = await Promise.all([
    axiosInstance.get(`/events?tenant_id=eq.${tenantId}&select=*,event_packages(*)`),
    axiosInstance.get(`/bookings?tenant_id=eq.${tenantId}&select=*,events(title,date,capacity)`),
  ])
  const events = evRes.data || []
  const bookings = bkRes.data || []

  // Monthly revenue for last 6 months
  const monthly = []
  for (let i = 5; i >= 0; i--) {
    const d = subMonths(new Date(), i)
    const label = format(d, 'MMM')
    const start = startOfMonth(d).toISOString()
    const end = endOfMonth(d).toISOString()
    const monthBookings = bookings.filter(b =>
      b.created_at >= start && b.created_at <= end && b.status === 'confirmed'
    )
    monthly.push({
      month: label,
      revenue: monthBookings.reduce((s, b) => s + Number(b.total_amount || 0), 0),
      bookings: monthBookings.length,
      events: events.filter(e => e.date >= start.slice(0, 10) && e.date <= end.slice(0, 10)).length,
    })
  }

  // Top events by revenue
  const eventRevenue = events.map(ev => {
    const evBookings = bookings.filter(b => b.event_id === ev.id && b.status === 'confirmed')
    const revenue = evBookings.reduce((s, b) => s + Number(b.total_amount || 0), 0)
    const sold = evBookings.reduce((s, b) => s + Number(b.tickets || 0), 0)
    return {
      name: ev.title,
      revenue,
      bookings: evBookings.length,
      sold,
      capacity: ev.capacity,
      fillRate: ev.capacity ? Math.round((sold / ev.capacity) * 100) : 0,
    }
  }).sort((a, b) => b.revenue - a.revenue).slice(0, 5)

  // Event type breakdown
  const typeCounts = {}
  events.forEach(ev => {
    typeCounts[ev.title] = (typeCounts[ev.title] || 0) + 1
  })

  // KPIs
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed')
  const totalRevenue = confirmedBookings.reduce((s, b) => s + Number(b.total_amount || 0), 0)

  return { monthly, topEvents: eventRevenue, totalRevenue, totalBookings: confirmedBookings.length, totalEvents: events.length }
})

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState: { data: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalytics.pending, (s) => { s.loading = true })
      .addCase(fetchAnalytics.fulfilled, (s, a) => { s.loading = false; s.data = a.payload })
      .addCase(fetchAnalytics.rejected, (s, a) => { s.loading = false; s.error = a.error.message })
  },
})

export default analyticsSlice.reducer
