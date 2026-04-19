import { BriefcaseBusiness, CalendarClock, LayoutDashboard, Users } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import Logo from '@/components/ui/Logo'

type EmployeeSidebarProps = {
  isCollapsed: boolean
}

const navigationItems = [
  { label: 'Overview', href: '/employer', icon: LayoutDashboard, end: true },
  { label: 'Jobs', href: '/employer/jobs', icon: BriefcaseBusiness },
  { label: 'Candidates', href: '/employer/candidates', icon: Users },
  { label: 'Interviews', href: '/employer/interviews', icon: CalendarClock }
]

const EmployeeSidebar = ({ isCollapsed }: EmployeeSidebarProps) => {
  return (
    <aside
      className={cn(
        'flex-shrink-0 border-r border-slate-200 bg-white overflow-y-auto transition-all duration-300 flex flex-col h-screen',
        isCollapsed ? 'w-20' : 'w-72'
      )}
    >
      {/* Logo Section */}
      <div className={cn('border-b border-slate-200 px-4 py-6 flex items-center justify-center')}>
        <Logo />
      </div>

      {/* Navigation */}
      <nav className='flex-1 space-y-1 px-2 py-6'>
        {!isCollapsed && <p className='px-4 text-xs font-semibold uppercase text-slate-500 mb-4'>MENU</p>}

        {navigationItems.map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg py-3 transition-colors justify-center lg:justify-start',
                  isCollapsed ? 'px-2' : 'px-4',
                  isActive ? 'bg-violet-50 text-violet-700' : 'text-slate-700 hover:bg-slate-100'
                )
              }
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className='h-5 w-5 flex-shrink-0' />
              {!isCollapsed && <span className='text-sm font-medium'>{item.label}</span>}
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}

export default EmployeeSidebar
