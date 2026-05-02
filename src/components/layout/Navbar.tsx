import { BriefcaseBusiness, ChevronDown, LogOut, Menu, MessageCircle, Search, User, X } from 'lucide-react'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, NavLink, useNavigate } from 'react-router-dom'

import LanguageSwitcher from '@/components/i18n/LanguageSwitcher'
import Container from '@/components/ui/Container'
import Logo from '@/components/ui/Logo'
import { cn } from '@/lib/utils'
import { useBrowseJobsStore } from '@/store/browseJobsStore'
import { useAuthStore } from '@/store/authStore'

type NavbarVariant = 'marketing' | 'default' | 'compact'

type NavbarProps = {
  variant?: NavbarVariant
  showSearch?: boolean
  showAuthButtons?: boolean
  showPostJobButton?: boolean
  transparentOnTop?: boolean
}

const navItems = [
  { labelKey: 'nav.jobs', href: '/jobs' },
  { labelKey: 'nav.companies', href: '/companies' },
  { labelKey: 'nav.categories', href: '/categories' },
  { labelKey: 'nav.resources', href: '/resources' }
]

const baseFocusClassName =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2'

const getDashboardPath = (role?: string) => {
  switch (role) {
    case 'ADMIN':
      return '/admin'
    case 'EMPLOYEE':
      return '/employer'
    case 'SEEKER':
      return '/seeker'
    default:
      return '/login'
  }
}

