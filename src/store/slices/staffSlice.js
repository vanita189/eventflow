import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axiosInstance from '../../api/axiosInstance'

export const fetchStaff = createAsyncThunk('staff/fetchAll', async (tenantId) => {
  const res = await axiosInstance.get(`/staff?tenant_id=eq.${tenantId}&order=created_at.desc`)
  return res.data
})

export const createStaff = createAsyncThunk('staff/create', async (data) => {
  const res = await axiosInstance.post('/staff', data)
  return res.data[0]
})

export const updateStaff = createAsyncThunk('staff/update', async ({ id, data }) => {
  await axiosInstance.patch(`/staff?id=eq.${id}`, data)
  return { id, ...data }
})

export const deleteStaff = createAsyncThunk('staff/delete', async (id) => {
  await axiosInstance.delete(`/staff?id=eq.${id}`)
  return id
})

const staffSlice = createSlice({
  name: 'staff',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStaff.pending, (s) => { s.loading = true })
      .addCase(fetchStaff.fulfilled, (s, a) => { s.loading = false; s.items = a.payload })
      .addCase(fetchStaff.rejected, (s, a) => { s.loading = false; s.error = a.error.message })
      .addCase(createStaff.fulfilled, (s, a) => { s.items.unshift(a.payload) })
      .addCase(updateStaff.fulfilled, (s, a) => {
        const i = s.items.findIndex(e => e.id === a.payload.id)
        if (i !== -1) s.items[i] = { ...s.items[i], ...a.payload }
      })
      .addCase(deleteStaff.fulfilled, (s, a) => {
        s.items = s.items.filter(e => e.id !== a.payload)
      })
  },
})

export default staffSlice.reducer
