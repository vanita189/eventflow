import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Box, Paper, TextField, Button, Typography,
  InputAdornment, IconButton, Alert,
  Checkbox, FormControlLabel, LinearProgress,
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../components/Toast'
import Logo from '../../components/Logo'

const TRIAL_FEATURES = [
  'Unlimited events',
  'Real-time bookings',
  'Staff management',
  'Analytics & reports',
  'Razorpay payments',
]

export default function Signup() {
  const { signUp } = useAuth()
  const toast      = useToast()
  const navigate   = useNavigate()

  const [form, setForm] = useState({
    name: '', email: '', password: '', confirm: '', agree: false,
  })
  const [loading,  setLoading]  = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [error,    setError]    = useState('')

  // ── Password strength ──────────────────────────────────────
  const strength      = form.password.length === 0 ? 0 : form.password.length < 6 ? 1 : form.password.length < 10 ? 2 : 3
  const strengthColor = ['', 'error', 'warning', 'success']
  const strengthLabel = ['', 'Weak', 'Good', 'Strong']

  // ── Submit ─────────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) { setError('Fill all fields'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return }
    if (form.password !== form.confirm) { setError('Passwords do not match'); return }
    if (!form.agree) { setError('Please accept terms & conditions'); return }

    setError('')
    setLoading(true)
    try {
      await signUp(form.email, form.password, form.name)
      toast('Account created!', 'success')
      navigate('/onboarding')
    } catch (err) {
      setError(err.message || 'Signup failed')
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
        <Box sx={{ mb: 4 }}>
          <Logo size="lg" showTagline />
          <Typography sx={{ color: '#3d5068', fontSize: 14, mt: 2 }}>
            Start your 30-day free trial today. No credit card required.
          </Typography>
        </Box>

        <Paper
          sx={{
            p: 3,
            background: 'rgba(61,214,140,0.06)',
            border: '1px solid rgba(61,214,140,0.2)',
          }}
        >
          <Box
            sx={{
              display: 'inline-block',
              background: 'rgba(61,214,140,0.15)',
              color: '#3dd68c',
              border: '1px solid rgba(61,214,140,0.3)',
              borderRadius: 10,
              px: 1.5, py: 0.3,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: 1,
              mb: 1.5,
            }}
          >
            🎁 FREE TRIAL
          </Box>
          <Typography variant="h6" sx={{ fontSize: 18, mb: 0.5 }}>
            30 Days Full Access
          </Typography>
          <Typography sx={{ fontSize: 12, color: '#3d5068', mb: 2 }}>
            Everything included, no limitations during trial
          </Typography>
          {TRIAL_FEATURES.map((f, i) => (
            <Typography key={i} sx={{ fontSize: 12, color: '#3dd68c', mb: 0.5 }}>
              ✓ {f}
            </Typography>
          ))}
        </Paper>
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
        <Paper sx={{ p: 4.5, width: 420, maxWidth: '100%' }}>

          {/* Mobile logo */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, mb: 3 }}>
            <Logo size="md" />
          </Box>

          <Typography variant="h5" sx={{ mb: 0.5 }}>Create your account</Typography>
          <Typography sx={{ color: '#3d5068', fontSize: 13, mb: 3 }}>
            Start your 30-day free trial
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth label="Full Name" placeholder="John Smith"
              value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              sx={{ mb: 2 }} size="small"
            />
            <TextField
              fullWidth label="Email Address" type="email" placeholder="you@company.com"
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
              sx={{ mb: 2 }} size="small"
            />
            <TextField
              fullWidth label="Password" type={showPass ? 'text' : 'password'} placeholder="Min 6 characters"
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
              sx={{ mb: form.password ? 1 : 2 }} size="small"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPass(!showPass)} size="small" sx={{ color: '#3d5068' }}>
                      {showPass ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Password strength bar */}
            {form.password && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={(strength / 3) * 100}
                  color={strengthColor[strength]}
                  sx={{ flex: 1 }}
                />
                <Typography sx={{ fontSize: 11, color: `${strengthColor[strength]}.main`, minWidth: 40 }}>
                  {strengthLabel[strength]}
                </Typography>
              </Box>
            )}

            <TextField
              fullWidth label="Confirm Password" type="password" placeholder="Re-enter password"
              value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })}
              sx={{ mb: 2 }} size="small"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={form.agree}
                  onChange={e => setForm({ ...form, agree: e.target.checked })}
                  size="small"
                />
              }
              label={
                <Typography sx={{ fontSize: 12, color: '#7a90a8' }}>
                  I agree to the{' '}
                  <span style={{ color: '#7ab8ff' }}>Terms of Service</span>
                  {' '}and{' '}
                  <span style={{ color: '#7ab8ff' }}>Privacy Policy</span>
                </Typography>
              }
              sx={{ mb: 2.5 }}
            />

            <Button fullWidth variant="contained" type="submit" disabled={loading} size="large">
              {loading ? 'Creating account...' : 'Start Free Trial →'}
            </Button>
          </Box>

          <Typography sx={{ textAlign: 'center', mt: 2.5, fontSize: 13, color: '#3d5068' }}>
            Already have an account?{' '}
            <Typography component={Link} to="/login" sx={{ color: '#7ab8ff', textDecoration: 'none', fontWeight: 600 }}>
              Sign in
            </Typography>
          </Typography>
        </Paper>
      </Box>
    </Box>
  )
}
