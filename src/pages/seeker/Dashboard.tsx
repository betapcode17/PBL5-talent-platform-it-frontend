import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

const Dashboard = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className='min-h-screen bg-background'>
      {/* Header */}
      <header className='border-b bg-card'>
        <div className='container mx-auto flex items-center justify-between px-4 py-4'>
          <h1 className='text-xl font-bold text-primary'>ITJobVN - seeker</h1>
          <div className='flex items-center gap-4'>
            <span className='text-sm text-muted-foreground'>
              Xin chào, <strong>{user?.full_name}</strong>
            </span>
            <Button variant='outline' size='sm' onClick={handleLogout}>
              <LogOut className='mr-2 h-4 w-4' />
              Đăng xuất
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='container mx-auto px-4 py-8'>
        <h2 className='text-2xl font-bold mb-4'>Dashboard</h2>
        <p className='text-muted-foreground'>Chào mừng bạn đến với trang quản lý ứng viên!</p>
      </main>
    </div>
  )
}

export default Dashboard
