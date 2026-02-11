import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";


function Login() {
    const { login, user, loading } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);



    useEffect(() => {
        if (!loading && user) {
            navigate("/dashboardlayout");
        }
    }, [user, loading, navigate])
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await login(email, password);
            // navigate("/dashboard");

        } catch (err) {
            alert(err.message)
        }
    }

    useEffect(() => {
        if (!loading && user) {
            navigate("/dashboardlayout");
        }
    }, [user, loading, navigate])

    return (
        <form onSubmit={handleSubmit}>

            <Grid container minHeight="100vh" width="100vw" >

                {/*Left Side */}
                <Grid item
                    sx={{
                        width: { md: "50%", sm: "50%", xs: "50%" },
                        backgroundColor: "#1976d2",
                        color: "#fff",
                        display: { xs: "none", sm: "flex" },
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",

                    }}>
                    <Box
                        sx={{
                            maxWidth: 420,
                            textAlign: "center",
                            px: { xs: 2, sm: 4 }
                        }}
                    >
                        <Typography variant="h2" fontWeight={700}>
                            WELCOME
                        </Typography>
                        <Typography mt={1} variant="h5" fontWeight={600}>
                            Login to continue to the system
                        </Typography>
                    </Box>
                </Grid>

                {/*Right Side*/}


                <Grid item width={{ md: "50%", sm: "50%", xs: "100%" }} xs={12} md={6} >
                    <Box width="100%" maxWidth={{ xs: "100%", sm: "70%" }} px={4} >
                        <Typography variant="h4" fontWeight="bold" color="#2288eeff" py={3} mt={10}>
                            Login to continue
                        </Typography>
                        <Box py={1}>
                            <Typography fontWeight={700} fontSize={15} py={1}>Email address</Typography>
                            <TextField
                                fullWidth
                                placeholder="Enter your email"
                                variant="outlined"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="username"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <EmailOutlinedIcon sx={{ color: "#9e9e9e" }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        "& fieldset": {
                                            borderColor: "#d0d0d0",
                                        },
                                        "&:hover fieldset": {
                                            borderColor: "#b0b0b0",
                                        },
                                        "&.Mui-focused fieldset": {
                                            borderColor: "#2288eeff",
                                            borderWidth: "2px",
                                        },

                                        /* 🔵 Default icon color */
                                        "& .MuiInputAdornment-root svg": {
                                            color: "#9e9e9e",
                                            transition: "color 0.2s ease",
                                        },

                                        /* 🔵 Icon turns blue when input is focused */
                                        "&.Mui-focused .MuiInputAdornment-root svg": {
                                            color: "#2288eeff",
                                        },
                                    },

                                    "& input::placeholder": {
                                        color: "#b0b0b0",
                                        opacity: 1,
                                        fontSize: "13px",
                                    },
                                }}

                            />                    </Box>
                        <Box py={1}>
                            <Typography fontWeight={700} fontSize={15} py={1}>Password</Typography>
                            <TextField
                                fullWidth
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                variant="outlined"
                                autoComplete="current-password"

                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockOutlinedIcon sx={{ color: "#9e9e9e" }} />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        "& fieldset": {
                                            borderColor: "#d0d0d0",
                                        },
                                        "&:hover fieldset": {
                                            borderColor: "#b0b0b0",
                                        },
                                        "&.Mui-focused fieldset": {
                                            borderColor: "#2288eeff",
                                            borderWidth: "2px",
                                        },

                                        /* 🔵 Default icon color */
                                        "& .MuiInputAdornment-root svg": {
                                            color: "#9e9e9e",
                                            transition: "color 0.2s ease",
                                        },

                                        /* 🔵 Icon turns blue when input is focused */
                                        "&.Mui-focused .MuiInputAdornment-root svg": {
                                            color: "#2288eeff",
                                        },
                                    },

                                    "& input::placeholder": {
                                        color: "#b0b0b0",
                                        opacity: 1,
                                        fontSize: "13px",
                                    },
                                }}


                            />
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                            <Typography fontWeight={750} fontSize={12}>Remember me</Typography>
                            <Typography
                                fontWeight={750}
                                fontSize={12}
                                sx={{cursor:"pointer" ,color:"#2288eeff"}}
                                onClick={()=> navigate("/forgot-password")}

                            >Forgot Password</Typography>
                        </Box>
                        <Button fullWidth variant="contained" mt={10} type="submit"
                            sx={{
                                backgroundColor: "#2288eeff",
                                fontWeight: 600,
                                py: 1.2,
                                mt: 3,
                                boxShadow: "none",
                                "&:hover": {
                                    backgroundColor: "#1b6fcc",
                                    boxShadow: "none"
                                },
                                "&:focus": {
                                    outline: "none",
                                    boxShadow: "none"
                                }
                            }}
                        >Login</Button>
                        <Typography fontSize={13} mt={2} textAlign="center">
                            Don’t have an account?{" "}
                            <Typography
                                component="span"
                                color="primary"
                                fontWeight={600}
                                sx={{ cursor: "pointer" }}
                                onClick={() => navigate("/signup")}
                            >
                                Signup
                            </Typography>
                        </Typography>

                    </Box>

                </Grid>
            </Grid >
        </form>

    )
}

export default Login;

