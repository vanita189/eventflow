// import { createContext, useContext, useEffect, useState } from 'react'
// import { supabase } from '../lib/supabase'

// const AuthContext = createContext(null)

// // ── Provider ─────────────────────────────────────────────────
// export function AuthProvider({ children }) {
//   const [user,         setUser]         = useState(null)
//   const [tenant,       setTenant]       = useState(null)
//   const [subscription, setSubscription] = useState(null)
//   const [loading,      setLoading]      = useState(true)

//   // ── Bootstrap ──────────────────────────────────────────────
//   useEffect(() => {
//     let mounted = true

//     async function init() {
//       try {
//         const { data: { session } } = await supabase.auth.getSession()
//         if (!mounted) return

//         if (session?.user) {
//           setUser(session.user)
//           localStorage.setItem('sb_token', session.access_token)
//           await loadTenant(session.user.id, mounted)
//         } else {
//           setUser(null)
//           setTenant(null)
//           setSubscription(null)
//         }
//       } catch (err) {
//         console.error('Auth init error:', err)
//       } finally {
//         if (mounted) setLoading(false)
//       }
//     }

//     init()

//     // Listen for auth state changes
//     const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange(
//       async (event, session) => {
//         if (!mounted) return

//         if (event === 'SIGNED_OUT') {
//           setUser(null)
//           setTenant(null)
//           setSubscription(null)
//           localStorage.removeItem('sb_token')
//           return
//         }

//         if (session?.user && event === 'SIGNED_IN') {
//           setUser(session.user)
//           localStorage.setItem('sb_token', session.access_token)
//           await loadTenant(session.user.id, mounted)
//           if (mounted) setLoading(false)
//         }
//       }
//     )

//     return () => {
//       mounted = false
//       authSub.unsubscribe()
//     }
//   }, [])

//   // ── Load tenant + subscription ─────────────────────────────
//   async function loadTenant(userId, mounted = true) {
//     try {
//       const { data: tenantData, error } = await supabase
//         .from('tenants')
//         .select('*')
//         .eq('user_id', userId)
//         .maybeSingle()

//       if (!mounted) return

//       if (error) {
//         console.error('Tenant load error:', error)
//         setTenant(null)
//         setSubscription(null)
//         return
//       }

//       setTenant(tenantData || null)

//       if (tenantData) {
//         const { data: subData } = await supabase
//           .from('subscriptions')
//           .select('*')
//           .eq('tenant_id', tenantData.id)
//           .maybeSingle()

//         if (mounted) setSubscription(subData || null)
//       } else {
//         if (mounted) setSubscription(null)
//       }
//     } catch (e) {
//       console.error('loadTenant error:', e)
//       if (mounted) {
//         setTenant(null)
//         setSubscription(null)
//       }
//     }
//   }

//   // ── Auth actions ───────────────────────────────────────────
//   async function signUp(email, password, name) {
//     const { data, error } = await supabase.auth.signUp({
//       email,
//       password,
//       options: { data: { full_name: name } },
//     })
//     if (error) throw error
//     return data
//   }

//   async function signIn(email, password) {
//     const { data, error } = await supabase.auth.signInWithPassword({ email, password })
//     if (error) throw error
//     return data
//   }

//   async function signOut() {
//     await supabase.auth.signOut()
//     localStorage.removeItem('sb_token')
//     setUser(null)
//     setTenant(null)
//     setSubscription(null)
//   }

//   async function resetPassword(email) {
//     const { error } = await supabase.auth.resetPasswordForEmail(email, {
//       redirectTo: `${window.location.origin}/reset-password`,
//     })
//     if (error) throw error
//   }

//   async function refreshTenant() {
//     if (user) await loadTenant(user.id)
//   }

//   // ── Subscription helpers ───────────────────────────────────
//   const isTrialActive = () =>
//     subscription?.plan === 'trial' &&
//     new Date(subscription.trial_ends_at) > new Date()

//   const isPaid = () =>
//     subscription?.plan !== 'trial' &&
//     subscription?.status === 'active'

//   const hasAccess = () => isTrialActive() || isPaid()

