import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getEvents } from "../../api/CreateEventPost";

// Async thunk
export const fetchEvents = createAsyncThunk("events/fetchEvents", async (_, { getState, rejectWithValue }) => {
    // const { events } = getState().events;

    // // prevent fetching if events already exist
    // if (events.length > 0) {
    //     return events;
    // }

    try {
        const { page, limit, search } = getState().events;
        return await getEvents({ page, limit, search });
    } catch (error) {
        return rejectWithValue(error.message)
    }
})

const initialState = {
    events: [],
    loading: false,
    error: null,
    search: "",
    page: 0,
    limit: 10,
    total: 0
}

const eventsSlice = createSlice({
    name: "events",
    initialState,
    reducers: {
        setSearch(state, action) {
            state.search = action.payload;
            state.page = 0;
        },
        setPage(state, action) {
            state.page = action.payload;
        },
        setLimit(state, action) {
            state.limit = action.payload;
            state.page = 0;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchEvents.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchEvents.fulfilled, (state, action) => {
                console.log("EVENTS API RESPONSE 👉", action.payload);

                state.loading = false;
                state.events = action.payload.data;
                state.total = action.payload.total || action.payload.data.length;
            })
            .addCase(fetchEvents.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
})

export const { setSearch, setPage,setLimit } = eventsSlice.actions;
export default eventsSlice.reducer;