import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { Outlet } from "react-router-dom";
import { collapsedWidth, drawerWidth } from "../config-global";
import { useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

function DashboardLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));


  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", overflow: "hidden" }}>
      {/* Topbar */}
      <Topbar setMobileOpen={setMobileOpen} isMobile={isMobile} />

      {/* Sidebar Drawer */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} isMobile={isMobile} />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          width: {
            md: `calc(100vw - ${collapsed ? collapsedWidth : drawerWidth}px)`, sm: "100vw"
          },
          backgroundColor: "#f9fafb",
          overflowY: "auto",
          overflowX: "hidden",

        }}
      >
        <Toolbar />

        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default DashboardLayout;
