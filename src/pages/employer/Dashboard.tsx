import { useAuthStore } from '@/store/authStore'

const Dashboard = () => {
  const { user } = useAuthStore()

  return (
    <div className='min-h-screen bg-background'>
      {/* Main Content */}
      <main className='container mx-auto px-4 py-8'>
        <h2 className='text-2xl font-bold mb-4'>Dashboard</h2>
        <p className='mb-2 text-sm text-muted-foreground'>
          Xin chào, <strong>{user?.full_name}</strong>
        </p>
        <p className='text-muted-foreground'>Chào mừng bạn đến với trang quản lý nhà tuyển dụng!</p>
      </main>
    </div>
  )
}

export default Dashboard
