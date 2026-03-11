// import { Navigate } from 'react-router-dom'
// import { Box, CircularProgress, Typography } from '@mui/material'
// import { useAuth } from '../context/AuthContext'
// import Logo from './Logo'

// // ── Full-screen loading spinner ───────────────────────────────
// function LoadingScreen() {
//   return (
//     <Box
//       sx={{
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'center',
//         minHeight: '100vh',
//         bgcolor: '#080b10',
//         gap: 2.5,
//       }}
//     >
//       <Logo size="lg" />
//       <CircularProgress size={28} sx={{ color: '#4f9cf9', mt: 1 }} />
//       <Typography sx={{ color: '#3d5068', fontSize: 13 }}>
//         Loading your workspace...
//       </Typography>
//     </Box>
//   )
// }

// // ── Dashboard pages — requires login + onboarding + subscription ─
// export function ProtectedRoute({ children }) {
//   const { user, tenant, subscription, loading } = useAuth()

//   if (loading) return <LoadingScreen />
//   if (!user) return <Navigate to="/login" replace />
//   if (!tenant?.onboarding_complete) return <Navigate to="/onboarding" replace />
//   if (!subscription) return <Navigate to="/onboarding" replace />

//   return children
// }

// // ── Onboarding pages — requires login only ───────────────────
// export function OnboardingRoute({ children }) {
//   const { user, tenant, loading } = useAuth()

//   if (loading) return <LoadingScreen />
//   if (!user) return <Navigate to="/login" replace />

//   // If onboarding already done, go straight to dashboard
//   if (tenant?.onboarding_complete) return <Navigate to="/dashboard" replace />

//   return children
// }

// // ── Auth pages — redirect away if already logged in ──────────
// export function GuestRoute({ children }) {
//   const { user, tenant, loading } = useAuth()

//   if (loading) return <LoadingScreen />

//   if (user && tenant?.onboarding_complete) return <Navigate to="/dashboard" replace />
//   if (user && !tenant?.onboarding_complete) return <Navigate to="/onboarding" replace />

//   return children
// }

import { Navigate } from 'react-router-dom'
import { Box, CircularProgress, Typography } from '@mui/material'
import { useAuth } from '../context/AuthContext'
import Logo from './Logo'

// ── Full-screen loading spinner ───────────────────────────────
function LoadingScreen() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        bgcolor: '#080b10',
        gap: 2.5,
      }}
    >
      <Logo size="lg" />
      <CircularProgress size={28} sx={{ color: '#4f9cf9', mt: 1 }} />
      <Typography sx={{ color: '#3d5068', fontSize: 13 }}>
        Loading your workspace...
      </Typography>
    </Box>
  )
}

// ── Dashboard pages — requires login + onboarding + subscription ─
export function ProtectedRoute({ children }) {
  const { user, tenant, subscription, loading } = useAuth()

  if (loading) return <LoadingScreen />
  if (!user) return <Navigate to="/login" replace />
  if (!tenant?.onboarding_complete) return <Navigate to="/onboarding" replace />
  if (!subscription) return <Navigate to="/onboarding" replace />

  return children
}

// ── Onboarding pages — requires login only ───────────────────
export function OnboardingRoute({ children }) {
  const { user, tenant, subscription, loading } = useAuth()

  if (loading) return <LoadingScreen />
  if (!user) return <Navigate to="/login" replace />

  // Only redirect to dashboard if FULLY done (tenant + subscription)
  if (tenant?.onboarding_complete && subscription) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

// ── Auth pages — redirect away if already logged in ──────────
export function GuestRoute({ children }) {
  const { user, tenant, loading } = useAuth()

  if (loading) return <LoadingScreen />

  if (user && tenant?.onboarding_complete) return <Navigate to="/dashboard" replace />
  if (user && !tenant?.onboarding_complete) return <Navigate to="/onboarding" replace />

  return children
}