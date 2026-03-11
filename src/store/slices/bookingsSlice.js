import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axiosInstance from '../../api/axiosInstance'

export const fetchBookings = createAsyncThunk('bookings/fetchAll', async (tenantId) => {
  const res = await axiosInstance.get(`/bookings?tenant_id=eq.${tenantId}&order=created_at.desc&select=*,events(title,date)`)
  return res.data
})

export const createBooking = createAsyncThunk('bookings/create', async (data) => {
  const res = await axiosInstance.post('/bookings', data)
  return res.data[0]
})

export const updateBookingStatus = createAsyncThunk('bookings/updateStatus', async ({ id, status }) => {
  await axiosInstance.patch(`/bookings?id=eq.${id}`, { status })
  return { id, status }
})

export const deleteBooking = createAsyncThunk('bookings/delete', async (id) => {
  await axiosInstance.delete(`/bookings?id=eq.${id}`)
  return id
})

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.pending, (s) => { s.loading = true })
      .addCase(fetchBookings.fulfilled, (s, a) => { s.loading = false; s.items = a.payload })
      .addCase(fetchBookings.rejected, (s, a) => { s.loading = false; s.error = a.error.message })
      .addCase(createBooking.fulfilled, (s, a) => { s.items.unshift(a.payload) })
      .addCase(updateBookingStatus.fulfilled, (s, a) => {
        const b = s.items.find(b => b.id === a.payload.id)
        if (b) b.status = a.payload.status
      })
      .addCase(deleteBooking.fulfilled, (s, a) => {
        s.items = s.items.filter(b => b.id !== a.payload)
      })
  },
})

export default bookingsSlice.reducer
