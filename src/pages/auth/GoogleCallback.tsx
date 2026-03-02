import { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { googleCallbackApi, googleLoginApi } from '@/api/auth'
import { useAuthStore } from '@/store/authStore'

const GoogleCallback = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { error, redirectByRole } = useAuth()
  const { setAuth } = useAuthStore()
  const hasProcessed = useRef(false)

  useEffect(() => {
    const processCallback = async () => {
      // Tránh gọi 2 lần trong StrictMode
      if (hasProcessed.current) return
      hasProcessed.current = true

      const code = searchParams.get('code')
      const errorParam = searchParams.get('error')
      const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''))
      const idToken = hashParams.get('id_token')
      const state = hashParams.get('state') || searchParams.get('state')
      const savedState = sessionStorage.getItem('google_oauth_state')

      console.log('[GoogleCallback] Processing callback')
      console.log('[GoogleCallback] Code:', code ? 'present' : 'missing')
      console.log('[GoogleCallback] Error param:', errorParam)

      // Nếu user cancel hoặc có lỗi từ Google
      if (errorParam) {
        console.error('[GoogleCallback] Error from Google:', errorParam)
        navigate('/login?error=google_auth_failed')
        return
      }

      try {
        if (idToken) {
          if (!state || !savedState || state !== savedState) {
            console.error('[GoogleCallback] Invalid state received')
            navigate('/login?error=invalid_state')
            return
          }

          sessionStorage.removeItem('google_oauth_state')
          const data = await googleLoginApi(idToken)
          setAuth(data.user, data.access_token)
          redirectByRole(data.user)
          return
        }

        if (!code) {
          console.error('[GoogleCallback] No id_token/code received')
          navigate('/login?error=no_token')
          return
        }

        const data = await googleCallbackApi(code)
        setAuth(data.user, data.access_token)
        redirectByRole(data.user)
      } catch (err) {
        console.error('[GoogleCallback] Error:', err)
        navigate('/login?error=unknown')
      }
    }

    processCallback()
  }, [searchParams, navigate, redirectByRole, setAuth])

  // Hiển thị loading hoặc error
  return (
    <div className='flex min-h-screen flex-col items-center justify-center gap-4'>
      {error ? (
        <div className='text-center'>
          <p className='text-destructive text-lg'>{error}</p>
          <button onClick={() => navigate('/login')} className='mt-4 text-primary underline'>
            Quay lại trang đăng nhập
          </button>
        </div>
      ) : (
        <>
          <Loader2 className='h-12 w-12 animate-spin text-primary' />
          <p className='text-muted-foreground'>Đang xử lý đăng nhập với Google...</p>
        </>
      )}
    </div>
  )
}

export default GoogleCallback
