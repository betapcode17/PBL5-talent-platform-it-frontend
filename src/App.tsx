import { BrowserRouter } from 'react-router-dom'
import './App.css'
import { LoginForm } from './components/login-form'

function App() {
  return (
    <BrowserRouter>
      <div className='flex min-h-screen items-center justify-center bg-background p-4'>
        <LoginForm className='w-full max-w-4xl' />
      </div>
    </BrowserRouter>
  )
}

export default App
