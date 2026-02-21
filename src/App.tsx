import './App.css'
import { SignupForm } from './components/signup-form'

function App() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-background p-4'>
      <SignupForm className='w-full max-w-4xl' />
    </div>
  )
}

export default App
