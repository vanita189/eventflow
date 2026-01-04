import { Snackbar, Alert } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { hideSnackbar } from "../redux/snackbar/snackbarSlice";


function GlobalSnackbar() {

    const dispatch = useDispatch();
    const { open, message, severity } = useSelector(
        (state) => state.snackbar
    )
    return (
        <Snackbar
            open={open}
            autoHideDuration={3000}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            onClose={() => dispatch(hideSnackbar())}
        >
            <Alert
                severity={severity}
                onClose={() => dispatch(hideSnackbar())}
                sx={{ width: "100%" }}
            >
                {message}
            </Alert>
        </Snackbar>
    )
}

export default GlobalSnackbar;