import { useState } from 'react'
import {
  Box, Paper, Button, Typography,
  Grid, Chip, Divider,
} from '@mui/material'
import { useToast } from '../../components/Toast'

const PLANS = [
  {
    id:          'trial',
    name:        'Free Trial',
    price:       0,
    period:      '30 days',
    badge:       'START HERE',
    badgeColor:  'success',
    description: 'Full access, no credit card required',
    features:    ['Up to 5 events/month', 'Unlimited bookings', 'Staff management', 'Basic analytics', 'Email support'],
  },
  {
    id:          'starter',
    name:        'Starter',
    price:       2499,
    period:      'per month',
    badge:       'POPULAR',
    badgeColor:  'warning',
    description: 'Perfect for small venues',
    features:    ['Up to 20 events/month', 'Unlimited bookings', 'Staff management', 'Full analytics', 'Priority support'],
  },
  {
    id:          'pro',
    name:        'Pro',
    price:       6499,
    period:      'per month',
    badge:       'BEST VALUE',
    badgeColor:  'primary',
    description: 'For busy venues',
    features:    ['Unlimited events', 'Unlimited bookings', 'Multi-staff roles', 'Advanced analytics', 'Custom reports', '24/7 support'],
  },
  {
    id:          'enterprise',
    name:        'Enterprise',
    price:       16499,
    period:      'per year',
    badge:       'ENTERPRISE',
    badgeColor:  'default',
    description: 'For venue chains',
    features:    ['Everything in Pro', 'Multi-location', 'Dedicated manager', 'Custom integrations', 'SLA guarantee'],
  },
]

export default function Step4Subscription({ onBack, onFinish }) {
  const toast = useToast()

  const [selected, setSelected] = useState('trial')
  const [loading,  setLoading]  = useState(false)

  // ── Load Razorpay script ───────────────────────────────────
  function loadRazorpay() {
    return new Promise((resolve, reject) => {
      if (window.Razorpay) { resolve(); return }
      const s    = document.createElement('script')
      s.src      = 'https://checkout.razorpay.com/v1/checkout.js'
      s.onload   = resolve
      s.onerror  = reject
      document.body.appendChild(s)
    })
  }

  // ── Handle plan selection ──────────────────────────────────
  async function handleContinue() {
    setLoading(true)
    const plan = PLANS.find(p => p.id === selected)

    if (selected === 'trial') {
      await onFinish({ plan: 'trial', orderId: null })
      setLoading(false)
      return
    }

    try {
      await loadRazorpay()
      const options = {
        key:         'YOUR_RAZORPAY_KEY_ID',
        amount:      plan.price * 100,
        currency:    'INR',
        name:        'EventFlow',
        description: `${plan.name} Plan`,
        handler: async (response) => {
          await onFinish({
            plan:      selected,
            orderId:   response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
          })
        },
        theme: { color: '#4f9cf9' },
        modal: {
          ondismiss: () => {
            toast('Payment cancelled', 'info')
            setLoading(false)
          },
        },
      }
      new window.Razorpay(options).open()
    } catch {
      toast('Payment failed', 'error')
      setLoading(false)
    }
  }

  return (
    <Paper sx={{ p: { xs: 2.5, sm: 4.5 }, width: '100%', maxWidth: 960 }}>

      {/* ── Header ── */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography sx={{ fontSize: 40, mb: 1.5 }}>💳</Typography>
        <Typography variant="h5" sx={{ mb: 0.5 }}>Choose your plan</Typography>
        <Typography sx={{ color: '#3d5068', fontSize: 13 }}>
          Start free for 30 days — upgrade anytime
        </Typography>
      </Box>

      {/* ── Plan cards ── */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {PLANS.map(plan => (
          <Grid item xs={12} sm={6} md={3} key={plan.id}>
            <Box
              onClick={() => setSelected(plan.id)}
              sx={{
                border:     `2px solid ${selected === plan.id ? '#4f9cf9' : '#1e2a3a'}`,
                borderRadius: 2.5,
                p:          2.5,
                cursor:     'pointer',
                bgcolor:    selected === plan.id ? 'rgba(79,156,249,0.06)' : '#0d1117',
                transition: 'all 0.2s',
                height:     '100%',
                '&:hover': {
                  borderColor: selected === plan.id ? '#4f9cf9' : '#243344',
                  transform:   'translateY(-2px)',
                },
              }}
            >
              <Chip
                label={plan.badge}
                color={plan.badgeColor}
                size="small"
                sx={{ mb: 1.5, fontSize: 9, height: 20, fontWeight: 700 }}
              />
              <Typography variant="h6" sx={{ fontSize: 16, mb: 1 }}>{plan.name}</Typography>

              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, mb: 1 }}>
                {plan.price > 0 && <Typography sx={{ color: '#7a90a8', fontSize: 14 }}>₹</Typography>}
                <Typography sx={{ fontSize: 24, fontWeight: 700, color: '#7ab8ff', fontFamily: '"Playfair Display"' }}>
                  {plan.price === 0 ? 'Free' : plan.price.toLocaleString()}
                </Typography>
                <Typography sx={{ fontSize: 11, color: '#3d5068' }}>/{plan.period}</Typography>
              </Box>

              <Typography sx={{ fontSize: 11, color: '#3d5068', mb: 1.5 }}>{plan.description}</Typography>
              <Divider sx={{ mb: 1.5 }} />

              {plan.features.map((f, i) => (
                <Typography key={i} sx={{ fontSize: 11, color: '#7a90a8', mb: 0.5, display: 'flex', gap: 0.8 }}>
                  <span style={{ color: '#3dd68c' }}>✓</span> {f}
                </Typography>
              ))}

              <Box
                sx={{
                  mt: 2, p: 0.8, borderRadius: 1,
                  bgcolor:    selected === plan.id ? '#4f9cf9' : '#1e2a3a',
                  textAlign:  'center',
                  fontSize:   11,
                  fontWeight: 700,
                  color:      selected === plan.id ? '#fff' : '#3d5068',
                  transition: 'all 0.2s',
                }}
              >
                {selected === plan.id ? '✓ Selected' : 'Select Plan'}
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* ── Navigation ── */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button variant="outlined" onClick={onBack}>← Back</Button>
        <Box sx={{ textAlign: 'center' }}>
          <Button variant="contained" onClick={handleContinue} disabled={loading} size="large">
            {loading ? 'Processing...' : selected === 'trial' ? '🎁 Start Free Trial →' : '💳 Pay & Activate →'}
          </Button>
          <Typography sx={{ fontSize: 11, color: '#3d5068', mt: 1 }}>
            🔒 Secured by Razorpay · Cancel anytime
          </Typography>
        </Box>
      </Box>
    </Paper>
  )
}
