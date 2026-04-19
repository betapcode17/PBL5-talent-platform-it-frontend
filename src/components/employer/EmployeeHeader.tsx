import { Bell, Menu, X, MoonStar, Search, LogOut, User, MessageCircle } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

type EmployeeHeaderProps = {
  onMenuClick?: () => void
}

const EmployeeHeader = ({ onMenuClick }: EmployeeHeaderProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const dropdownRef = useRef<HTMLDivElement>(null)

  const initials = (user?.full_name || 'HR')
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleViewProfile = () => {
    setIsProfileDropdownOpen(false)
    // Navigate to profile or open profile page
    console.log('View Profile clicked')
  }

  const handleChat = () => {
    setIsProfileDropdownOpen(false)
    navigate('/chat')
  }

  const handleLogout = async () => {
    setIsProfileDropdownOpen(false)
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <header className='sticky top-0 z-40 border-b border-slate-200/70 bg-white/88 backdrop-blur-xl'>
      <div className='flex items-center gap-4 px-4 py-4 sm:px-6 lg:px-8'>
        <button
          type='button'
          className='inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:text-violet-700'
          onClick={() => {
            setIsOpen(!isOpen)
            onMenuClick?.()
          }}
          title='Toggle menu'
        >
          {isOpen ? <X className='h-5 w-5' /> : <Menu className='h-5 w-5' />}
        </button>

        {/* Search Bar */}
        <div className='flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm'>
          <Search className='h-5 w-5 shrink-0 text-slate-400' />
          <input
            className='min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400'
            placeholder='Search or type command...'
          />
          <div className='hidden rounded-lg border border-slate-200 px-2 py-1 text-xs font-medium text-slate-400 sm:block'>
            ⌘ K
          </div>
        </div>

        <div className='ml-auto flex items-center gap-3'>
          <button
            type='button'
            className='inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:text-violet-700'
          >
            <MoonStar className='h-5 w-5' />
          </button>
          <button
            type='button'
            className='inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:text-violet-700 relative'
          >
            <Bell className='h-5 w-5' />
            <span className='absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500'></span>
          </button>

          {/* Profile Dropdown */}
          <div className='relative' ref={dropdownRef}>
            <button
              type='button'
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className='hidden items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-1.5 shadow-sm hover:bg-slate-50 transition-colors sm:flex'
            >
              <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-blue-600 text-xs font-bold text-white'>
                {initials}
              </div>
              <div className='min-w-0'>
                <p className='text-sm font-semibold text-slate-900 truncate'>{user?.full_name || 'Employee'}</p>
                <p className='text-xs text-slate-500 truncate'>Recruitment</p>
              </div>
            </button>

            {/* Dropdown Menu */}
            {isProfileDropdownOpen && (
              <div className='absolute right-0 mt-2 w-48 rounded-lg border border-slate-200 bg-white shadow-lg overflow-hidden'>
                {/* Header */}
                <div className='px-4 py-3 bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-slate-200'>
                  <p className='text-sm font-semibold text-slate-900'>{user?.full_name || 'Employee'}</p>
                  <p className='text-xs text-slate-600'>{user?.email || 'Recruitment'}</p>
                </div>

                {/* Menu Items */}
                <div className='py-2'>
                  <button
                    onClick={handleViewProfile}
                    className='w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors'
                  >
                    <User className='h-4 w-4 text-slate-600' />
                    <span>View Profile</span>
                  </button>
                  <button
                    onClick={handleChat}
                    className='w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors'
                  >
                    <MessageCircle className='h-4 w-4 text-slate-600' />
                    <span>Chat</span>
                  </button>
                  <div className='border-t border-slate-100 my-1'></div>
                  <button
                    onClick={handleLogout}
                    className='w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors'
                  >
                    <LogOut className='h-4 w-4' />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default EmployeeHeader
