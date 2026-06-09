import {
  BarChart3,
  BellDot,
  BriefcaseBusiness,
  Building2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  UserPlus,
  Sun,
  UsersRound
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { AdminTheme } from '@/types/admin'

type AdminSidebarProps = {
  theme: AdminTheme
  isCollapsed: boolean
  onThemeChange: (theme: AdminTheme) => void
  onToggleCollapse: () => void
  onLogout: () => void
}

const menuItems = [
  { labelKey: 'admin.menu.dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
  { labelKey: 'admin.menu.users', icon: UsersRound, path: '/admin/users' },
  { labelKey: 'admin.menu.approvals', icon: UserPlus, path: '/admin/employer-requests' },
  { labelKey: 'admin.menu.companies', icon: Building2, path: '/admin/companies' },
  { labelKey: 'admin.menu.jobs', icon: BriefcaseBusiness, path: '/admin/jobs' },
  { labelKey: 'admin.menu.reports', icon: BarChart3, path: '/admin/reports' },
  { labelKey: 'admin.menu.settings', icon: Settings, path: '/admin/settings' }
]

const isMenuActive = (pathname: string, path: string) => {
  if (path === '/admin/dashboard') {
    return pathname === '/admin' || pathname === '/admin/dashboard'
  }

  return pathname.startsWith(path)
}

export function AdminSidebar({ theme, isCollapsed, onThemeChange, onToggleCollapse, onLogout }: AdminSidebarProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <aside
      className={cn(
        'group/sidebar flex min-h-screen w-full flex-col border-r border-slate-200/80 bg-white/95 px-5 py-6 text-slate-900 shadow-[18px_0_60px_rgba(15,23,42,0.04)] backdrop-blur transition-[width,padding] duration-300 ease-out xl:fixed xl:inset-y-0 xl:left-0 dark:border-white/8 dark:bg-[#090b17]/95 dark:text-white dark:shadow-[18px_0_70px_rgba(0,0,0,0.25)]',
        isCollapsed ? 'xl:w-24 xl:px-4' : 'xl:w-72'
      )}
    >
      <div className='relative'>
        <button
          type='button'
          onClick={() => navigate('/')}
          className={cn(
            'flex w-full items-center rounded-2xl px-1 py-1 text-left transition-all duration-300 hover:bg-slate-100/80 dark:hover:bg-white/6',
            isCollapsed ? 'justify-center gap-0 xl:px-0' : 'gap-3'
          )}
          aria-label={t('admin.goHome')}
        >
          <div className='flex size-11 shrink-0 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-600/25 transition-transform duration-300 hover:scale-[1.03]'>
            <span className='h-5 w-1.5 rounded-full bg-white/90' />
          </div>

          <div
            className={cn(
              'min-w-0 overflow-hidden transition-all duration-300 ease-out',
              isCollapsed ? 'xl:w-0 xl:translate-x-2 xl:opacity-0' : 'w-auto translate-x-0 opacity-100'
            )}
          >
            <h1 className='truncate text-base font-extrabold tracking-tight text-slate-950 dark:text-white'>
              IT JOB VN
            </h1>
            <p className='truncate text-xs font-semibold text-slate-500 dark:text-slate-400'>{t('admin.console')}</p>
          </div>
        </button>

        <button
          type='button'
          onClick={onToggleCollapse}
          className='absolute -right-8 top-2 hidden size-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-[0_12px_30px_rgba(15,23,42,0.10)] transition hover:text-violet-600 xl:flex dark:border-white/10 dark:bg-[#121423] dark:text-slate-300 dark:hover:text-violet-300'
          aria-label={isCollapsed ? t('admin.expandSidebar') : t('admin.collapseSidebar')}
        >
          {isCollapsed ? <PanelLeftOpen className='size-4' /> : <PanelLeftClose className='size-4' />}
        </button>
      </div>

      <nav className='mt-10 space-y-2'>
        {menuItems.map((item) => {
          const Icon = item.icon
          const active = isMenuActive(pathname, item.path)

          return (
            <button
              key={item.path}
              type='button'
              onClick={() => navigate(item.path)}
              title={isCollapsed ? t(item.labelKey) : undefined}
              className={cn(
                'group relative flex h-12 w-full items-center rounded-xl text-sm font-semibold transition-all duration-200',
                isCollapsed ? 'justify-center px-0 xl:gap-0' : 'gap-3 px-4',
                active
                  ? 'bg-violet-600/10 text-violet-600 shadow-[inset_3px_0_0_#8b5cf6] dark:bg-violet-500/13 dark:text-violet-200'
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-white/6 dark:hover:text-white'
              )}
            >
              <Icon className='size-5 shrink-0' />
              <span
                className={cn(
                  'overflow-hidden whitespace-nowrap transition-all duration-300 ease-out',
                  isCollapsed ? 'xl:w-0 xl:translate-x-2 xl:opacity-0' : 'w-auto translate-x-0 opacity-100'
                )}
              >
                {t(item.labelKey)}
              </span>

              {isCollapsed && (
                <span className='pointer-events-none absolute left-[calc(100%+12px)] z-30 hidden rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 opacity-0 shadow-xl transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 xl:block dark:border-white/10 dark:bg-[#171a2b] dark:text-white'>
                  {t(item.labelKey)}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      <div className='mt-auto space-y-5'>
        <button
          type='button'
          className={cn(
            'w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-left transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_16px_36px_rgba(15,23,42,0.08)] dark:border-white/8 dark:bg-white/4 dark:hover:bg-white/7 dark:hover:shadow-[0_18px_45px_rgba(0,0,0,0.22)]',
            isCollapsed && 'xl:px-2'
          )}
        >
          <div className={cn('flex items-center', isCollapsed ? 'justify-center gap-0' : 'gap-3')}>
            <div className='relative flex size-10 shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-600 dark:bg-slate-700 dark:text-white'>
              SA
              <span className='absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-white bg-emerald-500 dark:border-[#111323]' />
            </div>
            <div
              className={cn(
                'min-w-0 flex-1 overflow-hidden transition-all duration-300 ease-out',
                isCollapsed ? 'xl:w-0 xl:translate-x-2 xl:opacity-0' : 'w-auto translate-x-0 opacity-100'
              )}
            >
              <p className='truncate text-sm font-bold text-slate-950 dark:text-white'>Super Admin</p>
              <p className='truncate text-xs font-medium text-slate-500 dark:text-slate-400'>admin@itportal.com</p>
            </div>
            <ChevronDown
              className={cn(
                'size-4 shrink-0 text-slate-400 transition-all duration-300',
                isCollapsed && 'xl:w-0 xl:opacity-0'
              )}
            />
          </div>
        </button>

        <div>
          <p
            className={cn(
              'mb-2 px-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-400 transition-all duration-300',
              isCollapsed && 'xl:text-center xl:text-[10px]'
            )}
          >
            {isCollapsed ? t('admin.theme.mode') : t('admin.theme.theme')}
          </p>
          <div
            className={cn(
              'grid rounded-xl border border-slate-200 bg-slate-100 p-1 transition-all duration-300 dark:border-white/8 dark:bg-white/5',
              isCollapsed ? 'grid-cols-1 gap-1' : 'grid-cols-2'
            )}
          >
            <button
              type='button'
              onClick={() => onThemeChange('dark')}
              title={t('admin.theme.dark')}
              className={cn(
                'flex h-9 items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-all',
                theme === 'dark'
                  ? 'bg-white text-violet-600 shadow-sm dark:bg-violet-500/15 dark:text-violet-200'
                  : 'text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white'
              )}
            >
              <Moon className='size-4 shrink-0' />
              <span
                className={cn(
                  'overflow-hidden whitespace-nowrap transition-all duration-300',
                  isCollapsed && 'xl:w-0 xl:opacity-0'
                )}
              >
                {t('admin.theme.dark')}
              </span>
            </button>
            <button
              type='button'
              onClick={() => onThemeChange('light')}
              title={t('admin.theme.light')}
              className={cn(
                'flex h-9 items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-all',
                theme === 'light'
                  ? 'bg-white text-violet-600 shadow-sm dark:bg-violet-500/15 dark:text-violet-200'
                  : 'text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white'
              )}
            >
              <Sun className='size-4 shrink-0' />
              <span
                className={cn(
                  'overflow-hidden whitespace-nowrap transition-all duration-300',
                  isCollapsed && 'xl:w-0 xl:opacity-0'
                )}
              >
                {t('admin.theme.light')}
              </span>
            </button>
          </div>
        </div>

        <Button
          variant='ghost'
          title={t('admin.logout')}
          className={cn(
            'h-11 w-full rounded-xl text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-white/6 dark:hover:text-white',
            isCollapsed ? 'justify-center px-0' : 'justify-start gap-3'
          )}
          onClick={onLogout}
        >
          <LogOut className='size-5 shrink-0' />
          <span
            className={cn(
              'overflow-hidden whitespace-nowrap transition-all duration-300',
              isCollapsed && 'xl:w-0 xl:opacity-0'
            )}
          >
            {t('admin.logout')}
          </span>
        </Button>

        <div
          className={cn(
            'flex items-center gap-2 rounded-xl border border-violet-500/10 bg-violet-500/8 p-3 text-xs font-semibold text-violet-700 transition-all duration-300 dark:text-violet-200',
            isCollapsed ? 'justify-center px-2' : 'justify-start'
          )}
          title={t('admin.workspaceSynced')}
        >
          <BellDot className='size-4 shrink-0' />
          <span
            className={cn(
              'overflow-hidden whitespace-nowrap transition-all duration-300',
              isCollapsed && 'xl:w-0 xl:opacity-0'
            )}
          >
            {t('admin.workspaceSynced')}
          </span>
        </div>

        <button
          type='button'
          onClick={onToggleCollapse}
          className='flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-600 transition hover:text-violet-600 xl:hidden dark:border-white/8 dark:bg-white/5 dark:text-slate-300 dark:hover:text-violet-300'
        >
          {isCollapsed ? <ChevronRight className='size-4' /> : <ChevronLeft className='size-4' />}
          {isCollapsed ? t('admin.expand') : t('admin.collapse')}
        </button>
      </div>
    </aside>
  )
}
