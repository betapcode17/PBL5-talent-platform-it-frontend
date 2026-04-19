import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LoginForm } from '@/components/login-form'
import { useAuthStore } from '@/store/authStore'

export default function LoginPage() {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuthStore()

  // Nếu đã đăng nhập, redirect về dashboard
  useEffect(() => {
    if (isAuthenticated && user) {
      switch (user.role) {
        case 'SEEKER':
          navigate('/seeker')
          break
        case 'EMPLOYEE':
          navigate('/employer')
          break
        case 'ADMIN':
          navigate('/')
          break
        default:
          navigate('/')
      }
    }
  }, [isAuthenticated, user, navigate])

  return (
    <div className='relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(168,85,247,0.14),_transparent_28%),linear-gradient(180deg,#f7f4ff_0%,#f8f8fc_100%)] px-4 py-10 sm:px-6 lg:px-8'>
      <div className='absolute left-0 top-20 h-72 w-72 rounded-full bg-violet-200/30 blur-3xl' />
      <div className='absolute right-0 top-0 h-80 w-80 rounded-full bg-fuchsia-200/30 blur-3xl' />
      <div className='absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-violet-300/20 blur-3xl' />

      <div className='relative w-full max-w-5xl'>
        <LoginForm />
      </div>
    </div>
  )
}
