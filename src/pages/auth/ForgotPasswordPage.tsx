import { useNavigate } from 'react-router-dom'
import { Mail, Check, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Alert } from '@/components/ui/alert'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '@/store/authStore'

const ForgotPasswordPage = () => {
  const {
    forgotEmail,
    forgotLoading,
    forgotError,
    forgotSuccess,
    setForgotEmail,
    setForgotSuccess,
    submitForgotPassword
  } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await submitForgotPassword()
  }

  if (forgotSuccess) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4'>
        <Card className='w-full max-w-md p-8 text-center'>
          <div className='flex justify-center mb-4'>
            <div className='bg-green-100 rounded-full p-4'>
              <Check className='h-8 w-8 text-green-600' />
            </div>
          </div>
          <h2 className='text-2xl font-bold mb-2'>Email sent successfully</h2>
          <p className='text-muted-foreground mb-6'>
            Check your email for password reset instructions. The link will expire in 1 hour.
          </p>
          <Button className='w-full mb-2' onClick={() => navigate('/login')}>
            Back to login
          </Button>
          <Button
            variant='outline'
            className='w-full'
            onClick={() => {
              setForgotSuccess(false)
              setForgotEmail('')
            }}
          >
            Send another email
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4'>
      <Card className='w-full max-w-md p-8'>
        <div className='text-center mb-8'>
          <Mail className='h-12 w-12 mx-auto text-primary mb-4' />
          <h1 className='text-2xl font-bold'>Forgot password</h1>
          <p className='text-muted-foreground mt-2'>Enter your email and we'll send you password reset instructions</p>
        </div>

        {forgotError && (
          <Alert variant='destructive' className='mb-6'>
            <AlertCircle className='h-4 w-4' />
            <span>{forgotError}</span>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div>
            <Label htmlFor='email'>Email</Label>
            <Input
              id='email'
              type='email'
              placeholder='your.email@example.com'
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              disabled={forgotLoading}
              className='mt-2'
            />
          </div>

          <Button type='submit' className='w-full' disabled={forgotLoading}>
            {forgotLoading ? 'Sending...' : 'Send reset instructions'}
          </Button>
        </form>

        <div className='mt-6 text-center'>
          <button onClick={() => navigate('/login')} className='text-primary hover:underline text-sm font-medium'>
            Back to login
          </button>
        </div>
      </Card>
    </div>
  )
}

export default ForgotPasswordPage