//   const trialDaysLeft = () => {
//     if (!subscription?.trial_ends_at) return 0
//     const diff = new Date(subscription.trial_ends_at) - new Date()
//     return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
//   }

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         tenant,
//         subscription,
//         loading,
//         signUp,
//         signIn,
//         signOut,
//         resetPassword,
//         refreshTenant,
//         isTrialActive,
//         isPaid,
//         hasAccess,
//         trialDaysLeft,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   )
// }

// export const useAuth = () => useContext(AuthContext)

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

// ── Provider ─────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [user,         setUser]         = useState(null)
  const [tenant,       setTenant]       = useState(null)
  const [subscription, setSubscription] = useState(null)
  const [loading,      setLoading]      = useState(true)

  // ── Bootstrap ──────────────────────────────────────────────
  useEffect(() => {
    let mounted = true

    // Safety timeout — if loading takes more than 5s, force stop
    const timeout = setTimeout(() => {
      if (mounted) {
        console.warn('Auth timeout — forcing loading to false')
        setLoading(false)
      }
    }, 5000)

    async function init() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!mounted) return

        if (session?.user) {
          setUser(session.user)
          localStorage.setItem('sb_token', session.access_token)
          await loadTenant(session.user.id, mounted)
        } else {
          // Clear any stale token from localStorage
          localStorage.removeItem('sb_token')
          setUser(null)
          setTenant(null)
          setSubscription(null)
        }
      } catch (err) {
        console.error('Auth init error:', err)
        if (mounted) {
          localStorage.removeItem('sb_token')
          setUser(null)
          setTenant(null)
          setSubscription(null)
        }
      } finally {
        clearTimeout(timeout)
        if (mounted) setLoading(false)
      }
    }

    init()

    // Listen for auth state changes
    const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return

        if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED' && !session) {
          setUser(null)
          setTenant(null)
          setSubscription(null)
          localStorage.removeItem('sb_token')
          return
        }

        if (session?.user && event === 'SIGNED_IN') {
          setUser(session.user)
          localStorage.setItem('sb_token', session.access_token)
          await loadTenant(session.user.id, mounted)
          if (mounted) setLoading(false)
        }

        // Handle expired/invalid token
        if (event === 'TOKEN_REFRESHED' && session?.user) {
          localStorage.setItem('sb_token', session.access_token)
        }
      }
    )

    return () => {
      mounted = false
      authSub.unsubscribe()
    }
  }, [])

  // ── Load tenant + subscription ─────────────────────────────
  async function loadTenant(userId, mounted = true) {
    try {
      const { data: tenantData, error } = await supabase
        .from('tenants')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle()

      if (!mounted) return

      if (error) {
        console.error('Tenant load error:', error)
        setTenant(null)
        setSubscription(null)
        return
      }

      setTenant(tenantData || null)

      if (tenantData) {
        const { data: subData } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('tenant_id', tenantData.id)
          .maybeSingle()

        if (mounted) setSubscription(subData || null)
      } else {
        if (mounted) setSubscription(null)
      }
    } catch (e) {
      console.error('loadTenant error:', e)
      if (mounted) {
        setTenant(null)
        setSubscription(null)
      }
    }
  }

  // ── Auth actions ───────────────────────────────────────────
  async function signUp(email, password, name) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    })
    if (error) throw error
    return data
  }

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }

  async function signOut() {
    await supabase.auth.signOut()
    localStorage.removeItem('sb_token')
    setUser(null)
    setTenant(null)
    setSubscription(null)
  }

  async function resetPassword(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) throw error
  }

  async function refreshTenant() {
    if (user) await loadTenant(user.id)
  }

  // ── Subscription helpers ───────────────────────────────────
  const isTrialActive = () =>
    subscription?.plan === 'trial' &&
    new Date(subscription.trial_ends_at) > new Date()

  const isPaid = () =>
    subscription?.plan !== 'trial' &&
    subscription?.status === 'active'

  const hasAccess = () => isTrialActive() || isPaid()

  const trialDaysLeft = () => {
    if (!subscription?.trial_ends_at) return 0
    const diff = new Date(subscription.trial_ends_at) - new Date()
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        tenant,
        subscription,
        loading,
        signUp,
        signIn,
        signOut,
        resetPassword,
        refreshTenant,
        isTrialActive,
        isPaid,
        hasAccess,
        trialDaysLeft,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)