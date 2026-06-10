import type { CSSProperties, ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import EmployeeHeader from './EmployeeHeader'
import EmployeeSidebar from './EmployeeSidebar'
import { EmployerWorkspaceProvider } from './EmployerWorkspaceContext'

type EmployerShellProps = {
  children: ReactNode
}

const EmployerShell = ({ children }: EmployerShellProps) => {
  const { t } = useTranslation()
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light'
    return (localStorage.getItem('employer-dashboard-theme') as 'light' | 'dark' | null) || 'light'
  })
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  const desktopSidebarWidth = isSidebarCollapsed ? '6rem' : '18.75rem'

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('employer-dashboard-theme', theme)
  }, [theme])

  return (
    <EmployerWorkspaceProvider>
      <div className='relative min-h-screen overflow-x-clip bg-slate-100 text-slate-950 transition-colors duration-300 dark:bg-[#080a16] dark:text-white'>
        <div className='pointer-events-none absolute inset-0 overflow-hidden'>
          <div className='absolute left-[-10rem] top-[-8rem] h-72 w-72 rounded-full bg-sky-200/25 blur-3xl dark:bg-sky-500/10' />
          <div className='absolute right-[-8rem] top-14 h-80 w-80 rounded-full bg-violet-200/30 blur-3xl dark:bg-violet-500/12' />
        </div>

        <div
          className='fixed inset-y-0 left-0 z-30 hidden transition-[width] duration-300 xl:block'
          style={{ width: desktopSidebarWidth }}
        >
          <div className='h-screen'>
            <EmployeeSidebar
              isCollapsed={isSidebarCollapsed}
              onToggleCollapse={() => setIsSidebarCollapsed((current) => !current)}
            />
          </div>
        </div>

        <div
          className='relative min-h-screen transition-[padding] duration-300 xl:pl-[var(--employer-sidebar-width)]'
          style={{ '--employer-sidebar-width': desktopSidebarWidth } as CSSProperties}
        >
          {isMobileSidebarOpen ? (
            <div className='fixed inset-0 z-50 xl:hidden'>
              <button
                type='button'
                aria-label={t('employer.header.closeNavigationDrawer')}
                className='absolute inset-0 bg-slate-950/52 backdrop-blur-sm'
                onClick={() => setIsMobileSidebarOpen(false)}
              />
              <div className='relative z-10 h-full w-fit'>
                <EmployeeSidebar
                  isCollapsed={false}
                  variant='mobile'
                  onNavigate={() => setIsMobileSidebarOpen(false)}
                  onClose={() => setIsMobileSidebarOpen(false)}
                />
              </div>
            </div>
          ) : null}

          <div className='flex min-w-0 flex-col'>
            <EmployeeHeader
              theme={theme}
              isMobileSidebarOpen={isMobileSidebarOpen}
              onToggleTheme={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
              onMobileMenuClick={() => setIsMobileSidebarOpen((current) => !current)}
            />

            <main className='min-w-0 flex-1 px-3 pb-8 pt-4 sm:px-4 lg:px-6 lg:pb-10 lg:pt-5 xl:px-7'>
              <div className='mx-auto flex min-w-0 w-full max-w-[1600px] flex-col gap-6'>{children}</div>
            </main>
          </div>
        </div>
      </div>
    </EmployerWorkspaceProvider>
  )
}

export default EmployerShell
