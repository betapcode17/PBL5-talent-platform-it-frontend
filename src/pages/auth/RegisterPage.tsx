import { SignupForm } from '@/components/signup-form'

const RegisterPage = () => {
  return (
    <div className='flex min-h-screen items-center justify-center bg-muted p-4'>
      <div className='w-full max-w-4xl'>
        <SignupForm />
      </div>
    </div>
  )
}

export default RegisterPage
