import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axiosInstance from '../../api/axiosInstance'

// ── THUNKS ──────────────────────────────────────────────────
export const fetchEvents = createAsyncThunk('events/fetchAll', async (tenantId) => {
  const res = await axiosInstance.get(`/events?tenant_id=eq.${tenantId}&order=created_at.desc&select=*,event_packages(*)`)
  return res.data
})

export const createEvent = createAsyncThunk('events/create', async (eventData) => {
  const { packages, ...event } = eventData
  const res = await axiosInstance.post('/events', event)
  const newEvent = res.data[0]
  if (packages?.length) {
    const pkgs = packages.map(p => ({ ...p, event_id: newEvent.id }))
    await axiosInstance.post('/event_packages', pkgs)
  }
  const full = await axiosInstance.get(`/events?id=eq.${newEvent.id}&select=*,event_packages(*)`)
  return full.data[0]
})

export const updateEvent = createAsyncThunk('events/update', async ({ id, data }) => {
  const { packages, ...event } = data
  await axiosInstance.patch(`/events?id=eq.${id}`, event)
  if (packages) {
    await axiosInstance.delete(`/event_packages?event_id=eq.${id}`)
    if (packages.length) {
      const pkgs = packages.map(p => ({ ...p, event_id: id }))
      await axiosInstance.post('/event_packages', pkgs)
    }
  }
  const full = await axiosInstance.get(`/events?id=eq.${id}&select=*,event_packages(*)`)
  return full.data[0]
})

export const deleteEvent = createAsyncThunk('events/delete', async (id) => {
  await axiosInstance.delete(`/event_packages?event_id=eq.${id}`)
  await axiosInstance.delete(`/events?id=eq.${id}`)
  return id
})

// ── SLICE ────────────────────────────────────────────────────
const eventsSlice = createSlice({
  name: 'events',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (s) => { s.loading = true; s.error = null })
      .addCase(fetchEvents.fulfilled, (s, a) => { s.loading = false; s.items = a.payload })
      .addCase(fetchEvents.rejected, (s, a) => { s.loading = false; s.error = a.error.message })
      .addCase(createEvent.fulfilled, (s, a) => { s.items.unshift(a.payload) })
      .addCase(updateEvent.fulfilled, (s, a) => {
        const i = s.items.findIndex(e => e.id === a.payload.id)
        if (i !== -1) s.items[i] = a.payload
      })
      .addCase(deleteEvent.fulfilled, (s, a) => {
        s.items = s.items.filter(e => e.id !== a.payload)
      })
  },
})

export default eventsSlice.reducer
