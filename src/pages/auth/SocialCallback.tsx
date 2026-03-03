import { useEffect, useRef } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { facebookCallbackApi, githubCallbackApi } from '@/api/auth'
import { useAuthStore } from '@/store/authStore'

const SUPPORTED_PROVIDERS = ['github', 'facebook'] as const

type Provider = (typeof SUPPORTED_PROVIDERS)[number]

const SocialCallback = () => {
  const [searchParams] = useSearchParams()
  const { provider } = useParams<{ provider: string }>()
  const navigate = useNavigate()
  const { error, redirectByRole } = useAuth()
  const { setAuth } = useAuthStore()
  const hasProcessed = useRef(false)

  useEffect(() => {
    const processCallback = async () => {
      if (hasProcessed.current) return
      hasProcessed.current = true

      if (!provider || !SUPPORTED_PROVIDERS.includes(provider as Provider)) {
        navigate('/login?error=unsupported_provider')
        return
      }

      const typedProvider = provider as Provider
      const code = searchParams.get('code')
      const errorParam = searchParams.get('error')
      const state = searchParams.get('state')
      const savedState = sessionStorage.getItem(`${typedProvider}_oauth_state`)

      console.log(`[SocialCallback] Provider: ${typedProvider}, Code: ${code ? 'present' : 'missing'}`)

      if (errorParam) {
        console.error(`[SocialCallback] Error from ${typedProvider}: ${errorParam}`)
        navigate(`/login?error=${typedProvider}_auth_failed`)
        return
      }

      if (!code) {
        console.error(`[SocialCallback] No code received from ${typedProvider}`)
        navigate(`/login?error=${typedProvider}_no_code`)
        return
      }

      if (savedState && (!state || state !== savedState)) {
        navigate(`/login?error=${typedProvider}_invalid_state`)
        return
      }

      sessionStorage.removeItem(`${typedProvider}_oauth_state`)

      try {
        const data = typedProvider === 'github' ? await githubCallbackApi(code) : await facebookCallbackApi(code)

        setAuth(data.user, data.access_token)
        redirectByRole(data.user)
      } catch (callbackError: any) {
        console.error('[SocialCallback] Error:', callbackError)
        const errorMessage = callbackError.response?.data?.message || 'Có lỗi xảy ra'
        console.error(`[SocialCallback] ${typedProvider} login failed:`, errorMessage)
        navigate(`/login?error=${typedProvider}_unknown`)
      }
    }

    processCallback()
  }, [provider, searchParams, navigate, redirectByRole, setAuth])

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
          <p className='text-muted-foreground'>Đang xử lý đăng nhập mạng xã hội...</p>
        </>
      )}
    </div>
  )
}

export default SocialCallback
