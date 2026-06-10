import {
  BriefcaseBusiness,
  Building2,
  CalendarClock,
  FileSearch,
  LayoutDashboard,
  Loader2,
  PanelLeftClose,
  PanelLeftOpen,
  Users,
  X
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'

import Logo from '@/components/ui/Logo'
import { useEmployerWorkspace } from '@/components/employer/EmployerWorkspaceContext'
import { cn } from '@/lib/utils'

type EmployeeSidebarProps = {
  isCollapsed: boolean
  variant?: 'desktop' | 'mobile'
  onNavigate?: () => void
  onClose?: () => void
  onToggleCollapse?: () => void
}

const navigationItems = [
  { labelKey: 'employer.sidebar.overview', href: '/employer', icon: LayoutDashboard, end: true },
  { labelKey: 'employer.sidebar.jobs', href: '/employer/jobs', icon: BriefcaseBusiness },
  { labelKey: 'employer.sidebar.resumeFilter', href: '/employer/resume-filter', icon: FileSearch },
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
  const { aiScreeningTask } = useEmployerWorkspace()
  const isMobile = variant === 'mobile'
  const compact = isCollapsed && !isMobile

  return (
    <aside
      className={cn(
        'relative flex h-full min-h-0 flex-col overflow-hidden border-r border-slate-200/80 bg-white/92 shadow-[0_18px_40px_rgba(15,23,42,0.05)] backdrop-blur-xl transition-colors duration-500 dark:border-slate-300/14 dark:bg-[linear-gradient(180deg,rgba(30,35,46,0.96)_0%,rgba(17,21,29,0.98)_100%)] dark:text-slate-50 dark:shadow-[18px_0_70px_rgba(0,0,0,0.28),inset_-1px_0_0_rgba(255,255,255,0.05)]',
        isMobile ? 'w-[min(20rem,calc(100vw-1rem))] max-w-full' : 'w-full'
      )}
    >
      <div className='absolute inset-x-0 top-0 h-40 bg-[linear-gradient(180deg,rgba(245,247,255,0.98)_0%,rgba(255,255,255,0)_100%)] dark:bg-[linear-gradient(180deg,rgba(226,232,240,0.08)_0%,rgba(226,232,240,0)_100%)]' />

      <div
        className={cn(
          'relative flex items-center border-b border-slate-200/75 transition-[padding] duration-300 ease-out dark:border-slate-200/12',
          isMobile ? 'justify-between gap-3 px-4 py-5' : 'h-[80px] justify-start px-6'
        )}
      >
        <Logo compact={compact} />

        {isMobile ? (
          <button
            type='button'
            onClick={onClose}
            aria-label={t('employer.sidebar.closeSidebar')}
            className='inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/35 dark:border-slate-300/15 dark:bg-slate-200/8 dark:text-slate-200 dark:hover:bg-slate-200/14 dark:hover:text-white'
          >
            <X className='h-5 w-5' />
          </button>
        ) : null}
      </div>

      <div
        className={cn(
          'relative flex min-h-0 flex-1 flex-col transition-[padding] duration-300 ease-out',
          isMobile ? 'px-3 pb-4 pt-4' : 'px-2.5 py-3'
        )}
      >
        <nav
          className={cn('min-h-0 w-full flex-1 overflow-y-auto overflow-x-hidden', isMobile ? 'space-y-1.5 pr-1' : '')}
        >
          <div
            className={cn(
              isMobile
                ? 'contents'
                : 'mx-auto flex flex-col items-stretch gap-1 transition-[width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
              !isMobile && (compact ? 'w-11' : 'w-[13.625rem]')
            )}
          >
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isAiScreeningItem = item.href === '/employer/resume-filter' && aiScreeningTask.status === 'running'

              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  end={item.end}
                  aria-label={compact ? t(item.labelKey) : undefined}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    cn(
                      'group relative flex items-center justify-start border text-sm font-semibold transition-[width,padding,border-color,background-color,color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/35',
                      isMobile
                        ? 'h-12 w-full rounded-2xl px-3 py-0'
                        : compact
                          ? 'h-11 w-11 shrink-0 rounded-xl px-1 py-0'
                          : 'h-11 w-full shrink-0 rounded-xl px-3.5 py-0',
                      isActive
                        ? 'border-indigo-200 bg-indigo-50/90 text-indigo-800 shadow-[0_10px_25px_rgba(79,70,229,0.08)] dark:border-slate-300/24 dark:bg-[linear-gradient(90deg,rgba(71,85,105,0.48),rgba(79,70,229,0.24))] dark:text-white dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]'
                        : 'border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:border-slate-200/12 dark:hover:bg-slate-200/8 dark:hover:text-white'
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {!isMobile ? (
                        <span
                          className={cn(
                            'absolute -left-3 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-violet-600 transition-opacity duration-200 dark:bg-violet-300',
                            compact && isActive ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                      ) : null}

                      <span
                        className={cn(
                          'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors duration-300',
                          isActive
                            ? 'bg-white text-violet-700 shadow-sm dark:bg-white/10 dark:text-white'
                            : 'bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-slate-900 dark:bg-slate-200/8 dark:text-slate-300 dark:group-hover:bg-slate-200/14 dark:group-hover:text-white'
                        )}
                      >
                        <Icon className='h-5 w-5' />
                      </span>

                      <span
                        className={cn(
                          'min-w-0 flex-1 truncate transition-[max-width,margin,opacity,transform] duration-200 ease-out',
                          compact
                            ? 'ml-0 max-w-0 -translate-x-1 flex-none opacity-0 delay-0'
                            : 'ml-2.5 max-w-40 translate-x-0 opacity-100 delay-75'
                        )}
                      >
                        {t(item.labelKey)}
                      </span>
                      {isAiScreeningItem ? (
                        <Loader2 className='absolute left-8 top-0.5 h-3.5 w-3.5 shrink-0 animate-spin text-violet-600' />
                      ) : null}
                    </>
                  )}
                </NavLink>
              )
            })}
          </div>
        </nav>
      </div>

      {!isMobile ? (
        <div className={cn('relative h-[61px] border-t border-slate-200/75 dark:border-slate-200/12')}>
          <button
            type='button'
            onClick={onToggleCollapse}
            aria-label={compact ? t('employer.header.expandSidebar') : t('employer.header.collapseSidebar')}
            className={cn(
              'absolute left-6 top-3 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-[transform,border-color,background-color,color] duration-300 ease-out hover:-translate-y-0.5 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/35 dark:border-slate-300/15 dark:bg-slate-200/8 dark:text-slate-200 dark:hover:bg-slate-200/14 dark:hover:text-white'
            )}
          >
            <PanelLeftOpen
              className={cn(
                'absolute h-4 w-4 transition-[opacity,transform] duration-300 ease-out',
                compact ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'
              )}
            />
            <PanelLeftClose
              className={cn(
                'absolute h-4 w-4 transition-[opacity,transform] duration-300 ease-out',
                compact ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'
              )}
            />
          </button>
        </div>
      ) : null}
    </aside>
  )
}

export default EmployeeSidebar
