// src/lib/axios.ts
import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
})

// Tự động thêm token vào header trước khi gửi request
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    //
    const token = localStorage.getItem('accessToken')

    //
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error: AxiosError) => {
    console.error(`[API Request Error]`, error)
    return Promise.reject(error)
  }
)

// Xử lý response và lỗi 401 (Unauthorized)
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.status} ${response.config.url}`)
    return response
  },
  async (error: AxiosError) => {
    const status = error.response?.status

    //// Nếu lỗi 401 (token hết hạn hoặc không hợp lệ)
    if (status === 401) {
      console.warn('[API] Unauthorized - Redirecting to login')
    }
    // Xóa token và redirect về trang login
    localStorage.removeItem('accessToken')
    localStorage.removeItem('auth-storage')
    window.location.href = '/login'

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

export default axiosInstance
