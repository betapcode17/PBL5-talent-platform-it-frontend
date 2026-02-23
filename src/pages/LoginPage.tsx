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
        case 'candidate':
          navigate('/candidate/dashboard')
          break
        case 'employer':
          navigate('/employer/dashboard')
          break
        case 'admin':
          navigate('/admin/dashboard')
          break
        default:
          navigate('/')
      }
    }
  }, [isAuthenticated, user, navigate])

  return (
    <div className='flex min-h-screen items-center justify-center bg-muted p-4'>
      <div className='w-full max-w-4xl'>
        <LoginForm />
      </div>
    </div>
  )
}
