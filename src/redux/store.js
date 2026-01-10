import { configureStore } from "@reduxjs/toolkit";
import snackbarReducer from "./snackbar/snackbarSlice";
import eventsReducers from "./eventsslice/eventsSlice";

export const store = configureStore({
    reducer: {
        snackbar: snackbarReducer,
        events: eventsReducers,
    }
})