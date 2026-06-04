import { Outlet } from 'react-router-dom'

const Dashboard = () => {
  return (
    <div className='min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),_transparent_30%),linear-gradient(180deg,#f8fafc_0%,#eef4ff_100%)]'>
      <Outlet />
    </div>
  )
}

export default Dashboard
