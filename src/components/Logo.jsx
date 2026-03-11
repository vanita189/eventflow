import { Box, Typography } from '@mui/material'

// ── EventFlow SVG Logo ──────────────────────────────────────
function EventFlowIcon({ size = 32 }) {
  return (
    <Box
      component="svg"
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer circle */}
      <circle cx="20" cy="20" r="18" stroke="url(#grad)" strokeWidth="2" />

      {/* Calendar grid dots */}
      <rect x="12" y="11" width="4" height="4" rx="1" fill="#4f9cf9" opacity="0.9" />
      <rect x="18" y="11" width="4" height="4" rx="1" fill="#4f9cf9" opacity="0.6" />
      <rect x="24" y="11" width="4" height="4" rx="1" fill="#4f9cf9" opacity="0.3" />

      <rect x="12" y="17" width="4" height="4" rx="1" fill="#7ab8ff" opacity="0.9" />
      <rect x="18" y="17" width="4" height="4" rx="1" fill="#7ab8ff" opacity="0.7" />
      <rect x="24" y="17" width="4" height="4" rx="1" fill="#7ab8ff" opacity="0.4" />

      {/* Flow arrow */}
      <path d="M12 27 Q20 23 28 27" stroke="url(#grad2)" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M25 24.5 L28 27 L25 29.5" stroke="#7ab8ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />

      <defs>
        <linearGradient id="grad" x1="2" y1="2" x2="38" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4f9cf9" />
          <stop offset="100%" stopColor="#2a5fa8" />
        </linearGradient>
        <linearGradient id="grad2" x1="12" y1="27" x2="28" y2="27" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4f9cf9" />
          <stop offset="100%" stopColor="#7ab8ff" />
        </linearGradient>
      </defs>
    </Box>
  )
}

// ── Full Logo with wordmark ──────────────────────────────────
export default function Logo({ size = 'md', showTagline = false }) {
  const sizes = {
    sm: { icon: 24, h: 14, tag: 9 },
    md: { icon: 32, h: 17, tag: 10 },
    lg: { icon: 44, h: 26, tag: 12 },
  }
  const s = sizes[size] || sizes.md

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <EventFlowIcon size={s.icon} />
      <Box>
        <Typography
          sx={{
            fontSize: s.h,
            fontWeight: 700,
            fontFamily: '"Playfair Display", serif',
            background: 'linear-gradient(135deg, #e2eaf4 30%, #7ab8ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: 1.1,
          }}
        >
          EventFlow
        </Typography>
        {showTagline && (
          <Typography
            sx={{
              fontSize: s.tag,
              color: '#3d5068',
              textTransform: 'uppercase',
              letterSpacing: 1.5,
              lineHeight: 1,
              mt: 0.3,
            }}
          >
            Event Management
          </Typography>
        )}
      </Box>
    </Box>
  )
}
