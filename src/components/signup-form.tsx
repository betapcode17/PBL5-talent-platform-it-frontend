import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from './ui/card'
import { Eye, EyeOff, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useForm } from 'react-hook-form'
import { type RegisterFormData, registerSchema } from '@/validators'
import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, AlertDescription } from './ui/alert'
import { useState } from 'react'

export function SignupForm({ className, ...props }: React.ComponentProps<'div'>) {
  const navigate = useNavigate()
  const { register: registerUser, isLoading, error, clearError } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  })

  const onSubmit = async (data: RegisterFormData) => {
    console.log('[SignupForm] Form submitted:', data)
    clearError()

    try {
      await registerUser({
        fullname: data.fullName,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        role: 'SEEKER' // Default role
      })

      // Nếu không có error thì hiển thị thành công
      setIsSuccess(true)

      // Redirect về login sau 2 giây
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (err) {
      console.error('[SignupForm] Registration error:', err)
    }
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className='overflow-hidden p-0'>
        <CardContent className='grid p-0 md:grid-cols-2'>
          <div className='relative hidden md:flex flex-col justify-between p-8 bg-linear-to-br from-violet-400 via-violet-500 to-purple-600 text-white rounded-r-xl'>
            {/* Logo */}
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 bg-white rounded-lg flex items-center justify-center'>
                <svg viewBox='0 0 24 24' className='w-6 h-6 text-violet-600' fill='currentColor'>
                  <rect x='3' y='3' width='7' height='7' rx='1' />
                  <rect x='14' y='3' width='7' height='7' rx='1' />
                  <rect x='3' y='14' width='7' height='7' rx='1' />
                  <rect x='14' y='14' width='7' height='7' rx='1' />
                </svg>
              </div>
              <span className='text-xl font-bold'>TalentPlatformIT</span>
            </div>

            {/* Main Content */}
            <div className='flex-1 flex flex-col justify-center'>
              <h2 className='text-3xl font-bold leading-tight mb-4'>Connect with Vietnam's Top Tech Talents</h2>
              <p className='text-white/80 text-sm leading-relaxed'>
                Access over 5,000+ curated developer profiles and the latest high-paying tech opportunities in Ho Chi
                Minh City, Hanoi, and Da Nang.
              </p>
            </div>

            {/* Testimonial Card */}
            <div className='bg-white/20 backdrop-blur-sm rounded-xl p-5'>
              {/* Stars */}
              <div className='flex gap-1 mb-3'>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className='w-4 h-4 fill-yellow-400 text-yellow-400' />
                ))}
              </div>
              {/* Quote */}
              <p className='text-sm italic text-white/90 mb-4'>
                "TalentPlatformIT helped me land my Senior Dev role at a top fintech firm within 2 weeks. The platform
                is incredibly efficient."
              </p>
              {/* Author */}
              <div className='flex items-center gap-3'>
                <img
                  src='https://i.pravatar.cc/40?img=11'
                  alt='Minh Nguyen'
                  className='w-10 h-10 rounded-full object-cover'
                />
                <div>
                  <p className='font-semibold text-sm'>Tran Quoc Dat</p>
                  <p className='text-xs text-white/70'>Senior Fullstack Developer</p>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className='absolute top-1/2 right-8 opacity-10'>
              <svg viewBox='0 0 100 100' className='w-32 h-32' fill='currentColor'>
                <rect x='10' y='10' width='30' height='30' rx='4' />
                <rect x='60' y='10' width='30' height='30' rx='4' />
                <rect x='10' y='60' width='30' height='30' rx='4' />
                <rect x='60' y='60' width='30' height='30' rx='4' />
              </svg>
            </div>
          </div>

          {/* Form Section */}
          <form className='p-6 md:p-8' onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <div className='flex flex-col items-center gap-1 text-center'>
                <h1 className='text-2xl font-bold'>Create your account</h1>
                <p className='text-muted-foreground text-sm text-balance'>
                  Fill in the form below to create your account
                </p>
              </div>

              {/* Success message */}
              {isSuccess && (
                <Alert className='bg-green-50 border-green-200'>
                  <AlertDescription className='text-green-800'>
                    Đăng ký thành công! Đang chuyển hướng đến trang đăng nhập...
                  </AlertDescription>
                </Alert>
              )}

              {/* Error message */}
              {error && (
                <Alert variant='destructive'>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Full Name */}
              <Field>
                <FieldLabel htmlFor='fullName'>Full Name</FieldLabel>
                <Input
                  id='fullName'
                  type='text'
                  placeholder='Nguyễn Văn A'
                  {...register('fullName')}
                  className={cn(errors.fullName && 'border-destructive')}
                  disabled={isLoading || isSuccess}
                />
                {errors.fullName && <p className='text-sm text-destructive'>{errors.fullName.message}</p>}
              </Field>

              {/* Email */}
              <Field>
                <FieldLabel htmlFor='email'>Email</FieldLabel>
                <Input
                  id='email'
                  type='email'
                  placeholder='example@email.com'
                  {...register('email')}
                  className={cn(errors.email && 'border-destructive')}
                  disabled={isLoading || isSuccess}
                />
                {errors.email && <p className='text-sm text-destructive'>{errors.email.message}</p>}
                <FieldDescription>Chúng tôi sẽ không chia sẻ email của bạn với bất kỳ ai.</FieldDescription>
              </Field>

              {/* Password */}
              <Field>
                <FieldLabel htmlFor='password'>Password</FieldLabel>
                <div className='relative'>
                  <Input
                    id='password'
                    type={showPassword ? 'text' : 'password'}
                    placeholder='••••••••'
                    {...register('password')}
                    className={cn(errors.password && 'border-destructive', 'pr-10')}
                    disabled={isLoading || isSuccess}
                  />
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon'
                    className='absolute right-0 top-0 h-full px-3 hover:bg-transparent'
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className='h-4 w-4 text-muted-foreground' />
                    ) : (
                      <Eye className='h-4 w-4 text-muted-foreground' />
                    )}
                  </Button>
                </div>
                {errors.password && <p className='text-sm text-destructive'>{errors.password.message}</p>}
                <FieldDescription>Ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.</FieldDescription>
              </Field>

              {/* Confirm Password */}
              <Field>
                <FieldLabel htmlFor='confirmPassword'>Confirm Password</FieldLabel>
                <div className='relative'>
                  <Input
                    id='confirmPassword'
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder='••••••••'
                    {...register('confirmPassword')}
                    className={cn(errors.confirmPassword && 'border-destructive', 'pr-10')}
                    disabled={isLoading || isSuccess}
                  />
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon'
                    className='absolute right-0 top-0 h-full px-3 hover:bg-transparent'
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className='h-4 w-4 text-muted-foreground' />
                    ) : (
                      <Eye className='h-4 w-4 text-muted-foreground' />
                    )}
                  </Button>
                </div>
                {errors.confirmPassword && <p className='text-sm text-destructive'>{errors.confirmPassword.message}</p>}
              </Field>

              {/* Submit Button */}
              <Field>
                <Button type='submit' disabled={isLoading || isSuccess} className='w-full'>
                  {isLoading ? 'Đang xử lý...' : 'Tạo tài khoản'}
                </Button>
              </Field>

              <FieldSeparator>Or continue with</FieldSeparator>

              <Field>
                <Button variant='outline' type='button' className='w-full' disabled={isLoading || isSuccess}>
                  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' className='w-5 h-5 mr-2'>
                    <path
                      d='M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12'
                      fill='currentColor'
                    />
                  </svg>
                  Sign up with GitHub
                </Button>
              </Field>

              <FieldDescription className='text-center'>
                Đã có tài khoản?{' '}
                <a href='/login' className='text-primary hover:underline'>
                  Đăng nhập
                </a>
              </FieldDescription>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
