import type { User } from '@/@types/user'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

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
  logout: () => void
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
      },

      // Set loading state
      setLoading: (loading) => set({ isLoading: loading }),

      // Set error message
      setError: (error) => set({ error, isLoading: false }),

      // Clear error
      clearError: () => set({ error: null }),

      // showPassword
      setShowPassword: (showPassword) => set({ isShowPassword: showPassword }),
      // Logout: clear tất cả state
      logout: () => {
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
