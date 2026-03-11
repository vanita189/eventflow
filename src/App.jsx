import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store/store'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './components/Toast'
import { ProtectedRoute, OnboardingRoute, GuestRoute } from './components/ProtectedRoute'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import ForgotPassword from './pages/auth/ForgotPassword'
import OnboardingLayout from './pages/onboarding/OnboardingLayout'
import DashboardLayout from './pages/dashboard/DashboardLayout'

export default function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />

              <Route path="/login" element={
                <GuestRoute><Login /></GuestRoute>
              } />
              <Route path="/signup" element={
                <GuestRoute><Signup /></GuestRoute>
              } />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              <Route path="/onboarding/*" element={
                <OnboardingRoute><OnboardingLayout /></OnboardingRoute>
              } />
              <Route path="/dashboard/*" element={
                <ProtectedRoute><DashboardLayout /></ProtectedRoute>
              } />

              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </Provider>
  )
}
