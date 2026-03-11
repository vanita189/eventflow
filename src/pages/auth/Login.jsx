import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Box, Paper, TextField, Button, Typography,
  InputAdornment, IconButton, Alert,
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { useAuth } from '../../context/AuthContext'
import Logo from '../../components/Logo'

// ── Feature list shown on left panel ─────────────────────────
const FEATURES = [
  'Manage unlimited events',
  'Real-time bookings & tickets',
  'Staff & analytics dashboard',
  'Razorpay payment integration',
]

export default function Login() {
  const { signIn } = useAuth()
  const navigate   = useNavigate()

  const [form,     setForm]     = useState({ email: '', password: '' })
  const [loading,  setLoading]  = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [error,    setError]    = useState('')

  // ── Submit ─────────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.email || !form.password) { setError('Please fill all fields'); return }

    setError('')
    setLoading(true)
    try {
      await signIn(form.email, form.password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Login failed')
    }
    setLoading(false)
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>

      {/* ── Left Panel ── */}
      <Box
        sx={{
          width: 440,
          bgcolor: '#0d1117',
          borderRight: '1px solid #1e2a3a',
          p: '60px 48px',
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Box sx={{ mb: 6 }}>
          <Logo size="lg" showTagline />
          <Typography sx={{ color: '#3d5068', fontSize: 14, lineHeight: 1.6, mt: 2 }}>
            The complete event management platform for modern venues
          </Typography>
        </Box>

        {FEATURES.map((f, i) => (
          <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <Box
              sx={{
                width: 20, height: 20,
                borderRadius: '50%',
                bgcolor: 'rgba(79,156,249,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 10,
                color: '#4f9cf9',
                flexShrink: 0,
              }}
            >
              ✦
            </Box>
            <Typography sx={{ color: '#7a90a8', fontSize: 14 }}>{f}</Typography>
          </Box>
        ))}
      </Box>

      {/* ── Right Panel ── */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4,
          bgcolor: '#080b10',
        }}
      >
        <Paper sx={{ p: 4.5, width: 420, maxWidth: '100%', boxShadow: '0 24px 80px rgba(0,0,0,0.5)' }}>

          {/* Mobile logo */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, mb: 3 }}>
            <Logo size="md" />
          </Box>

          <Typography variant="h5" sx={{ mb: 0.5 }}>Welcome back</Typography>
          <Typography sx={{ color: '#3d5068', fontSize: 13, mb: 3 }}>
            Sign in to your EventFlow workspace
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              placeholder="you@company.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              sx={{ mb: 2 }}
              size="small"
            />

            <TextField
              fullWidth
              label="Password"
              type={showPass ? 'text' : 'password'}
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              sx={{ mb: 1 }}
              size="small"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPass(!showPass)}
                      size="small"
                      sx={{ color: '#3d5068' }}
                    >
                      {showPass ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ textAlign: 'right', mb: 3 }}>
              <Typography
                component={Link}
                to="/forgot-password"
                sx={{ fontSize: 12, color: '#7ab8ff', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
              >
                Forgot password?
              </Typography>
            </Box>

            <Button fullWidth variant="contained" type="submit" disabled={loading} size="large">
              {loading ? 'Signing in...' : 'Sign In →'}
            </Button>
          </Box>

          <Typography sx={{ textAlign: 'center', mt: 2.5, fontSize: 13, color: '#3d5068' }}>
            Don't have an account?{' '}
            <Typography component={Link} to="/signup" sx={{ color: '#7ab8ff', textDecoration: 'none', fontWeight: 600 }}>
              Start free trial
            </Typography>
          </Typography>
        </Paper>
      </Box>
    </Box>
  )
}
