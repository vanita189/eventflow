import { configureStore } from "@reduxjs/toolkit";
import eventsReducer from './events.slice';

export const store = configureStore({
    reducer: {
        events: eventsReducer,

    },
});