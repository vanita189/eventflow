import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box"
import eventsflow from "../assets/eventsflow.png";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { useAuth } from "../context/AuthContext";

function Topbar({ setMobileOpen, isMobile }) {
    const [anchorEl, setAnchorEl] = useState(null)
    const { profile, user } = useAuth(); // ✅ get profile & user

    return (
        <AppBar position="fixed" sx={{
            backgroundColor: "#fff",
            color: "#000",
            boxShadow: "0px 2px 4px rgba(230, 222, 222, 0.8)"

        }}>
            <Toolbar>
                {isMobile && (
                    <IconButton onClick={() => setMobileOpen(true)}>
                        <MenuIcon />
                    </IconButton>
                )}


                {/*center space*/}
                <Box sx={{ flexGrow: 1 }} />

                <Typography sx={{ mr: 2 }} display={{ xs: "none", sm: "flex" }}>Create Event</Typography>

                {/*Profile */}
                <IconButton
                    display="flex"
                    sx={{
                        "&:focus": {
                            outline: "none",
                            backgroundColor: "transparent"
                        },
                    }}
                    onClick={(e) => setAnchorEl(e.currentTarget)}>
                    <Avatar />
                </IconButton>
                <Box sx={{ mr: 1, textAlign: "right" }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {profile?.name || user?.email}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "gray" }}>
                        {profile?.role || "user"}
                    </Typography>
                </Box>

                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right"
                    }}

                >
                    <MenuItem>Profile</MenuItem>
                    <MenuItem>Logout</MenuItem>
                </Menu>
            </Toolbar>

        </AppBar>
    )
}

export default Topbar;