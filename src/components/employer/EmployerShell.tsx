import type { CSSProperties, ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { useTranslation } from 'react-i18next'

import EmployeeHeader from './EmployeeHeader'
import EmployeeSidebar from './EmployeeSidebar'
import { EmployerWorkspaceProvider } from './EmployerWorkspaceContext'

type EmployerShellProps = {
  children: ReactNode
}

type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => { finished: Promise<void> }
}

const EmployerShell = ({ children }: EmployerShellProps) => {
  const { t } = useTranslation()
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light'
    return (localStorage.getItem('employer-dashboard-theme') as 'light' | 'dark' | null) || 'light'
  })
  const [isThemeWaveActive, setIsThemeWaveActive] = useState(false)
  const waveTimeoutRef = useRef<number | null>(null)
  const themeApplyTimeoutRef = useRef<number | null>(null)
  const themeTransitionActiveRef = useRef(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  const desktopSidebarWidth = isSidebarCollapsed ? '5.25rem' : '15rem'

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('employer-dashboard-theme', theme)
  }, [theme])

  useEffect(() => {
    return () => {
      if (waveTimeoutRef.current) {
        window.clearTimeout(waveTimeoutRef.current)
      }
      if (themeApplyTimeoutRef.current) {
        window.clearTimeout(themeApplyTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    document.documentElement.classList.add('employer-dashboard-scrollbar-hidden')

    return () => {
      document.documentElement.classList.remove('employer-dashboard-scrollbar-hidden')
    }
  }, [])

  const handleToggleTheme = () => {
    if (themeTransitionActiveRef.current) return

    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    const root = document.documentElement
    const transitionDocument = document as ViewTransitionDocument

    if (waveTimeoutRef.current) {
      window.clearTimeout(waveTimeoutRef.current)
    }

    root.dataset.themeTransition = nextTheme === 'dark' ? 'to-dark' : 'to-light'
    themeTransitionActiveRef.current = true
    setIsThemeWaveActive(true)

    const finishWave = () => {
      delete root.dataset.themeTransition
      waveTimeoutRef.current = window.setTimeout(() => {
        setIsThemeWaveActive(false)
        themeTransitionActiveRef.current = false
      }, 140)
    }

    const applyNextTheme = () => {
      root.classList.toggle('dark', nextTheme === 'dark')
      localStorage.setItem('employer-dashboard-theme', nextTheme)
      flushSync(() => setTheme(nextTheme))
    }

    if (transitionDocument.startViewTransition) {
      const transition = transitionDocument.startViewTransition(applyNextTheme)
      transition.finished.finally(finishWave)
      return
    }

    themeApplyTimeoutRef.current = window.setTimeout(applyNextTheme, 280)
    waveTimeoutRef.current = window.setTimeout(finishWave, 980)
  }

  return (
    <EmployerWorkspaceProvider>
      <div className='relative min-h-screen overflow-x-clip bg-[#f4f7fb] text-slate-950 transition-colors duration-500 dark:bg-[#11151d] dark:text-slate-50'>
        <div className={isThemeWaveActive ? 'theme-wave theme-wave--active' : 'theme-wave'} />
        <div className='pointer-events-none absolute inset-0 overflow-hidden'>
          <div className='absolute inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(255,255,255,0.94),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.88)_0%,rgba(241,245,249,0.82)_46%,rgba(226,232,240,0.72)_100%)] dark:bg-[radial-gradient(circle_at_18%_8%,rgba(226,232,240,0.1),transparent_24%),linear-gradient(180deg,rgba(226,232,240,0.08)_0%,rgba(148,163,184,0.035)_45%,rgba(15,18,25,0)_100%)]' />
          <div className='absolute inset-0 opacity-45 bg-[linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(180deg,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:72px_72px] dark:opacity-100 dark:bg-[linear-gradient(90deg,rgba(226,232,240,0.035)_1px,transparent_1px),linear-gradient(180deg,rgba(226,232,240,0.025)_1px,transparent_1px)]' />
        </div>

        <div
          className='fixed inset-y-0 left-0 z-30 hidden transition-[width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] xl:block'
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
          className='relative min-h-screen transition-[padding] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] xl:pl-[var(--employer-sidebar-width)]'
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
              onToggleTheme={handleToggleTheme}
              onMobileMenuClick={() => setIsMobileSidebarOpen((current) => !current)}
            />

            <main className='min-w-0 flex-1 px-3 pb-0 pt-3 sm:px-4 lg:px-6 lg:pt-4 xl:px-7'>
              <div className='mx-auto flex min-w-0 w-full max-w-[1600px] flex-col gap-6'>{children}</div>
            </main>
          </div>
        </div>
      </div>
    </EmployerWorkspaceProvider>
  )
}

export default EmployerShell
