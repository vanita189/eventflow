import { configureStore } from "@reduxjs/toolkit";
import snackbarReducer from "./snackbar/snackbarSlice";

export const store = configureStore({
    reducer: {
        snackbar: snackbarReducer,
    }
})