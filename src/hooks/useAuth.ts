import { useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { initializeGoogleSignIn, renderGoogleButton, type GoogleCredentialResponse } from '@/config/google.config'
import type { User } from '@/@types/user'

export const useAuth = () => {
  const navigate = useNavigate()
  const googleInitialized = useRef(false)
  const googleScriptLoading = useRef<Promise<void> | null>(null)
  const {
    user,
    isAuthenticated,
    isLoading,
    isShowPassword,
    error,
    login,
    loginWithGoogle,
    logout,
    clearError,
    setShowPassword
  } = useAuthStore()
  const redirectByRole = useCallback(
    (user: User) => {
      console.log('[useAuth] redirectByRole:', user.role)
      switch (user.role) {
        case 'SEEKER':
          navigate('/seeker/dashboard')
          break
        case 'EMPLOYER':
          navigate('/employer/dashboard')
          break
        case 'ADMIN':
          navigate('/admin/dashboard')
          break
        default:
          navigate('/')
      }
    },
    [navigate]
  )

  // Handle Google credential callback from GIS
  const handleGoogleCredential = useCallback(
    async (response: GoogleCredentialResponse) => {
      console.log('[useAuth] handleGoogleCredential called')
      console.log('[useAuth] Credential received:', response.credential ? 'present' : 'missing')

      try {
        const user = await loginWithGoogle(response.credential)

        if (user) {
          console.log('[useAuth] Google login success, redirecting...')
          redirectByRole(user)
        }
      } catch (err) {
        console.error('[useAuth] Google login error:', err)
      }
    },
    [loginWithGoogle, redirectByRole]
  )

  const ensureGoogleScriptLoaded = useCallback(async () => {
    if (window.google) return
    if (googleScriptLoading.current) {
      await googleScriptLoading.current
      return
    }

    googleScriptLoading.current = new Promise<void>((resolve, reject) => {
      const existingScript = document.querySelector<HTMLScriptElement>(
        'script[src="https://accounts.google.com/gsi/client"]'
      )

      if (existingScript) {
        existingScript.addEventListener('load', () => resolve(), { once: true })
        existingScript.addEventListener('error', () => reject(new Error('Không thể tải Google Identity Services')), {
          once: true
        })
        return
      }

      const script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      script.onload = () => resolve()
      script.onerror = () => reject(new Error('Không thể tải Google Identity Services'))
      document.head.appendChild(script)
    })

    await googleScriptLoading.current
  }, [])

  // Initialize Google Sign-In and render button
  const initGoogleSignIn = useCallback(
    (buttonElementId: string) => {
      const initialize = async () => {
        try {
          await ensureGoogleScriptLoaded()

          if (!googleInitialized.current) {
            console.log('[useAuth] Initializing Google Sign-In...')
            initializeGoogleSignIn(handleGoogleCredential)
            googleInitialized.current = true
          } else {
            console.log('[useAuth] Google already initialized, just rendering button')
          }

          renderGoogleButton(buttonElementId)
        } catch (err) {
          console.error('[useAuth] initGoogleSignIn error:', err)
        }
      }

      void initialize()
    },
    [ensureGoogleScriptLoaded, handleGoogleCredential]
  )

  const handleGoogleLogin = useCallback(() => {
    const loginWithPrompt = async () => {
      console.log('[useAuth] handleGoogleLogin called')

      try {
        await ensureGoogleScriptLoaded()

        if (!googleInitialized.current) {
          initializeGoogleSignIn(handleGoogleCredential)
          googleInitialized.current = true
        }

        window.google?.accounts.id.prompt()
      } catch (err) {
        console.error('[useAuth] Google login init error:', err)
      }
    }

    void loginWithPrompt()
  }, [ensureGoogleScriptLoaded, handleGoogleCredential])

  const handleLogout = useCallback(async () => {
    console.log('[useAuth] handleLogout called')
    await logout()
    navigate('/login')
  }, [logout, navigate])

  // Toggle show password
  const toggleShowPassword = useCallback(() => {
    setShowPassword(!isShowPassword)
  }, [isShowPassword, setShowPassword])

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    isShowPassword,
    error,

    // Actions
    login,
    loginWithGoogle,
    logout: handleLogout,
    clearError,
    redirectByRole,
    initGoogleSignIn,
    handleGoogleLogin,
    handleGoogleCredential,
    setShowPassword,
    toggleShowPassword
  }
}
