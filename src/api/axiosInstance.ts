import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'

// Base URLs
const apiBaseUrl = import.meta.env.VITE_BACKEND_API_URL || import.meta.env.VITE_API_URL || 'http://localhost:4000'

const aiApiBaseUrl = import.meta.env.VITE_AI_API_URL || 'http://127.0.0.1:8000'

// =========================
// REQUEST INTERCEPTOR
// =========================
const attachRequestInterceptors = (instance: AxiosInstance, requestPrefix: string) => {
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem('accessToken')

      // Attach token nếu có
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }

      // 🔥 FIX QUAN TRỌNG:
      // Nếu là FormData → KHÔNG set Content-Type
      if (config.data instanceof FormData) {
        delete config.headers['Content-Type']
      } else {
        // Nếu là JSON → set lại
        config.headers['Content-Type'] = 'application/json'
      }

      console.log(`[${requestPrefix} Request] ${config.method?.toUpperCase()} ${config.url}`)

      return config
    },
    (error: AxiosError) => {
      console.error(`[${requestPrefix} Request Error]`, error)
      return Promise.reject(error)
    }
  )
}

// =========================
// AXIOS INSTANCES
// =========================

// API thường
const axiosInstance = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true
})

// AI API (chatbot)
export const aiAxiosInstance = axios.create({
  baseURL: aiApiBaseUrl,
  withCredentials: false
})

// Gắn interceptor
attachRequestInterceptors(axiosInstance, 'API')
attachRequestInterceptors(aiAxiosInstance, 'AI API')

// =========================
// RESPONSE INTERCEPTORS
// =========================

// API thường
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.status} ${response.config.url}`)
    return response
  },
  async (error: AxiosError) => {
    const status = error.response?.status
    const requestUrl = error.config?.url

    console.error(`[API Error] Status: ${status}, URL: ${requestUrl}`)

    if (status === 401 && !requestUrl?.includes('/auth/login')) {
      console.warn('[API] Unauthorized - Redirecting to login')

      localStorage.removeItem('accessToken')
      localStorage.removeItem('auth-storage')

      window.location.href = '/login'
    }

    if (status === 403) {
      console.warn('[API] Forbidden')
    }

    if (status && status >= 500) {
      console.error('[API] Server error')
    }

    return Promise.reject(error)
  }
)

// AI API
aiAxiosInstance.interceptors.response.use(
  (response) => {
    console.log(`[AI API Response] ${response.status} ${response.config.url}`)
    return response
  },
  (error: AxiosError) => {
    const status = error.response?.status
    const requestUrl = error.config?.url

    console.error(`[AI API Error] Status: ${status}, URL: ${requestUrl}`)

    return Promise.reject(error)
  }
)

export default axiosInstance
