import axios from 'axios'

const API_BASE = process.env.VITE_API_URL || 'http://localhost:5000' || 'http://localhost:5000'

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  withCredentials: true,
})

// Dev token from localStorage (set during dev-login)
const getDevToken = () => localStorage.getItem('algozen_dev_token')

// Clerk token interceptor — must be called with the getToken fn
export const setAuthInterceptor = (getToken) => {
  api.interceptors.request.use(async (config) => {
    // Try Clerk token first, fall back to dev token
    try {
      const token = await getToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
        return config
      }
    } catch {
      // Clerk not available
    }
    // Fall back to dev token
    const devToken = getDevToken()
    if (devToken) {
      config.headers.Authorization = `Bearer ${devToken}`
    }
    return config
  })
}

// Simple interceptor that only uses dev token (no Clerk)
export const setDevAuthInterceptor = () => {
  api.interceptors.request.use(async (config) => {
    const devToken = getDevToken()
    if (devToken) {
      config.headers.Authorization = `Bearer ${devToken}`
    }
    return config
  })
}

export default api
