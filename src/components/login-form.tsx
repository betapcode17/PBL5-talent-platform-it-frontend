import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Briefcase, CheckCircle } from 'lucide-react'

export function LoginForm({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className='overflow-hidden p-0'>
        <CardContent className='grid p-0 md:grid-cols-2'>
          <form className='p-6 md:p-8'>
            <FieldGroup>
              <div className='flex flex-col items-center gap-2 text-center'>
                <h1 className='text-2xl font-bold'>Welcome back</h1>
                <p className='text-muted-foreground text-balance'>Login to your Acme Inc account</p>
              </div>
              <Field>
                <FieldLabel htmlFor='email'>Email</FieldLabel>
                <Input id='email' type='email' placeholder='m@example.com' required />
              </Field>
              <Field>
                <div className='flex items-center'>
                  <FieldLabel htmlFor='password'>Password</FieldLabel>
                  <a href='#' className='ml-auto text-sm underline-offset-2 hover:underline'>
                    Forgot your password?
                  </a>
                </div>
                <Input id='password' type='password' required />
              </Field>
              <Field>
                <Button type='submit'>Login</Button>
              </Field>
              <FieldSeparator className='*:data-[slot=field-separator-content]:bg-card'>
                Or continue with
              </FieldSeparator>
              <Field className='grid grid-cols-3 gap-4'>
                <Button variant='outline' type='button'>
                  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
                    <path
                      d='M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z'
                      fill='currentColor'
                    />
                  </svg>
                  <span className='sr-only'>Login with GitHub</span>
                </Button>
                <Button variant='outline' type='button'>
                  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
                    <path
                      d='M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z'
                      fill='currentColor'
                    />
                  </svg>
                  <span className='sr-only'>Login with Google</span>
                </Button>
                <Button variant='outline' type='button'>
                  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
                    <path
                      d='M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z'
                      fill='currentColor'
                    />
                  </svg>
                  <span className='sr-only'>Login with Meta</span>
                </Button>
              </Field>
              <FieldDescription className='text-center'>
                Don&apos;t have an account? <a href='#'>Sign up</a>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className='relative hidden md:flex flex-col items-center justify-center p-8 bg-gradient-to-br from-violet-500 to-purple-600 text-white'>
            {/* Logo icon */}
            <div className='mb-8 p-6 bg-white/20 rounded-2xl backdrop-blur-sm'>
              <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='w-16 h-16'>
                <circle cx='12' cy='12' r='3' />
                <circle cx='12' cy='4' r='2' />
                <circle cx='12' cy='20' r='2' />
                <circle cx='4' cy='12' r='2' />
                <circle cx='20' cy='12' r='2' />
                <circle cx='6.34' cy='6.34' r='2' />
                <circle cx='17.66' cy='17.66' r='2' />
                <circle cx='6.34' cy='17.66' r='2' />
                <circle cx='17.66' cy='6.34' r='2' />
                <line x1='12' y1='9' x2='12' y2='6' stroke='currentColor' strokeWidth='1.5' />
                <line x1='12' y1='18' x2='12' y2='15' stroke='currentColor' strokeWidth='1.5' />
                <line x1='9' y1='12' x2='6' y2='12' stroke='currentColor' strokeWidth='1.5' />
                <line x1='18' y1='12' x2='15' y2='12' stroke='currentColor' strokeWidth='1.5' />
              </svg>
            </div>
            {/* Title */}
            <h2 className='text-3xl font-bold text-center mb-4'>Launch your tech career in Vietnam.</h2>
            {/* Description */}
            <p className='text-center text-white/80 mb-8 max-w-xs'>
              Join 50,000+ developers finding their dream jobs at top-tier tech companies.
            </p>
            <div className='flex gap-4'>
              <div className='flex flex-col items-center px-6 py-4 bg-white/20 rounded-xl backdrop-blur-sm'>
                <Briefcase className='w-6 h-6 mb-2' />
                <span className='text-sm font-semibold'>2,000+ Active Jobs</span>
              </div>
              <div className='flex flex-col items-center px-6 py-4 bg-white/20 rounded-xl backdrop-blur-sm'>
                <CheckCircle className='w-6 h-6 mb-2' />
                <span className='text-sm font-semibold'>Verified Companies</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <FieldDescription className='px-6 text-center'>
        By clicking continue, you agree to our <a href='#'>Terms of Service</a> and <a href='#'>Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}
