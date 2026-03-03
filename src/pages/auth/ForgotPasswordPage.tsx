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
          <h2 className='text-2xl font-bold mb-2'>Email gửi thành công</h2>
          <p className='text-muted-foreground mb-6'>
            Kiểm tra email của bạn để nhận hướng dẫn reset mật khẩu. Link sẽ hết hạn sau 1 giờ.
          </p>
          <Button className='w-full mb-2' onClick={() => navigate('/login')}>
            Quay lại đăng nhập
          </Button>
          <Button
            variant='outline'
            className='w-full'
            onClick={() => {
              setForgotSuccess(false)
              setForgotEmail('')
            }}
          >
            Gửi lại email khác
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
          <h1 className='text-2xl font-bold'>Quên mật khẩu</h1>
          <p className='text-muted-foreground mt-2'>Nhập email của bạn, chúng tôi sẽ gửi hướng dẫn reset mật khẩu</p>
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
            {forgotLoading ? 'Đang gửi...' : 'Gửi hướng dẫn reset'}
          </Button>
        </form>

        <div className='mt-6 text-center'>
          <button onClick={() => navigate('/login')} className='text-primary hover:underline text-sm font-medium'>
            Quay lại đăng nhập
          </button>
        </div>
      </Card>
    </div>
  )
}

export default ForgotPasswordPage