const Navbar = ({
  variant = 'default',
  showSearch = false,
  showAuthButtons = true,
  showPostJobButton = true,
  transparentOnTop = false
}: NavbarProps) => {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [headerSearchQuery, setHeaderSearchQuery] = useState('')
  const navigate = useNavigate()
  const { isAuthenticated, logout, user } = useAuthStore()
  const profileRef = useRef<HTMLDivElement>(null)

  const isCompact = variant === 'compact'
  const dashboardPath = getDashboardPath(user?.role)
  const canShowPostJobButton = showPostJobButton && isAuthenticated && user?.role === 'EMPLOYEE'
  const initials = (user?.full_name || user?.email || 'U')
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const closeMenu = () => setIsOpen(false)

  const handleLogout = async () => {
    await logout()
    setIsProfileOpen(false)
    closeMenu()
    navigate('/login')
  }

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    useBrowseJobsStore.getState().setSearchQuery(headerSearchQuery.trim())
    closeMenu()
    navigate('/jobs')
  }

  const headerClassName = cn(
    'sticky top-0 z-50 border-b transition-colors duration-300',
    transparentOnTop
      ? 'border-white/60 bg-white/78 shadow-[0_10px_30px_rgba(15,23,42,0.04)] backdrop-blur-xl'
      : 'border-slate-200/70 bg-white/92 shadow-[0_10px_30px_rgba(15,23,42,0.035)] backdrop-blur-xl'
  )

  return (
    <header className={headerClassName}>
      <Container className='relative'>
        <div className={cn('flex items-center justify-between gap-4', isCompact ? 'h-16' : 'h-[74px]')}>
          <div className='flex min-w-0 flex-1 items-center gap-4 xl:gap-8'>
            <Logo className='shrink-0' />

            <nav
              aria-label={t('nav.primaryNavigation')}
              className='hidden flex-none items-center gap-2 rounded-full border border-slate-200/70 bg-slate-50/75 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] xl:flex'
            >
              {navItems.map((item) =>
                item.href ? (
                  <NavLink
                    key={item.labelKey}
                    to={item.href}
                    className={({ isActive }) =>
                      cn(
                        'inline-flex h-10 min-w-[6.35rem] items-center justify-center rounded-full px-4 text-sm font-semibold whitespace-nowrap transition duration-200',
                        baseFocusClassName,
                        isActive
                          ? 'bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white shadow-[0_10px_26px_rgba(124,58,237,0.28)]'
                          : 'text-slate-600 hover:bg-white hover:text-slate-950 hover:shadow-[0_8px_20px_rgba(15,23,42,0.08)]'
                      )
                    }
                  >
                    {t(item.labelKey)}
                  </NavLink>
                ) : (
                  <button
                    key={item.labelKey}
                    type='button'
                    className={cn(
                      'inline-flex h-10 min-w-[6.35rem] items-center justify-center rounded-full px-4 text-sm font-semibold whitespace-nowrap text-slate-600 transition duration-200 hover:bg-white hover:text-slate-950 hover:shadow-[0_8px_20px_rgba(15,23,42,0.08)]',
                      baseFocusClassName
                    )}
                  >
                    {t(item.labelKey)}
                  </button>
                )
              )}
            </nav>
          </div>

          {showSearch ? (
            <form
              onSubmit={handleSearchSubmit}
              className='mx-2 hidden h-11 min-w-0 max-w-sm flex-1 items-center gap-2 rounded-full border border-slate-200 bg-slate-50/80 px-4 text-sm text-slate-500 transition focus-within:border-violet-200 focus-within:bg-white focus-within:ring-2 focus-within:ring-violet-100 xl:flex'
            >
              <Search className='h-4 w-4 shrink-0 text-slate-400' />
              <input
                type='search'
                value={headerSearchQuery}
                onChange={(event) => setHeaderSearchQuery(event.target.value)}
                placeholder={t('nav.searchJobs')}
                className='min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400'
              />
            </form>
          ) : null}

          <div className='hidden shrink-0 items-center justify-end gap-3 lg:flex'>
            {canShowPostJobButton ? (
              <Link
                to='/employer/jobs/create'
                className={cn(
                  'inline-flex h-11 min-w-[9.8rem] items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 whitespace-nowrap shadow-[0_8px_22px_rgba(15,23,42,0.05)] transition duration-200 hover:-translate-y-0.5 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 hover:shadow-[0_14px_30px_rgba(124,58,237,0.14)]',
                  baseFocusClassName
                )}
              >
                <BriefcaseBusiness className='h-4 w-4' />
                {t('nav.postJob')}
              </Link>
            ) : null}

            {showAuthButtons ? (
              isAuthenticated ? (
                <>
                  <Link
                    to='/chat'
                    className={cn(
                      'inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-[0_8px_22px_rgba(15,23,42,0.05)] transition duration-200 hover:-translate-y-0.5 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 hover:shadow-[0_14px_30px_rgba(124,58,237,0.14)]',
                      baseFocusClassName
                    )}
                    aria-label={t('nav.openChat')}
                  >
                    <MessageCircle className='h-4 w-4' />
                  </Link>

                  <div className='relative' ref={profileRef}>
                    <button
                      type='button'
                      onClick={() => setIsProfileOpen((current) => !current)}
                      className={cn(
                        'inline-flex h-11 w-60 items-center gap-2 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-4 text-sm font-semibold text-slate-700 shadow-[0_8px_22px_rgba(15,23,42,0.05)] transition duration-200 hover:-translate-y-0.5 hover:border-violet-200 hover:bg-slate-50 hover:shadow-[0_14px_30px_rgba(124,58,237,0.12)]',
                        baseFocusClassName
                      )}
                      aria-label={t('nav.openAccountMenu')}
                    >
                      <span className='flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-500 text-xs font-black text-white'>
                        {initials}
                      </span>
                      <span className='min-w-0 flex-1 truncate text-left'>{user?.full_name || t('nav.account')}</span>
                      <ChevronDown className='h-4 w-4 shrink-0 text-slate-400' />
                    </button>

                    {isProfileOpen ? (
                      <div className='absolute right-0 mt-3 w-64 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.14)]'>
                        <div className='border-b border-slate-100 bg-slate-50 px-4 py-4'>
                          <p className='truncate text-sm font-semibold text-slate-900'>
                            {user?.full_name || 'Account'}
                          </p>
                          <p className='mt-1 truncate text-xs text-slate-500'>{user?.email}</p>
                        </div>
                        <div className='p-2'>
                          <Link
                            to={dashboardPath}
                            onClick={() => setIsProfileOpen(false)}
                            className='flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50'
                          >
                            <User className='h-4 w-4 text-slate-500' />
                            {t('nav.dashboard')}
                          </Link>
                          <button
                            type='button'
                            onClick={handleLogout}
                            className='flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-medium text-rose-600 transition hover:bg-rose-50'
                          >
                            <LogOut className='h-4 w-4' />
                            {t('nav.logout')}
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to='/login'
                    className={cn(
                      'inline-flex h-11 min-w-[6.25rem] items-center justify-center rounded-full px-4 text-sm font-semibold text-slate-700 whitespace-nowrap transition hover:bg-slate-50 hover:text-violet-700',
                      baseFocusClassName
                    )}
                  >
                    {t('nav.signIn')}
                  </Link>
                  <Link
                    to='/register'
                    className={cn(
                      'inline-flex h-11 min-w-[6.75rem] items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-5 text-sm font-semibold text-white whitespace-nowrap shadow-[0_14px_34px_rgba(124,58,237,0.26)] transition hover:-translate-y-0.5 hover:brightness-105',
                      baseFocusClassName
                    )}
                  >
                    {t('nav.signUp')}
                  </Link>
                  <Link
                    to='/register/employer'
                    className={cn(
                      'inline-flex h-11 min-w-[8.5rem] items-center justify-center rounded-full border border-violet-600 bg-white px-4 text-sm font-semibold text-violet-700 whitespace-nowrap shadow-[0_8px_22px_rgba(124,58,237,0.06)] transition hover:-translate-y-0.5 hover:bg-violet-50',
                      baseFocusClassName
                    )}
                  >
                    Đăng ký Nhà tuyển dụng
                  </Link>
                </>
              )
            ) : null}

            <div className='ml-1 w-[7rem] shrink-0'>
              <LanguageSwitcher className='w-full' />
            </div>
          </div>

          <button
            type='button'
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((current) => !current)}
            className={cn(
              'inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 lg:hidden',
              baseFocusClassName
            )}
          >
            {isOpen ? <X className='h-5 w-5' /> : <Menu className='h-5 w-5' />}
          </button>
        </div>

        <div
          className={cn(
            'overflow-hidden transition-[max-height,opacity,transform] duration-300 lg:hidden',
            isOpen ? 'max-h-[34rem] translate-y-0 pb-4 opacity-100' : 'max-h-0 -translate-y-2 opacity-0'
          )}
        >
          <div className='rounded-[28px] border border-slate-200 bg-white p-3 shadow-[0_18px_60px_rgba(15,23,42,0.10)]'>
            {showSearch ? (
              <form
                onSubmit={handleSearchSubmit}
                className='mb-2 flex h-12 items-center gap-2 rounded-2xl bg-slate-50 px-4'
              >
                <Search className='h-4 w-4 text-slate-400' />
                <input
                  type='search'
                  value={headerSearchQuery}
                  onChange={(event) => setHeaderSearchQuery(event.target.value)}
                  placeholder={t('nav.searchJobs')}
                  className='min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400'
                />
              </form>
            ) : null}

            <nav aria-label={t('nav.mobileNavigation')} className='space-y-1'>
              {navItems.map((item) =>
                item.href ? (
                  <NavLink
                    key={item.labelKey}
                    to={item.href}
                    onClick={closeMenu}
                    className={({ isActive }) =>
                      cn(
                        'block rounded-2xl px-4 py-3 text-sm font-semibold transition',
                        isActive
                          ? 'bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white shadow-[0_10px_26px_rgba(124,58,237,0.22)]'
                          : 'text-slate-700 hover:bg-slate-50'
                      )
                    }
                  >
                    {t(item.labelKey)}
                  </NavLink>
                ) : (
                  <button
                    key={item.labelKey}
                    type='button'
                    className='block w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-50'
                  >
                    {t(item.labelKey)}
                  </button>
                )
              )}
            </nav>

            <div className='mt-3 grid gap-2 border-t border-slate-100 pt-3'>
              <LanguageSwitcher className='h-12 w-full justify-center rounded-2xl' />

              {canShowPostJobButton ? (
                <Link
                  to='/employer/jobs/create'
                  onClick={closeMenu}
                  className='inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-700'
                >
                  <BriefcaseBusiness className='h-4 w-4' />
                  {t('nav.postJob')}
                </Link>
              ) : null}

              {showAuthButtons ? (
                isAuthenticated ? (
                  <>
                    <Link
                      to={dashboardPath}
                      onClick={closeMenu}
                      className='inline-flex h-12 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white'
                    >
                      {t('nav.goToDashboard')}
                    </Link>
                    <button
                      type='button'
                      onClick={handleLogout}
                      className='inline-flex h-12 items-center justify-center gap-2 rounded-2xl text-sm font-semibold text-rose-600 hover:bg-rose-50'
                    >
                      <LogOut className='h-4 w-4' />
                      {t('nav.logout')}
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to='/login'
                      onClick={closeMenu}
                      className='inline-flex h-12 items-center justify-center rounded-2xl text-sm font-semibold text-slate-700 hover:bg-slate-50'
                    >
                      {t('nav.signIn')}
                    </Link>
                    <Link
                      to='/register'
                      onClick={closeMenu}
                      className='inline-flex h-12 items-center justify-center rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 text-sm font-semibold text-white'
                    >
                      {t('nav.signUp')}
                    </Link>
                    <Link
                      to='/register/employer'
                      onClick={closeMenu}
                      className='inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50'
                    >
                      Đăng ký Nhà tuyển dụng
                    </Link>
                  </>
                )
              ) : null}
            </div>
          </div>
        </div>
      </Container>
    </header>
  )
}

export default Navbar
export type { NavbarProps, NavbarVariant }
