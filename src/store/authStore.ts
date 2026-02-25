import type { User } from '@/@types/user'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { loginApi, logoutApi, registerApi } from '@/api/auth'
import type { AxiosError } from 'axios'
import type { ApiErrorResponse, LoginRequest, RegisterRequest } from '@/@types/auth'

interface AuthState {
  // State
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  isShowPassword: boolean
  error: string | null

  // Actions
  setAuth: (user: User, token: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setShowPassword: (isShowPassword: boolean) => void
  login: (data: LoginRequest) => Promise<User | null>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthState>()(
  // persist middleware: Tự động lưu state vào localStorage
  persist(
    (set) => ({
      // initial state
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      isShowPassword: false,
      error: null,

      // action

      // Set auth sau khi đăng nhập thành công
      setAuth: (user, token) => {
        console.log('[AuthStore] setAuth called')
        console.log('[AuthStore] User:', user)
        console.log('[AuthStore] Token:', token?.substring(0, 20) + '...')

        // Lưu token vào localStorage (cho axios interceptor)
        localStorage.setItem('accessToken', token)

        set({
          user,
          accessToken: token,
          isAuthenticated: true,
          isLoading: false,
          isShowPassword: false,
          error: null
        })
        console.log('[AuthStore] Auth state updated successfully')
      },

      // Set loading state
      setLoading: (loading) => {
        console.log('[AuthStore] setLoading:', loading)
        set({ isLoading: loading })
      },

      // Set error message
      setError: (error) => {
        console.log('[AuthStore] setError:', error)
        set({ error, isLoading: false })
      },

      // Clear error
      clearError: () => {
        console.log('[AuthStore] clearError called')
        set({ error: null })
      },

      // showPassword
      setShowPassword: (showPassword) => {
        console.log('[AuthStore] setShowPassword:', showPassword)
        set({ isShowPassword: showPassword })
      },

      // Login: gọi API và cập nhật state
      login: async (data) => {
        console.log('========== LOGIN DEBUG ==========')
        console.log('[AuthStore] login called with:', data.email)

        try {
          // 1. Clear error cũ và set loading
          set({ error: null, isLoading: true })
          console.log('[AuthStore] isLoading set to true, calling API...')

          // 2. Gọi API login
          console.log('[AuthStore] Calling loginApi...')
          const response = await loginApi(data)
          console.log('[AuthStore] API Response:', response)
          console.log('[AuthStore] User:', response.user)
          console.log('[AuthStore] Token:', response.access_token?.substring(0, 20) + '...')

          // 3. Lưu token vào localStorage
          localStorage.setItem('accessToken', response.access_token)

          // 4. Cập nhật state
          set({
            user: response.user,
            accessToken: response.access_token,
            isAuthenticated: true,
            isLoading: false,
            error: null
          })
          console.log('[AuthStore] Auth state updated successfully')
          console.log('========== END LOGIN DEBUG ==========')

          // 5. Return user để component handle navigation
          return response.user
        } catch (err) {
          console.log('========== LOGIN ERROR ==========')
          console.error('[AuthStore] Raw error:', err)
          const axiosError = err as AxiosError<ApiErrorResponse>
          console.error('[AuthStore] Response status:', axiosError.response?.status)
          console.error('[AuthStore] Response data:', axiosError.response?.data)
          const errorMessage = axiosError.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.'

          console.error('[AuthStore] Error message:', errorMessage)
          set({ error: errorMessage, isLoading: false })
          console.log('========== END LOGIN DEBUG ==========')
          return null
        }
      },
      //register
      register: async (data) => {
        console.log('========== REGISTER DEBUG ==========')
        console.log('[AuthStore] REGISTER called with:', data.email)
        try {
          set({ error: null, isLoading: true })
          console.log('[AuthStore] isLoading set to true, calling API...')

          console.log('[AuthStore] Calling registerApi...')
          const response = await registerApi(data)
          console.log('[AuthStore] API Response:', response)
          console.log('[AuthStore] Message:', response.message)
          set({ isLoading: false, error: null })
          console.log('========== END REGISTER DEBUG ==========')
        } catch (err) {
          console.log('========== REGISTER ERROR ==========')
          console.error('[AuthStore] Raw error:', err)
          const axiosError = err as AxiosError<ApiErrorResponse>
          console.error('[AuthStore] Response status:', axiosError.response?.status)
          console.error('[AuthStore] Response data:', axiosError.response?.data)
          const errorMessage = axiosError.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.'

          console.error('[AuthStore] Error message:', errorMessage)
          set({ error: errorMessage, isLoading: false })
          console.log('========== END REGISTER DEBUG ==========')
          // Throw error để component có thể catch
          throw new Error(errorMessage)
        }
      },
      // Logout: clear tất cả state và gọi API
      logout: async () => {
        console.log('[AuthStore] logout called')

        try {
          // Gọi API logout để invalidate token ở server
          await logoutApi()
          console.log('[AuthStore] Logout API called successfully')
        } catch (error) {
          console.error('[AuthStore] Logout API error:', error)
          // Vẫn tiếp tục clear local state dù API fail
        }

        // Xóa token khỏi localStorage
        localStorage.removeItem('accessToken')

        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          isLoading: false,
          isShowPassword: false,
          error: null
        })
        console.log('[AuthStore] User logged out, state cleared')
      }
    }),
    {
      name: 'auth-storage', // Key trong localStorage
      storage: createJSONStorage(() => localStorage),
      // Chỉ persist những field cần thiết (không lưu isLoading, error)
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)
