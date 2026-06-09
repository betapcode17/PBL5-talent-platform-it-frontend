import {
  LogOut,
  Menu,
  MessageCircle,
  MoonStar,
  Search,
  Sun,
  User,
  X
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import LanguageSwitcher from '@/components/i18n/LanguageSwitcher'
import { NotificationBell } from '@/components/notifications/NotificationBell'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'

type EmployeeHeaderProps = {
  onMobileMenuClick?: () => void
  onToggleTheme?: () => void
  isMobileSidebarOpen?: boolean
  theme: 'light' | 'dark'
}

const iconButtonClassName =
  'inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200/85 bg-white text-slate-600 shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/35 dark:border-white/8 dark:bg-[#121423]/90 dark:text-slate-300 dark:shadow-none dark:hover:bg-white/8 dark:hover:text-white'

const EmployeeHeader = ({
  onMobileMenuClick,
  onToggleTheme,
  isMobileSidebarOpen = false,
  theme
}: EmployeeHeaderProps) => {
  const { t } = useTranslation()
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const dropdownRef = useRef<HTMLDivElement>(null)

  const initials = (user?.full_name || 'HR')
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')

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
    <header className='sticky top-0 z-40 px-3 pt-3 sm:px-4 lg:px-6 lg:pt-4 xl:px-7'>
      <div className='mx-auto max-w-[1600px]'>
        <div className='rounded-[28px] border border-white/80 bg-white/88 p-3 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-colors duration-300 dark:border-white/8 dark:bg-[#0f1220]/88 dark:shadow-[0_24px_70px_rgba(0,0,0,0.28)]'>
          <div className='flex min-w-0 flex-wrap items-center gap-3'>
            <button
              type='button'
              onClick={onMobileMenuClick}
              aria-label={isMobileSidebarOpen ? t('employer.header.closeNavigation') : t('employer.header.openNavigation')}
              className={cn(iconButtonClassName, 'xl:hidden')}
            >
              {isMobileSidebarOpen ? <X className='h-5 w-5' /> : <Menu className='h-5 w-5' />}
            </button>

            <div className='order-3 flex min-w-0 basis-full items-center gap-3 rounded-[22px] border border-slate-200/85 bg-slate-50/85 px-4 py-3 shadow-inner shadow-white/80 transition-colors lg:order-none lg:flex-1 lg:basis-auto dark:border-white/8 dark:bg-white/5 dark:shadow-none'>
              <Search className='h-5 w-5 shrink-0 text-slate-400' />
              <input
                className='min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500'
                placeholder={t('employer.searchPlaceholder')}
                aria-label={t('employer.header.searchDashboard')}
              />
              <div className='hidden rounded-xl border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-400 lg:block dark:border-white/8 dark:bg-white/5 dark:text-slate-500'>
                Ctrl K
              </div>
            </div>

            <div className='ml-auto flex min-w-0 items-center gap-2'>
              <LanguageSwitcher compact className='dark:border-white/8 dark:bg-[#121423]/90 dark:text-slate-200 dark:hover:text-white' />

              <button
                type='button'
                onClick={onToggleTheme}
                className={iconButtonClassName}
                aria-label={t('employer.toggleTheme')}
                title={t('employer.toggleTheme')}
              >
                {theme === 'dark' ? <Sun className='h-5 w-5' /> : <MoonStar className='h-5 w-5' />}
              </button>

              <NotificationBell buttonClassName={cn(iconButtonClassName, 'relative')} />

              <div className='relative min-w-0' ref={dropdownRef}>
                <button
                  type='button'
                  onClick={() => {
                    setIsProfileDropdownOpen((current) => !current)
                  }}
                  className='hidden min-w-[14rem] max-w-[18rem] items-center gap-3 rounded-[22px] border border-slate-200/85 bg-white px-3.5 py-2 shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/35 sm:flex dark:border-white/8 dark:bg-[#121423]/90 dark:shadow-none dark:hover:bg-white/8'
                >
                  <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-600 text-sm font-bold text-white shadow-[0_16px_30px_rgba(79,70,229,0.28)]'>
                    {initials}
                  </div>
                  <div className='min-w-0 text-left'>
                    <p className='truncate text-sm font-semibold text-slate-900 dark:text-white'>{user?.full_name || t('employer.profile.employeeFallback')}</p>
                    <p className='truncate text-xs text-slate-500 dark:text-slate-400'>{t('employer.roleLabel')}</p>
                  </div>
                </button>

                <button
                  type='button'
                  onClick={() => {
                    setIsProfileDropdownOpen((current) => !current)
                  }}
                  className='inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200/85 bg-white text-sm font-bold text-slate-700 shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/35 sm:hidden dark:border-white/8 dark:bg-[#121423]/90 dark:text-slate-200 dark:shadow-none dark:hover:bg-white/8'
                  aria-label={t('employer.header.openProfileMenu')}
                >
                  {initials}
                </button>

                {isProfileDropdownOpen && (
                  <div className='absolute right-0 mt-3 w-[min(18rem,calc(100vw-2rem))] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_30px_70px_rgba(15,23,42,0.14)] dark:border-white/8 dark:bg-[#121423] dark:shadow-[0_30px_80px_rgba(0,0,0,0.38)]'>
                    <div className='border-b border-slate-200 bg-gradient-to-r from-slate-50 to-violet-50 px-4 py-4 dark:border-white/8 dark:from-white/6 dark:to-violet-500/10'>
                      <p className='text-sm font-semibold text-slate-900 dark:text-white'>{user?.full_name || t('employer.profile.employeeFallback')}</p>
                      <p className='mt-1 text-xs text-slate-600 dark:text-slate-400'>{user?.email || t('employer.roleLabel')}</p>
                    </div>

                    <div className='p-2'>
                      <button
                        onClick={handleViewProfile}
                        className='flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/6 dark:hover:text-white'
                      >
                        <User className='h-4 w-4 text-slate-500' />
                        <span>{t('employer.profile.viewProfile')}</span>
                      </button>
                      <button
                        onClick={handleChat}
                        className='flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/6 dark:hover:text-white'
                      >
                        <MessageCircle className='h-4 w-4 text-slate-500' />
                        <span>{t('employer.profile.chat')}</span>
                      </button>
                      <div className='my-2 border-t border-slate-100 dark:border-white/8' />
                      <button
                        onClick={handleLogout}
                        className='flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm text-rose-600 transition-colors hover:bg-rose-50'
                      >
                        <LogOut className='h-4 w-4' />
                        <span>{t('nav.logout')}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default EmployeeHeader
