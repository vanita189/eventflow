import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import LogoutIcon from '@mui/icons-material/Logout';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import SummarizeIcon from '@mui/icons-material/Summarize';
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";
import eventsflow from "../assets/eventsflow.png";
import DashboardIcon from "@mui/icons-material/Dashboard";
import EventIcon from "@mui/icons-material/Event";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import ev from "../assets/ev.png";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { collapsedWidth, drawerWidth } from "../config-global";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/" },
    { text: "Events", icon: <EventIcon />, path: "events" },
    { text: "Tickets", icon: <ConfirmationNumberIcon />, path: "ticket" },
    { text :"Redemption" , icon :<ConfirmationNumberIcon/>,path:"redeem"},
    { text: "Users", icon: <PeopleIcon />, path: "user" },
    { text: "Report", icon: <SummarizeIcon />, path: "report" },
    { text: "Logout", icon: <LogoutIcon /> }
];

function Sidebar({ isMobile, setCollapsed, collapsed, mobileOpen, setMobileOpen }) {
    const { logout } = useAuth();
    const navigate =useNavigate();
    const isCollapsed = isMobile || collapsed;

    const handleMenuClick = async (item) => {
        if (item.text === "Logout") {
            await logout();
            navigate("/", { replace: true });
        } else {
            navigate(item.path);
        }
    };
    const handleItemClick = async (item) => {
        // 1️⃣ Close sidebar on mobile
        if (isMobile) {
            setMobileOpen(false);
        }

        // 2️⃣ Handle navigation / logout
        await handleMenuClick(item);
    };


    return (
        <Drawer
            variant={isMobile ? "temporary" : "permanent"}
            open={isMobile ? mobileOpen : true}
            onClose={() => setMobileOpen(false)}
            ModalProps={{ keepMounted: true }}
            sx={{
                width: isCollapsed ? collapsedWidth : drawerWidth,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                    width: isCollapsed ? collapsedWidth : drawerWidth,
                    boxSizing: "border-box",
                    borderRight: "none",
                    overflowX: "hidden",
                    boxShadow: "4px 0 12px rgba(0,0,0,0.08)",
                    transition: "width 0.3s ease",

                },
            }}
        >
            <Box
                sx={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                {isCollapsed ? (
                    <Box
                        component="img"
                        src={ev}
                        sx={{
                            height: 80,
                            width: "auto",
                            objectFit: "contain",
                        }}
                    />
                ) : (
                    <Box
                        sx={{
                            pt: 5,
                        }}
                    >
                        <Box
                            component="img"
                            src={eventsflow}
                            sx={{
                                height: 80,
                                objectFit: "contain",
                                transform: "scale(2.5)",
                                transformOrigin: "center",
                            }}
                        />
                    </Box>
                )}
                {!isMobile &&
                    <IconButton
                        onClick={() => setCollapsed(!collapsed)}
                        sx={{
                            position: "absolute",
                            right: -15,
                            top: "50%",
                            transform: "translateY(-50%)",
                            backgroundColor: "#fff",
                            "&:hover": {
                                backgroundColor: "#f5f5f5",
                            },
                            "&:focus": {
                                outline: "none",
                            },
                        }}
                    >
                        {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                }
            </Box>

            <Box>
                <List>
                    {menuItems.map((item) => (
                        <ListItem key={item.text}>
                            <ListItemButton
                                component={NavLink}
                                to={item.path}
                                onClick={() => handleMenuClick(item)}
                                sx={{
                                    display: "flex",
                                    flexDirection: isCollapsed ? "column" : "row",
                                }}
                            >
                                <ListItemIcon sx={{ justifyContent: "center" }}>{item.icon}</ListItemIcon>
                                <ListItemText
                                    primary={item.text}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Drawer>
    );
}

export default Sidebar;
