import axios from 'axios'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../lib/supabase'

const axiosInstance = axios.create({
  baseURL: `${SUPABASE_URL}/rest/v1`,
  headers: {
    apikey: SUPABASE_ANON_KEY,
    'Content-Type': 'application/json',
  },
})

// Request interceptor — attach auth token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('sb_token') || SUPABASE_ANON_KEY
  config.headers.Authorization = `Bearer ${token}`
  // For POST/PATCH return representation
  if (['post', 'patch', 'put'].includes(config.method)) {
    config.headers.Prefer = 'return=representation'
  }
  return config
})

// Response interceptor — handle errors globally
axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('sb_token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default axiosInstance
