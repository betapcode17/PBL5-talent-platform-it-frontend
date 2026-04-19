import { Menu, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PrimaryButton } from '@/components/ui/Buttons'
import Container from '@/components/ui/Container'
import Logo from '@/components/ui/Logo'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'
import { LogOut, MessageCircle } from 'lucide-react'
import EmployeeHeader from '@/components/employer/EmployeeHeader'

const Header = () => {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const { isAuthenticated, logout, user } = useAuthStore()

  // Move useMemo to top level (before any conditional returns)
  const dashboardPath = useMemo(() => {
    switch (user?.role) {
      case 'ADMIN':
        return '/admin'
      case 'EMPLOYEE':
        return '/employer'
      case 'SEEKER':
        return '/seeker'
      default:
        return '/login'
    }
  }, [user?.role])

  // Render EmployeeHeader for EMPLOYEE role
  if (isAuthenticated && user?.role === 'EMPLOYEE') {
    return <EmployeeHeader />
  }

  const closeMenu = () => setIsOpen(false)

  const handleLogout = async () => {
    await logout()
    closeMenu()
    navigate('/login')
  }

  const handleChat = async () => {
    closeMenu()
    navigate('/chat')
  }

  const navigationItems = [
    { label: 'Find Jobs', href: '/jobs' },
    { label: 'Companies', href: '/companies' },
    { label: 'Career Advice', href: '/career-advice' },
    { label: 'For Employers', href: '/for-employers' }
  ]

  return (
    <header className='sticky top-0 z-50 border-b border-slate-200/80 bg-white/88 backdrop-blur-xl'>
      <Container className='relative'>
        <div className='flex h-[72px] items-center justify-between gap-6 py-4'>
          <Logo />

          {/* Desktop Navigation */}
          <nav className='hidden items-center gap-8 lg:flex'>
            {navigationItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className='text-sm font-medium text-slate-700 transition-colors hover:text-violet-700'
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth Actions */}
          <div className='hidden items-center gap-3 lg:flex'>
            {isAuthenticated ? (
              <>
                <button
                  onClick={handleChat}
                  className='inline-flex items-center justify-center h-11 w-11 rounded-xl border border-slate-200 bg-white text-slate-700 transition-colors hover:border-violet-200 hover:text-violet-700'
                  title='Open Chat'
                >
                  <MessageCircle className='h-5 w-5' />
                </button>
                <PrimaryButton className='rounded-xl px-5 py-2.5 text-sm' onClick={() => navigate(dashboardPath)}>
                  Dashboard
                </PrimaryButton>
                <button
                  onClick={handleLogout}
                  className='flex items-center px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:text-violet-700'
                >
                  <LogOut className='mr-2 h-4 w-4' />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to='/login'
                  className='px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:text-violet-700'
                >
                  Login
                </Link>
                <PrimaryButton className='rounded-xl px-5 py-2.5 text-sm' onClick={() => navigate('/register')}>
                  Sign Up
                </PrimaryButton>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type='button'
            aria-label='Toggle menu'
            onClick={() => setIsOpen((current) => !current)}
            className='inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition-colors hover:border-violet-200 hover:text-violet-700 lg:hidden'
          >
            {isOpen ? <X className='h-5 w-5' /> : <Menu className='h-5 w-5' />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            'overflow-hidden transition-[max-height,opacity] duration-300 lg:hidden',
            isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          )}
        >
          <div className='space-y-2 rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_18px_50px_rgba(15,23,42,0.08)]'>
            {navigationItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                onClick={closeMenu}
                className='block rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-violet-50 hover:text-violet-700'
              >
                {item.label}
              </Link>
            ))}

            <div className='flex flex-col gap-2 pt-2'>
              {isAuthenticated ? (
                <>
                  <button
                    onClick={handleChat}
                    className='block rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-violet-50 hover:text-violet-700 text-left flex items-center'
                  >
                    <MessageCircle className='mr-2 h-4 w-4' />
                    Chat
                  </button>
                  <PrimaryButton
                    className='w-full rounded-2xl'
                    onClick={() => {
                      navigate(dashboardPath)
                      closeMenu()
                    }}
                  >
                    Dashboard
                  </PrimaryButton>
                  <button
                    onClick={handleLogout}
                    className='block rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 text-left flex items-center'
                  >
                    <LogOut className='mr-2 h-4 w-4' />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to='/login'
                    onClick={closeMenu}
                    className='rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 block'
                  >
                    Login
                  </Link>
                  <PrimaryButton
                    className='w-full rounded-2xl'
                    onClick={() => {
                      navigate('/register')
                      closeMenu()
                    }}
                  >
                    Sign Up
                  </PrimaryButton>
                </>
              )}
            </div>
          </div>
        </div>
      </Container>
    </header>
  )
}

export default Header
