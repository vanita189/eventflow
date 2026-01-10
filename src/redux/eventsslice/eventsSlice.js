import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getEvents } from "../../api/CreateEventPost";

// Async thunk
export const fetchEvents = createAsyncThunk("events/fetchEvents", async (_, { getState, rejectWithValue }) => {
    const { events } = getState().events;

    // prevent fetching if events already exist
    if (events.length > 0) {
        return events;
    }

    try {
        const data = await getEvents();
        return data;
    } catch (error) {
        return rejectWithValue(error.message)
    }
})

const initialState = {
    events : [],
    loading: false,
    error:null
}

const eventsSlice =  createSlice({
    name: "events",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder 
        .addCase(fetchEvents.pending, (state) =>{
            state.loading = true;
        })
        .addCase(fetchEvents.fulfilled, (state,action) =>{
            state.loading = false;
            state.events = action.payload;
        })
        .addCase(fetchEvents.rejected, (state,action)=>{
            state.loading = false;
            state.error = action.payload;
        })
    }
})

export default eventsSlice.reducer;