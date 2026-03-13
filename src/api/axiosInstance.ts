// src/lib/axios.ts
import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'

const apiBaseUrl = import.meta.env.VITE_BACKEND_API_URL || import.meta.env.VITE_API_URL || 'http://localhost:4000'
const aiApiBaseUrl = import.meta.env.VITE_AI_API_URL || 'http://127.0.0.1:8000'

const attachRequestInterceptors = (instance: AxiosInstance, requestPrefix: string) => {
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem('accessToken')

      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
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

const axiosInstance = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
})

export const aiAxiosInstance = axios.create({
  baseURL: aiApiBaseUrl,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: false
})

// Tự động thêm token vào header trước khi gửi request
attachRequestInterceptors(axiosInstance, 'API')
attachRequestInterceptors(aiAxiosInstance, 'AI API')

// Xử lý response và lỗi 401 (Unauthorized)
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.status} ${response.config.url}`)
    return response
  },
  async (error: AxiosError) => {
    const status = error.response?.status
    const requestUrl = error.config?.url

    console.error(`[API Error] Status: ${status}, URL: ${requestUrl}`)

    // Nếu lỗi 401 (token hết hạn hoặc không hợp lệ)
    // CHỈ redirect nếu KHÔNG phải đang ở trang login
    if (status === 401 && !requestUrl?.includes('/auth/login')) {
      console.warn('[API] Unauthorized - Redirecting to login')
      // Xóa token và redirect về trang login
      localStorage.removeItem('accessToken')
      localStorage.removeItem('auth-storage')
      window.location.href = '/login'
    }

    // Nếu lỗi 403 (không có quyền)
    if (status === 403) {
      console.warn('[API] Forbidden - Access denied')
    }

    // Nếu lỗi 500 (server error)
    if (status && status >= 500) {
      console.error('[API] Server error')
    }

    return Promise.reject(error)
  }
)

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
