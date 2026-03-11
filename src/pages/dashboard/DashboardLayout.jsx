import { useState } from 'react'
import {
  Box, Drawer, AppBar, Toolbar, List, ListItem,
  ListItemButton, ListItemIcon, ListItemText,
  Typography, Chip, Avatar, IconButton, useMediaQuery,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import {
  Dashboard, Event, ConfirmationNumber, People,
  BarChart, Description, Logout, Menu as MenuIcon,
  Person,
} from '@mui/icons-material'
import { useAuth } from '../../context/AuthContext'
import Logo from '../../components/Logo'
import Overview from './Overview'
import Events from './Events'
import { Bookings } from './Bookings'
import Staff from './Staff'
import { Analytics, Reports } from './AnalyticsReports'
import Profile from './Profile'

// ── Nav config ────────────────────────────────────────────────
const NAV = [
  { id: 'overview',  label: 'Overview',          icon: <Dashboard />,        section: 'MAIN' },
  { id: 'events',    label: 'Events',             icon: <Event />,            section: 'MANAGE' },
  { id: 'bookings',  label: 'Tickets & Bookings', icon: <ConfirmationNumber />, section: 'MANAGE' },
  { id: 'staff',     label: 'Staff',              icon: <People />,           section: 'MANAGE' },
  { id: 'analytics', label: 'Analytics',          icon: <BarChart />,         section: 'INSIGHTS' },
  { id: 'reports',   label: 'Reports',            icon: <Description />,      section: 'INSIGHTS' },
  { id: 'profile',   label: 'Profile',            icon: <Person />,           section: 'ACCOUNT' },
]

const PAGES = {
  overview: Overview, events: Events, bookings: Bookings,
  staff: Staff, analytics: Analytics, reports: Reports, profile: Profile,
}

const TITLES = {
  overview: 'Dashboard', events: 'Events Management',
  bookings: 'Tickets & Bookings', staff: 'Staff Management',
  analytics: 'Analytics', reports: 'Reports', profile: 'Profile & Settings',
}

const SECTIONS   = [...new Set(NAV.map(n => n.section))]
const DRAWER_WIDTH = 260

export default function DashboardLayout() {
  const theme    = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const [active,     setActive]     = useState('overview')
  const [mobileOpen, setMobileOpen] = useState(false)

  const { tenant, signOut, trialDaysLeft, isTrialActive } = useAuth()
  const Page     = PAGES[active]
  const daysLeft = trialDaysLeft()

  function handleNavClick(id) {
    setActive(id)
    if (isMobile) setMobileOpen(false)
  }

  // ── Sidebar content ───────────────────────────────────────
  const sidebarContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* Logo */}
      <Box sx={{ p: 3, pb: 2.5, borderBottom: '1px solid #1e2a3a' }}>
        <Logo size="md" showTagline />
      </Box>

      {/* Nav items */}
      <List sx={{ flex: 1, px: 1.5, py: 2, overflowY: 'auto' }}>
        {SECTIONS.map(section => (
          <Box key={section}>
            <Typography
              sx={{
                fontSize: 9, textTransform: 'uppercase', letterSpacing: 2,
                color: '#3d5068', px: 1.5, py: 1, fontWeight: 700,
              }}
            >
              {section}
            </Typography>

            {NAV.filter(n => n.section === section).map(item => (
              <ListItem key={item.id} disablePadding sx={{ mb: 0.3 }}>
                <ListItemButton
                  onClick={() => handleNavClick(item.id)}
                  sx={{
                    borderRadius: 2,
                    border:       '1px solid transparent',
                    transition:   'all 0.2s',
                    position:     'relative',
                    overflow:     'hidden',
                    bgcolor:      active === item.id ? 'rgba(79,156,249,0.12)' : 'transparent',
                    borderColor:  active === item.id ? 'rgba(79,156,249,0.25)' : 'transparent',
                    '&:hover': { bgcolor: 'rgba(79,156,249,0.06)', borderColor: '#1e2a3a' },
                    '&::before': active === item.id
                      ? {
                          content: '""', position: 'absolute', left: 0,
                          top: '20%', bottom: '20%', width: 2,
                          bgcolor: '#4f9cf9', borderRadius: '0 2px 2px 0',
                        }
                      : {},
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 36,
                      color: active === item.id ? '#7ab8ff' : '#3d5068',
                      '& .MuiSvgIcon-root': { fontSize: 18 },
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: 13.5,
                      fontWeight: active === item.id ? 600 : 400,
                      color: active === item.id ? '#7ab8ff' : '#7a90a8',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </Box>
        ))}
      </List>

      {/* Footer */}
      <Box sx={{ p: 2, borderTop: '1px solid #1e2a3a' }}>
        {/* Trial banner */}
        {isTrialActive() && (
          <Box
            sx={{
              bgcolor: 'rgba(61,214,140,0.08)',
              border:  '1px solid rgba(61,214,140,0.2)',
              borderRadius: 2, p: 1.5, mb: 1.5,
            }}
          >
            <Typography sx={{ color: '#3dd68c', fontWeight: 600, fontSize: 12 }}>🎁 Free Trial</Typography>
            <Typography sx={{ color: '#3d5068', fontSize: 11, mt: 0.3 }}>{daysLeft} days remaining</Typography>
          </Box>
        )}

        {/* Tenant info */}
        <Box
          sx={{
            bgcolor: '#111720', border: '1px solid #1e2a3a', borderRadius: 2,
            p: 1.5, display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5,
          }}
        >
          <Avatar
            src={tenant?.logo_url}
            sx={{ width: 32, height: 32, bgcolor: '#1e2a3a', fontSize: 14 }}
          >
            🏢
          </Avatar>
          <Box sx={{ flex: 1, overflow: 'hidden' }}>
            <Typography
              sx={{
                fontSize: 12.5, fontWeight: 600, color: '#e2eaf4',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}
            >
              {tenant?.name || 'Your Venue'}
            </Typography>
            <Typography sx={{ fontSize: 10.5, color: '#3d5068' }}>Venue Owner</Typography>
          </Box>
        </Box>

        {/* Sign out */}
        <ListItemButton
          onClick={signOut}
          sx={{
            borderRadius: 2, border: '1px solid #1e2a3a',
            '&:hover': { bgcolor: 'rgba(240,100,116,0.06)', borderColor: 'rgba(240,100,116,0.2)' },
          }}
        >
          <ListItemIcon sx={{ minWidth: 32, color: '#3d5068' }}>
            <Logout sx={{ fontSize: 16 }} />
          </ListItemIcon>
          <ListItemText
            primary="Sign Out"
            primaryTypographyProps={{ fontSize: 13, color: '#3d5068' }}
          />
        </ListItemButton>
      </Box>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>

      {/* ── Sidebar — permanent on desktop, temporary on mobile ── */}
      <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
          }}
        >
          {sidebarContent}
        </Drawer>

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
          }}
          open
        >
          {sidebarContent}
        </Drawer>
      </Box>

      {/* ── Main content ── */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          minWidth: 0,
        }}
      >
        {/* AppBar */}
        <AppBar position="sticky" elevation={0}>
          <Toolbar sx={{ minHeight: '70px !important' }}>
            {/* Mobile hamburger */}
            {isMobile && (
              <IconButton
                onClick={() => setMobileOpen(true)}
                sx={{ mr: 2, color: '#7a90a8' }}
              >
                <MenuIcon />
              </IconButton>
            )}

            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontSize: 19, fontWeight: 600 }}>
                {TITLES[active]}
              </Typography>
              <Typography sx={{ fontSize: 11.5, color: '#3d5068' }}>
                🟢 Live · {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </Typography>
            </Box>

            <Chip
              label={tenant?.name || 'Your Venue'}
              variant="outlined"
              size="small"
              sx={{ borderColor: '#1e2a3a', color: '#7a90a8', display: { xs: 'none', sm: 'flex' } }}
            />
          </Toolbar>
        </AppBar>

        {/* Page content */}
        <Box sx={{ p: { xs: 2, md: 4 }, flex: 1 }}>
          <Page />
        </Box>
      </Box>
    </Box>
  )
}
