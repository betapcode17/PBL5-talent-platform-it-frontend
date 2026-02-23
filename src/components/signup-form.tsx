import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from './ui/card'
import { Star } from 'lucide-react'

export function SignupForm({ className, ...props }: React.ComponentProps<'form'>) {
  return (
    <form className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className='overflow-hidden p-0'>
        <CardContent className='grid p-0 md:grid-cols-2'>
          <div className='relative hidden md:flex flex-col justify-between p-8 bg-gradient-to-br from-violet-400 via-violet-500 to-purple-600 text-white rounded-r-xl'>
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
          <form className='p-6 md:p-8'>
            <FieldGroup>
              <div className='flex flex-col items-center gap-1 text-center'>
                <h1 className='text-2xl font-bold'>Create your account</h1>
                <p className='text-muted-foreground text-sm text-balance'>
                  Fill in the form below to create your account
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor='name'>Full Name</FieldLabel>
                <Input id='name' type='text' placeholder='John Doe' required />
              </Field>
              <Field>
                <FieldLabel htmlFor='email'>Email</FieldLabel>
                <Input id='email' type='email' placeholder='m@example.com' required />
                <FieldDescription>
                  We&apos;ll use this to contact you. We will not share your email with anyone else.
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor='password'>Password</FieldLabel>
                <Input id='password' type='password' required />
                <FieldDescription>Must be at least 8 characters long.</FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor='confirm-password'>Confirm Password</FieldLabel>
                <Input id='confirm-password' type='password' required />
                <FieldDescription>Please confirm your password.</FieldDescription>
              </Field>
              <Field>
                <Button type='submit'>Create Account</Button>
              </Field>
              <FieldSeparator>Or continue with</FieldSeparator>
              <Field>
                <Button variant='outline' type='button'>
                  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
                    <path
                      d='M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12'
                      fill='currentColor'
                    />
                  </svg>
                  Sign up with GitHub
                </Button>
                <FieldDescription className='px-6 text-center'>
                  Already have an account? <a href='#'>Sign in</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </form>
  )
}
