import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'
import i18n from '@/i18n'

declare module 'axios' {
  interface AxiosRequestConfig {
    skipAuthRedirect?: boolean
    skipErrorLog?: boolean
  }
}

// Base URLs
export const apiBaseUrl =
  import.meta.env.VITE_BACKEND_API_URL || import.meta.env.VITE_API_URL || 'http://localhost:4000'

export const aiApiBaseUrl = import.meta.env.VITE_AI_API_URL || 'http://127.0.0.1:8001'

const getActiveLanguage = () => {
  return (i18n.language || 'en').startsWith('vi') ? 'vi' : 'en'
}

// =========================
// REQUEST INTERCEPTOR
// =========================
const attachRequestInterceptors = (instance: AxiosInstance, requestPrefix: string) => {
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem('accessToken')
      const currentLang = getActiveLanguage()

      // Attach token nếu có
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }

      // Attach Accept-Language đồng bộ theo ngôn ngữ hiện tại
      if (config.headers) {
        config.headers['Accept-Language'] = currentLang === 'vi' ? 'vi,en;q=0.9' : 'en,vi;q=0.9'
      }

      // Nếu là FormData → KHÔNG set Content-Type
      if (config.data instanceof FormData) {
        delete config.headers['Content-Type']
      } else {
        // Nếu là JSON → set lại
        config.headers['Content-Type'] = 'application/json'
      }

      const logPrefix = currentLang === 'vi' ? `[${requestPrefix} Yêu cầu]` : `[${requestPrefix} Request]`
      console.log(`${logPrefix} ${config.method?.toUpperCase()} ${config.url}`)

      return config
    },
    (error: AxiosError) => {
      const isVi = getActiveLanguage() === 'vi'
      console.error(isVi ? `[${requestPrefix} Lỗi gửi yêu cầu]` : `[${requestPrefix} Request Error]`, error)
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
    const isVi = getActiveLanguage() === 'vi'
    const logPrefix = isVi ? '[API Phản hồi]' : '[API Response]'
    console.log(`${logPrefix} ${response.status} ${response.config.url}`)
    return response
  },
  async (error: AxiosError) => {
    if (axios.isCancel(error) || error.code === 'ERR_CANCELED') {
      return Promise.reject(error)
    }

    const isVi = getActiveLanguage() === 'vi'
    const status = error.response?.status
    const requestUrl = error.config?.url
    const skipAuthRedirect = error.config?.skipAuthRedirect === true
    const skipErrorLog = error.config?.skipErrorLog === true

    if (!skipErrorLog) {
      const label = isVi ? `[API Lỗi] Trạng thái: ${status}, URL: ${requestUrl}` : `[API Error] Status: ${status}, URL: ${requestUrl}`
      console.error(label)
    }

    if (status === 401 && !requestUrl?.includes('/auth/login') && !skipAuthRedirect) {
      console.warn(isVi ? '[API] Phiên hết hạn (401) - Chuyển hướng đến đăng nhập' : '[API] Unauthorized (401) - Redirecting to login')

      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('auth-storage')

      window.location.href = '/login'
    }

    if (status === 403 && !skipErrorLog) {
      console.warn(isVi ? '[API] Bị từ chối truy cập (403)' : '[API] Forbidden (403)')
    }

    if (status && status >= 500 && !skipErrorLog) {
      console.error(isVi ? '[API] Lỗi máy chủ (500+)' : '[API] Server error (500+)')
    }

    return Promise.reject(error)
  }
)

// AI API
aiAxiosInstance.interceptors.response.use(
  (response) => {
    const isVi = getActiveLanguage() === 'vi'
    const logPrefix = isVi ? '[AI API Phản hồi]' : '[AI API Response]'
    console.log(`${logPrefix} ${response.status} ${response.config.url}`)
    return response
  },
  (error: AxiosError) => {
    const isVi = getActiveLanguage() === 'vi'
    const status = error.response?.status
    const requestUrl = error.config?.url

    const label = isVi ? `[AI API Lỗi] Trạng thái: ${status}, URL: ${requestUrl}` : `[AI API Error] Status: ${status}, URL: ${requestUrl}`
    console.error(label)

    return Promise.reject(error)
  }
)

export default axiosInstance
