import { useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { initializeGoogleSignIn, renderGoogleButton, type GoogleCredentialResponse } from '@/config/google.config'
import type { User } from '@/@types/user'

export const useAuth = () => {
  const navigate = useNavigate()
  const googleAllowedOrigin = import.meta.env.VITE_GOOGLE_ALLOWED_ORIGIN || 'http://localhost:3000'
  const apiBaseUrl =
    (import.meta.env.VITE_BACKEND_API_URL as string)?.replace(/\/$/, '') ||
    (import.meta.env.VITE_API_URL as string)?.replace(/\/$/, '') ||
    'http://localhost:4000'
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

  const ensureAllowedGoogleOrigin = useCallback(() => {
    if (window.location.origin === googleAllowedOrigin) return true

    const redirectUrl = `${googleAllowedOrigin}${window.location.pathname}${window.location.search}${window.location.hash}`
    console.warn('[useAuth] Current origin is not allowed for Google Sign-In. Redirecting to:', redirectUrl)
    window.location.href = redirectUrl
    return false
  }, [googleAllowedOrigin])

  // Initialize Google Sign-In and render button
  const initGoogleSignIn = useCallback(
    (buttonElementId: string) => {
      const initialize = async () => {
        try {
          if (!ensureAllowedGoogleOrigin()) return
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
    [ensureAllowedGoogleOrigin, ensureGoogleScriptLoaded, handleGoogleCredential]
  )

  const handleGoogleLogin = useCallback(() => {
    console.log('[useAuth] handleGoogleLogin called')

    const redirectUri = `${googleAllowedOrigin}/auth/google/callback`
    const state = crypto.randomUUID()
    sessionStorage.setItem('google_oauth_state', state)

    const params = new URLSearchParams({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID as string,
      redirect_uri: redirectUri,
      response_type: 'id_token',
      scope: 'openid email profile',
      nonce: crypto.randomUUID(),
      state,
      prompt: 'select_account consent',
      max_age: '0'
    })

    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  }, [googleAllowedOrigin])

  const startSocialOAuthLogin = useCallback(
    (provider: 'github' | 'facebook') => {
      const state = crypto.randomUUID()
      sessionStorage.setItem(`${provider}_oauth_state`, state)

      const redirectUri = `${window.location.origin}/auth/${provider}/callback`
      const params = new URLSearchParams({
        redirect_uri: redirectUri,
        state
      })

      window.location.href = `${apiBaseUrl}/auth/${provider}?${params.toString()}`
    },
    [apiBaseUrl]
  )

  const handleGithubLogin = useCallback(() => {
    const githubClientId = import.meta.env.VITE_GITHUB_CLIENT_ID as string | undefined

    if (!githubClientId) {
      console.error('[useAuth] Missing VITE_GITHUB_CLIENT_ID')
      return
    }

    const state = crypto.randomUUID()
    sessionStorage.setItem('github_oauth_state', state)

    const redirectUri = `${window.location.origin}/auth/github/callback`
    const params = new URLSearchParams({
      client_id: githubClientId,
      redirect_uri: redirectUri,
      scope: 'read:user user:email',
      state
    })

    window.location.href = `https://github.com/login/oauth/authorize?${params.toString()}`
  }, [])

  const handleFacebookLogin = useCallback(() => {
    startSocialOAuthLogin('facebook')
  }, [startSocialOAuthLogin])

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
    handleGithubLogin,
    handleFacebookLogin,
    handleGoogleCredential,
    setShowPassword,
    toggleShowPassword
  }
}
