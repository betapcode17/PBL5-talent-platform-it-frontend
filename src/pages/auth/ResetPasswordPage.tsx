import { useEffect } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Lock, Check, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Alert } from '@/components/ui/alert'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '@/store/authStore'

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams()
  const {
    resetNewPassword,
    resetConfirmPassword,
    resetLoading,
    resetError,
    resetSuccess,
    setResetNewPassword,
    setResetConfirmPassword,
    setResetError,
    submitResetPassword
  } = useAuthStore()
  const navigate = useNavigate()
  const params = useParams<{ token?: string }>()

  const token = searchParams.get('token') ?? params.token ?? null

  useEffect(() => {
    if (!token) {
      setResetError('Link reset mật khẩu không hợp lệ')
    }
  }, [setResetError, token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await submitResetPassword(token)
    if (success) {
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    }
  }

  if (resetSuccess) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4'>
        <Card className='w-full max-w-md p-8 text-center'>
          <div className='flex justify-center mb-4'>
            <div className='bg-green-100 rounded-full p-4'>
              <Check className='h-8 w-8 text-green-600' />
            </div>
          </div>
          <h2 className='text-2xl font-bold mb-2'>Đặt lại mật khẩu thành công</h2>
          <p className='text-muted-foreground mb-6'>
            Mật khẩu của bạn đã được thay đổi. Đang chuyển hướng đến trang đăng nhập...
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4'>
      <Card className='w-full max-w-md p-8'>
        <div className='text-center mb-8'>
          <Lock className='h-12 w-12 mx-auto text-primary mb-4' />
          <h1 className='text-2xl font-bold'>Đặt lại mật khẩu</h1>
          <p className='text-muted-foreground mt-2'>Nhập mật khẩu mới của bạn</p>
        </div>

        {resetError && (
          <Alert variant='destructive' className='mb-6'>
            <AlertCircle className='h-4 w-4' />
            <span>{resetError}</span>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div>
            <Label htmlFor='password'>Mật khẩu mới</Label>
            <Input
              id='password'
              type='password'
              placeholder='Nhập mật khẩu mới'
              value={resetNewPassword}
              onChange={(e) => setResetNewPassword(e.target.value)}
              disabled={resetLoading || !token}
              className='mt-2'
            />
            <p className='text-xs text-muted-foreground mt-1'>Tối thiểu 8 ký tự</p>
          </div>

          <div>
            <Label htmlFor='confirm'>Xác nhận mật khẩu</Label>
            <Input
              id='confirm'
              type='password'
              placeholder='Nhập lại mật khẩu'
              value={resetConfirmPassword}
              onChange={(e) => setResetConfirmPassword(e.target.value)}
              disabled={resetLoading || !token}
              className='mt-2'
            />
          </div>

          <Button type='submit' className='w-full' disabled={resetLoading || !token}>
            {resetLoading ? 'Đang đặt lại...' : 'Đặt lại mật khẩu'}
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

export default ResetPasswordPage
