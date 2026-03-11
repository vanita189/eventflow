import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Box, Paper, TextField, Button, Typography, Alert } from '@mui/material'
import { useAuth } from '../../context/AuthContext'

export default function ForgotPassword() {
  const { resetPassword } = useAuth()

  const [email,   setEmail]   = useState('')
  const [loading, setLoading] = useState(false)
  const [sent,    setSent]    = useState(false)
  const [error,   setError]   = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email) { setError('Enter your email'); return }

    setLoading(true)
    try {
      await resetPassword(email)
      setSent(true)
    } catch (err) {
      setError(err.message || 'Failed to send reset email')
    }
    setLoading(false)
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#080b10',
        p: 3,
      }}
    >
      <Paper sx={{ p: 4.5, width: 420, maxWidth: '100%', textAlign: 'center' }}>
        <Typography sx={{ fontSize: 40, mb: 1.5 }}>{sent ? '📬' : '🔑'}</Typography>
        <Typography variant="h5" sx={{ mb: 1 }}>
          {sent ? 'Check your email' : 'Reset password'}
        </Typography>
        <Typography sx={{ color: '#3d5068', fontSize: 13, mb: 3 }}>
          {sent
            ? `We sent a reset link to ${email}`
            : 'Enter your email and we will send you a reset link'
          }
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {!sent ? (
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth label="Email Address" type="email" placeholder="you@company.com"
              value={email} onChange={e => setEmail(e.target.value)}
              sx={{ mb: 2.5 }} size="small"
            />
            <Button fullWidth variant="contained" type="submit" disabled={loading} size="large">
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </Box>
        ) : (
          <Button fullWidth variant="outlined" onClick={() => setSent(false)}>
            Resend email
          </Button>
        )}

        <Typography sx={{ mt: 2.5, fontSize: 13 }}>
          <Typography component={Link} to="/login" sx={{ color: '#7ab8ff', textDecoration: 'none' }}>
            ← Back to login
          </Typography>
        </Typography>
      </Paper>
    </Box>
  )
}
