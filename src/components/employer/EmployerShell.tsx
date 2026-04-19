import type { ReactNode } from 'react'
import { useState } from 'react'
import EmployeeHeader from './EmployeeHeader'
import EmployeeSidebar from './EmployeeSidebar'
import { EmployerWorkspaceProvider } from './EmployerWorkspaceContext'

type EmployerShellProps = {
  children: ReactNode
}

const EmployerShell = ({ children }: EmployerShellProps) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  return (
    <EmployerWorkspaceProvider>
      <div className='flex h-screen'>
        {/* Sidebar - Always visible on desktop, toggle collapse on desktop */}
        <div className='hidden lg:flex'>
          <EmployeeSidebar isCollapsed={isSidebarCollapsed} />
        </div>

        {/* Right Content Area */}
        <div className='flex flex-1 flex-col'>
          {/* Header */}
          <EmployeeHeader onMenuClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />

          {/* Main Content */}
          <main className='flex-1 overflow-y-auto bg-slate-50 px-4 py-6 sm:px-6 lg:px-8'>{children}</main>
        </div>
      </div>
    </EmployerWorkspaceProvider>
  )
}

export default EmployerShell
