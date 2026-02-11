import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { showSnackbar } from "../redux/snackbar/snackbarSlice";
import { useDispatch } from "react-redux";

function ForgotPassword() {
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email) return
    dispatch(
      showSnackbar({
        message: "Please enter your email",
        severity: "warning",
      })
    )

    try {
      setLoading(true);
      await forgotPassword(email);
      dispatch(
        showSnackbar({
          message: "Password reset link sent to your email ",
          severity: "success",
        })
      );
      navigate("/");
    } catch (error) {
      dispatch(
        showSnackbar({
          message: error.message || "Failed to send password reset link",
          severity: "error",
        })
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Box width="350px">
        <Typography variant="h5" fontWeight={700} mb={2}>
          Forgot Password
        </Typography>

        <TextField
          fullWidth
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2 }}
          onClick={handleReset}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </Button>
      </Box>
    </Box>
  );
}

export default ForgotPassword;
