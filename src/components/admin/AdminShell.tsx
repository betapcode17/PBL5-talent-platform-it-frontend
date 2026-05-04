import { useEffect, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminTopbar } from '@/components/admin/AdminTopbar'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'
import type { AdminTheme } from '@/types/admin'

type AdminShellProps = {
  title: string
  subtitle?: string
  children: ReactNode
}

export function AdminShell({ title, subtitle, children }: AdminShellProps) {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [theme, setTheme] = useState<AdminTheme>(() => {
    if (typeof window === 'undefined') return 'dark'
    return (localStorage.getItem('admin-dashboard-theme') as AdminTheme | null) || 'dark'
  })
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem('admin-sidebar-collapsed') === 'true'
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('admin-dashboard-theme', theme)
  }, [theme])

  useEffect(() => {
    localStorage.setItem('admin-sidebar-collapsed', String(isSidebarCollapsed))
  }, [isSidebarCollapsed])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className='min-h-screen overflow-x-hidden bg-[#f4f6fb] text-slate-950 dark:bg-[#080a16] dark:text-white'>
      <AdminSidebar
        theme={theme}
        isCollapsed={isSidebarCollapsed}
        onThemeChange={setTheme}
        onToggleCollapse={() => setIsSidebarCollapsed((current) => !current)}
        onLogout={handleLogout}
      />

      <main
        className={cn(
          'min-h-screen min-w-0 px-4 py-6 transition-[padding] duration-300 ease-out sm:px-6 lg:px-8',
          isSidebarCollapsed ? 'xl:pl-32' : 'xl:pl-80'
        )}
      >
        <div className='mx-auto w-full min-w-0 max-w-360 space-y-6'>
          <AdminTopbar title={title} subtitle={subtitle} adminName={user?.full_name || 'Super Admin'} />
          {children}
        </div>
      </main>
    </div>
  )
}
