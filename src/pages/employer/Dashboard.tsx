import { Outlet } from 'react-router-dom'

import EmployerShell from '@/components/employer/EmployerShell'

const Dashboard = () => {
  return (
    <EmployerShell>
      <Outlet />
    </EmployerShell>
  )
}

export default Dashboard
