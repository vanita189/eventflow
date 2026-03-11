import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Stepper, Step, StepLabel, Typography } from '@mui/material'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../components/Toast'
import { supabase } from '../../lib/supabase'
import Logo from '../../components/Logo'
import Step1PubDetails from './Step1PubDetails'
import Step2Location from './Step2Location'
import Step3FirstEvent from './Step3FirstEvent'
import Step4Subscription from './Step4Subscription'

const STEPS = ['Venue Details', 'Location', 'First Event', 'Choose Plan']

export default function OnboardingLayout() {
  const { user, refreshTenant } = useAuth()
  const toast    = useToast()
  const navigate = useNavigate()

  const [step, setStep] = useState(0)
  const [data, setData] = useState({
    pub:      {},
    location: { lat: 51.505, lng: -0.09, address: '' },
    event:    null,
  })

  function updateData(key, val) {
    setData(prev => ({ ...prev, [key]: { ...prev[key], ...val } }))
  }

  // ── Finish onboarding ──────────────────────────────────────
  async function finishOnboarding(planData) {
    try {
      const trialEnd = new Date()
      trialEnd.setDate(trialEnd.getDate() + 30)

      // Create tenant
      const { data: tenant, error: tErr } = await supabase
        .from('tenants')
        .insert([{
          user_id:             user.id,
          name:                data.pub.name,
          email:               data.pub.email || user.email,
          phone:               data.pub.phone,
          address:             data.location.address,
          lat:                 data.location.lat,
          lng:                 data.location.lng,
          description:         data.pub.description,
          logo_url:            data.pub.logo_url || null,
          onboarding_complete: true,
        }])
        .select()
        .single()

      if (tErr) throw tErr

      // Create subscription
      await supabase.from('subscriptions').insert([{
        tenant_id:        tenant.id,
        plan:             planData.plan,
        status:           planData.plan === 'trial' ? 'trial' : 'pending_payment',
        trial_ends_at:    trialEnd.toISOString(),
        razorpay_order_id: planData.orderId || null,
      }])

      // Create first event if provided
      if (data.event?.title) {
        await supabase.from('events').insert([{ tenant_id: tenant.id, ...data.event }])
      }

      await refreshTenant()
      toast('Welcome to EventFlow! 🎉', 'success')
      navigate('/dashboard')
    } catch (err) {
      toast(err.message || 'Setup failed', 'error')
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#080b10' }}>

      {/* ── Top bar ── */}
      <Box
        sx={{
          bgcolor: '#0d1117',
          borderBottom: '1px solid #1e2a3a',
          px: { xs: 2, md: 5 },
          py: 2.5,
          display: 'flex',
          alignItems: 'center',
          gap: { xs: 2, md: 5 },
          flexWrap: 'wrap',
        }}
      >
        <Logo size="md" />

        <Box sx={{ flex: 1, minWidth: 200 }}>
          <Stepper
            activeStep={step}
            sx={{
              '& .MuiStepLabel-label':           { color: '#3d5068', fontSize: 12 },
              '& .MuiStepLabel-label.Mui-active': { color: '#7ab8ff' },
              '& .MuiStepLabel-label.Mui-completed': { color: '#3dd68c' },
              '& .MuiStepIcon-root':             { color: '#1e2a3a' },
              '& .MuiStepIcon-root.Mui-active':  { color: '#4f9cf9' },
              '& .MuiStepIcon-root.Mui-completed': { color: '#3dd68c' },
              '& .MuiStepConnector-line':        { borderColor: '#1e2a3a' },
            }}
          >
            {STEPS.map(label => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
      </Box>

      {/* ── Step content ── */}
      <Box sx={{ display: 'flex', justifyContent: 'center', p: { xs: 2, md: 6 } }}>
        {step === 0 && (
          <Step1PubDetails
            data={data.pub}
            onChange={v => updateData('pub', v)}
            onNext={() => setStep(1)}
          />
        )}
        {step === 1 && (
          <Step2Location
            data={data.location}
            onChange={v => updateData('location', v)}
            onBack={() => setStep(0)}
            onNext={() => setStep(2)}
          />
        )}
        {step === 2 && (
          <Step3FirstEvent
            data={data.event}
            onChange={v => setData(p => ({ ...p, event: v }))}
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
          />
        )}
        {step === 3 && (
          <Step4Subscription
            onBack={() => setStep(2)}
            onFinish={finishOnboarding}
          />
        )}
      </Box>
    </Box>
  )
}
