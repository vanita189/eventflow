// import Box from "@mui/material/Box";
// import Toolbar from "@mui/material/Toolbar";
// import Sidebar from "../components/Sidebar";
// import Topbar from "../components/Topbar";
// import { Outlet } from "react-router-dom";
// import { collapsedWidth, drawerWidth } from "../config-global";
// import { useState } from "react";
// import useMediaQuery from "@mui/material/useMediaQuery";
// import { useTheme } from "@mui/material/styles";

// function DashboardLayout() {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("md"));


//   const [collapsed, setCollapsed] = useState(false);
//   const [mobileOpen, setMobileOpen] = useState(false);
//   return (
//     <Box sx={{ display: "flex", minHeight: "100vh", overflow: "hidden" }}>
//       {/* Topbar */}
//       <Topbar setMobileOpen={setMobileOpen} isMobile={isMobile} />

//       {/* Sidebar Drawer */}
//       <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} isMobile={isMobile} />

//       {/* Main Content */}
//       <Box
//         component="main"
//         sx={{
//           flexGrow: 1,
//           minWidth: 0,
//           width: {
//             md: `calc(100vw - ${collapsed ? collapsedWidth : drawerWidth}px)`, sm: "100vw"
//           },
//           backgroundColor: "#f9fafb",
//           overflowY: "auto",
//           overflowX: "hidden",

//         }}
//       >
//         <Toolbar />

//         <Box sx={{ p: { xs: 2, sm: 3 } }}>
//           <Outlet />
//         </Box>
//       </Box>
//     </Box>
//   );
// }

// export default DashboardLayout;

import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { Outlet, useNavigate } from "react-router-dom";
import { collapsedWidth, drawerWidth } from "../config-global";
import { useState, useEffect, useContext } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../config/supabase";

function DashboardLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // ✅ Check company
  useEffect(() => {
    const checkCompany = async () => {
      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("company_id")
        .eq("id", user.id)
        .single();

      if (!data?.company_id) {
        navigate("/onboarding", { replace: true });
      }
    };

    checkCompany();
  }, [user, navigate]);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", overflow: "hidden" }}>
      <Topbar setMobileOpen={setMobileOpen} isMobile={isMobile} />
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        isMobile={isMobile}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          width: {
            md: `calc(100vw - ${collapsed ? collapsedWidth : drawerWidth}px)`,
            sm: "100vw",
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
