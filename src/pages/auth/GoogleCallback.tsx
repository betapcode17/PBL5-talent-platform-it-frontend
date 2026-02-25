import { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

const GoogleCallback = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { error } = useAuth()
  const hasProcessed = useRef(false)

  useEffect(() => {
    const processCallback = async () => {
      // Tránh gọi 2 lần trong StrictMode
      if (hasProcessed.current) return
      hasProcessed.current = true

      const code = searchParams.get('code')
      const errorParam = searchParams.get('error')

      console.log('[GoogleCallback] Processing callback')
      console.log('[GoogleCallback] Code:', code ? 'present' : 'missing')
      console.log('[GoogleCallback] Error param:', errorParam)

      // Nếu user cancel hoặc có lỗi từ Google
      if (errorParam) {
        console.error('[GoogleCallback] Error from Google:', errorParam)
        navigate('/login?error=google_auth_failed')
        return
      }

      // Nếu không có code
      if (!code) {
        console.error('[GoogleCallback] No code received')
        navigate('/login?error=no_code')
        return
      }

      // Gọi API để xử lý code
      try {
        const response = await fetch('/api/auth/google/callback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code })
        })

        if (!response.ok) {
          console.error('[GoogleCallback] Login failed')
          navigate('/login?error=login_failed')
          return
        }

        const data = await response.json()
        if (data.user) {
          navigate('/dashboard')
        }
      } catch (err) {
        console.error('[GoogleCallback] Error:', err)
        navigate('/login?error=unknown')
      }
    }

    processCallback()
  }, [searchParams, navigate])

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
