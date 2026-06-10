import {
  Bell,
  Bot,
  BriefcaseBusiness,
  CalendarClock,
  LogOut,
  Menu,
  MessageCircle,
  MoonStar,
  Search,
  Sun,
  User,
  Users,
  X
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import LanguageSwitcher from '@/components/i18n/LanguageSwitcher'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'
import { useChatbotStore } from '@/store/chatbotStore'

type EmployeeHeaderProps = {
  onMobileMenuClick?: () => void
  onToggleTheme?: () => void
  isMobileSidebarOpen?: boolean
  theme: 'light' | 'dark'
}

const iconButtonClassName =
  'inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200/85 bg-white/92 text-slate-600 shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30 dark:border-slate-300/16 dark:bg-slate-200/8 dark:text-slate-200 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] dark:hover:bg-slate-200/14 dark:hover:text-white'

const notifications = [
  {
    titleKey: 'employer.notifications.reviewCandidates.title',
    descriptionKey: 'employer.notifications.reviewCandidates.description',
    timeKey: 'employer.notifications.reviewCandidates.time',
    href: '/employer/candidates',
    icon: Users,
    tone: 'bg-sky-50 text-sky-600'
  },
  {
    titleKey: 'employer.notifications.checkInterviews.title',
    descriptionKey: 'employer.notifications.checkInterviews.description',
    timeKey: 'employer.notifications.checkInterviews.time',
    href: '/employer/interviews',
    icon: CalendarClock,
    tone: 'bg-orange-50 text-orange-600'
  },
  {
    titleKey: 'employer.notifications.keepJobsUpdated.title',
    descriptionKey: 'employer.notifications.keepJobsUpdated.description',
    timeKey: 'employer.notifications.keepJobsUpdated.time',
    href: '/employer/jobs',
    icon: BriefcaseBusiness,
    tone: 'bg-violet-50 text-violet-600'
  }
]

const EmployeeHeader = ({
  onMobileMenuClick,
  onToggleTheme,
  isMobileSidebarOpen = false,
  theme
}: EmployeeHeaderProps) => {
  const { t } = useTranslation()
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const { setToggleDismissed, setWidgetOpen } = useChatbotStore()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const notificationsRef = useRef<HTMLDivElement>(null)

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

      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleNotificationClick = (href: string) => {
    setIsNotificationsOpen(false)
    navigate(href)
  }

  const handleViewProfile = () => {
    setIsProfileDropdownOpen(false)
    console.log('View Profile clicked')
  }

  const handleChat = () => {
    setIsProfileDropdownOpen(false)
    navigate('/chat')
  }

  const handleOpenChatbot = () => {
    setToggleDismissed(false)
    setWidgetOpen(true)
    setIsNotificationsOpen(false)
    setIsProfileDropdownOpen(false)
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
    <header className='sticky top-0 z-40 border-b border-slate-200/70 bg-white/86 px-3 shadow-[0_10px_30px_rgba(15,23,42,0.035)] backdrop-blur-xl transition-colors duration-500 sm:px-4 lg:px-6 xl:h-[80px] xl:px-7 dark:border-slate-300/14 dark:bg-[#1a1f2a]/88 dark:shadow-[0_16px_48px_rgba(0,0,0,0.26),inset_0_-1px_0_rgba(255,255,255,0.04)]'>
      <div className='mx-auto max-w-[1600px] xl:h-full'>
        <div className='flex h-[80px] items-center xl:h-full'>
          <div className='flex w-full min-w-0 flex-wrap items-center gap-3'>
            <button
              type='button'
              onClick={onMobileMenuClick}
              aria-label={
                isMobileSidebarOpen ? t('employer.header.closeNavigation') : t('employer.header.openNavigation')
              }
              className={cn(iconButtonClassName, 'xl:hidden')}
            >
              {isMobileSidebarOpen ? <X className='h-5 w-5' /> : <Menu className='h-5 w-5' />}
            </button>

            <div className='order-3 flex min-w-0 basis-full items-center gap-3 rounded-[22px] border border-slate-200/90 bg-white/68 px-4 py-3 shadow-inner shadow-white/80 transition-colors duration-500 lg:order-none lg:flex-1 lg:basis-auto dark:border-slate-300/18 dark:bg-slate-200/9 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]'>
              <Search className='h-5 w-5 shrink-0 text-slate-400 dark:text-slate-300' />
              <input
                className='min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-400'
                placeholder={t('employer.searchPlaceholder')}
                aria-label={t('employer.header.searchDashboard')}
              />
            </div>

            <div className='ml-auto flex min-w-0 items-center gap-2'>
              <LanguageSwitcher
                compact
                className='dark:border-slate-300/15 dark:bg-slate-200/8 dark:text-slate-100 dark:hover:bg-slate-200/14 dark:hover:text-white'
              />

              <button
                type='button'
                onClick={handleOpenChatbot}
                className={cn(
                  iconButtonClassName,
                  'border-violet-200/90 bg-violet-50/95 text-violet-700 shadow-[0_14px_34px_rgba(124,58,237,0.14)] hover:border-violet-300 hover:bg-violet-100 hover:text-violet-800 dark:border-violet-300/24 dark:bg-violet-400/12 dark:text-violet-100 dark:hover:bg-violet-400/18'
                )}
                aria-label='Open AI chatbot'
                title='Open AI chatbot'
              >
                <Bot className='h-5 w-5' />
              </button>

              <button
                type='button'
                onClick={onToggleTheme}
                className={iconButtonClassName}
                aria-label={t('employer.toggleTheme')}
                title={t('employer.toggleTheme')}
              >
                {theme === 'dark' ? <Sun className='h-5 w-5' /> : <MoonStar className='h-5 w-5' />}
              </button>

              <div className='relative' ref={notificationsRef}>
                <button
                  type='button'
                  onClick={() => {
                    setIsNotificationsOpen((current) => !current)
                    setIsProfileDropdownOpen(false)
                  }}
                  className={cn(iconButtonClassName, 'relative')}
                  aria-label={t('employer.openNotifications')}
                  aria-expanded={isNotificationsOpen}
                >
                  <Bell className='h-5 w-5' />
                  <span className='absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-[#171b25]'></span>
                </button>

                {isNotificationsOpen && (
                  <div className='absolute right-0 z-50 mt-3 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_30px_70px_rgba(15,23,42,0.16)] dark:border-slate-200/12 dark:bg-[#1b202b] dark:shadow-[0_30px_80px_rgba(0,0,0,0.42)]'>
                    <div className='border-b border-slate-200 bg-gradient-to-r from-slate-50 via-white to-violet-50 px-5 py-4 dark:border-slate-200/12 dark:from-slate-200/10 dark:via-slate-200/6 dark:to-violet-500/10'>
                      <div className='flex items-center justify-between gap-3'>
                        <div>
                          <p className='text-sm font-semibold text-slate-950 dark:text-white'>
                            {t('employer.notifications.title')}
                          </p>
                          <p className='mt-1 text-xs text-slate-500 dark:text-slate-300'>
                            {t('employer.notifications.description')}
                          </p>
                        </div>
                        <span className='rounded-full bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-600'>
                          {notifications.length}
                        </span>
                      </div>
                    </div>

                    <div className='max-h-[22rem] overflow-y-auto p-2'>
                      {notifications.map((item) => {
                        const Icon = item.icon

                        return (
                          <button
                            key={item.titleKey}
                            type='button'
                            onClick={() => handleNotificationClick(item.href)}
                            className='group flex w-full gap-3 rounded-2xl px-3 py-3 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-200/8'
                          >
                            <span
                              className={cn(
                                'mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl',
                                item.tone
                              )}
                            >
                              <Icon className='h-5 w-5' />
                            </span>
                            <span className='min-w-0 flex-1'>
                              <span className='flex items-start justify-between gap-3'>
                                <span className='text-sm font-semibold text-slate-900 group-hover:text-violet-700 dark:text-slate-50 dark:group-hover:text-white'>
                                  {t(item.titleKey)}
                                </span>
                                <span className='shrink-0 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500'>
                                  {t(item.timeKey)}
                                </span>
                              </span>
                              <span className='mt-1 block text-xs leading-5 text-slate-500 dark:text-slate-300'>
                                {t(item.descriptionKey)}
                              </span>
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className='relative min-w-0' ref={dropdownRef}>
                <button
                  type='button'
                  onClick={() => {
                    setIsProfileDropdownOpen((current) => !current)
                    setIsNotificationsOpen(false)
                  }}
                  className='hidden min-w-[14rem] max-w-[18rem] items-center gap-3 rounded-[22px] border border-slate-200/85 bg-white px-3.5 py-2 shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/35 sm:flex dark:border-slate-300/15 dark:bg-slate-200/8 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] dark:hover:bg-slate-200/14'
                >
                  <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-600 text-sm font-bold text-white shadow-[0_16px_30px_rgba(79,70,229,0.28)]'>
                    {initials}
                  </div>
                  <div className='min-w-0 text-left'>
                    <p className='truncate text-sm font-semibold text-slate-900 dark:text-white'>
                      {user?.full_name || t('employer.profile.employeeFallback')}
                    </p>
                    <p className='truncate text-xs text-slate-500 dark:text-slate-300'>{t('employer.roleLabel')}</p>
                  </div>
                </button>

                <button
                  type='button'
                  onClick={() => {
                    setIsProfileDropdownOpen((current) => !current)
                    setIsNotificationsOpen(false)
                  }}
                  className='inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200/85 bg-white text-sm font-bold text-slate-700 shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/35 sm:hidden dark:border-slate-300/15 dark:bg-slate-200/8 dark:text-slate-100 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] dark:hover:bg-slate-200/14'
                  aria-label={t('employer.header.openProfileMenu')}
                >
                  {initials}
                </button>

                {isProfileDropdownOpen && (
                  <div className='absolute right-0 mt-3 w-[min(18rem,calc(100vw-2rem))] overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_30px_70px_rgba(15,23,42,0.14)] dark:border-slate-200/12 dark:bg-[#1b202b] dark:shadow-[0_30px_80px_rgba(0,0,0,0.42)]'>
                    <div className='border-b border-slate-200 bg-gradient-to-r from-slate-50 to-violet-50 px-4 py-4 dark:border-slate-200/12 dark:from-slate-200/10 dark:to-violet-500/10'>
                      <p className='text-sm font-semibold text-slate-900 dark:text-white'>
                        {user?.full_name || t('employer.profile.employeeFallback')}
                      </p>
                      <p className='mt-1 text-xs text-slate-600 dark:text-slate-400'>
                        {user?.email || t('employer.roleLabel')}
                      </p>
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
                        <MessageCircle className='h-4 w-4 text-slate-500 dark:text-slate-300' />
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
