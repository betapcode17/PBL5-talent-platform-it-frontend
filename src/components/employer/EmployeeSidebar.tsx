import {
  BriefcaseBusiness,
  Building2,
  CalendarClock,
  LayoutDashboard,
  PanelLeftClose,
  PanelLeftOpen,
  Users,
  X
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'

import Logo from '@/components/ui/Logo'
import { cn } from '@/lib/utils'

type EmployeeSidebarProps = {
  isCollapsed: boolean
  variant?: 'desktop' | 'mobile'
  onNavigate?: () => void
  onClose?: () => void
  onToggleCollapse?: () => void
}

const baseNavigationItems = [
  { labelKey: 'employer.sidebar.overview', href: '/employer', icon: LayoutDashboard, end: true },
  { labelKey: 'employer.sidebar.jobs', href: '/employer/jobs', icon: BriefcaseBusiness },
  { labelKey: 'employer.sidebar.candidates', href: '/employer/candidates', icon: Users },
  { labelKey: 'employer.sidebar.interviews', href: '/employer/interviews', icon: CalendarClock },
  { labelKey: 'employer.sidebar.company', href: '/employer/companyInfo', icon: Building2 }
]

const EmployeeSidebar = ({
  isCollapsed,
  variant = 'desktop',
  onNavigate,
  onClose,
  onToggleCollapse
}: EmployeeSidebarProps) => {
  const { t } = useTranslation()
  const isMobile = variant === 'mobile'
  const compact = isCollapsed && !isMobile
  const navigationItems = baseNavigationItems

  return (
    <aside
      className={cn(
        'relative flex h-full min-h-0 flex-col overflow-hidden border-r border-slate-200/80 bg-white/96 shadow-[0_18px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl transition-colors duration-300 dark:border-white/8 dark:bg-[#090b17]/96 dark:text-white dark:shadow-[18px_0_70px_rgba(0,0,0,0.25)]',
        isMobile ? 'w-[min(20rem,calc(100vw-1rem))] max-w-full' : 'w-full'
      )}
    >
      <div className='absolute inset-x-0 top-0 h-40 bg-[linear-gradient(180deg,rgba(245,247,255,0.98)_0%,rgba(255,255,255,0)_100%)] dark:bg-[linear-gradient(180deg,rgba(18,20,35,0.96)_0%,rgba(18,20,35,0)_100%)]' />

      <div
        className={cn(
          'relative flex items-center border-b border-slate-200/75 px-4 py-5 dark:border-white/8',
          isMobile ? 'justify-between gap-3' : compact ? 'justify-center' : 'justify-between gap-3'
        )}
      >
        <Logo compact={compact} className={cn(compact ? 'justify-center' : 'min-w-0')} />

        {!isMobile ? (
          <button
            type='button'
            onClick={onToggleCollapse}
            aria-label={compact ? t('employer.header.expandSidebar') : t('employer.header.collapseSidebar')}
            title={compact ? t('employer.header.expandSidebar') : t('employer.header.collapseSidebar')}
            className={cn(
              'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/35 dark:border-white/8 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-violet-200',
              compact ? 'absolute right-1 top-4 translate-x-1/2' : ''
            )}
          >
            {compact ? <PanelLeftOpen className='h-5 w-5' /> : <PanelLeftClose className='h-5 w-5' />}
          </button>
        ) : null}

        {isMobile ? (
          <button
            type='button'
            onClick={onClose}
            aria-label={t('employer.sidebar.closeSidebar')}
            className='inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/35 dark:border-white/8 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white'
          >
            <X className='h-5 w-5' />
          </button>
        ) : null}
      </div>

      <div className='relative flex min-h-0 flex-1 flex-col px-3 pb-4 pt-4'>
        {compact ? (
          <div className='mb-4 flex justify-center'>
            <span className='h-1.5 w-8 rounded-full bg-slate-200 dark:bg-white/10' />
          </div>
        ) : null}

        <nav className='min-h-0 flex-1 space-y-2 overflow-y-auto overflow-x-hidden pr-1'>
          {navigationItems?.map((item) => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.href}
                to={item.href}
                end={item.end}
                title={compact ? t(item.labelKey) : undefined}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn(
                    'group flex items-center rounded-2xl border text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/35',
                    compact ? 'justify-center px-0 py-3.5' : 'justify-start gap-3 px-3.5 py-3.5',
                    isActive
                      ? 'border-violet-200 bg-violet-50/90 text-violet-700 shadow-[0_10px_25px_rgba(124,58,237,0.09)] dark:border-violet-400/20 dark:bg-violet-500/13 dark:text-violet-100'
                      : 'border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:border-white/8 dark:hover:bg-white/6 dark:hover:text-white'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={cn(
                        'flex shrink-0 items-center justify-center rounded-xl transition-colors',
                        compact ? 'h-11 w-11' : 'h-10 w-10',
                        isActive
                          ? 'bg-white text-violet-700 shadow-sm dark:bg-violet-400/15 dark:text-violet-100'
                          : 'bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-slate-900 dark:bg-white/6 dark:text-slate-400 dark:group-hover:bg-white/10 dark:group-hover:text-white'
                      )}
                    >
                      <Icon className='h-5 w-5' />
                    </span>

                    {!compact ? <span className='truncate'>{t(item.labelKey)}</span> : null}
                  </>
                )}
              </NavLink>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}

export default EmployeeSidebar
