import { configureStore } from '@reduxjs/toolkit'
import eventsReducer from './slices/eventsSlice'
import bookingsReducer from './slices/bookingsSlice'
import staffReducer from './slices/staffSlice'
import analyticsReducer from './slices/analyticsSlice'

export const store = configureStore({
  reducer: {
    events: eventsReducer,
    bookings: bookingsReducer,
    staff: staffReducer,
    analytics: analyticsReducer,
  },
})
