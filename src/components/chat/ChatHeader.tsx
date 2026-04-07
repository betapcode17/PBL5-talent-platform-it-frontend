import { Building2 } from 'lucide-react'
import { useChat } from '@/hooks/useChat'
import { useAuthStore } from '@/store/authStore'

function ChatHeader() {
  const { activeChatDetail } = useChat()
  const { user } = useAuthStore()

  // Nếu là EMPLOYEE thì header là tên công ty của employee
  let headerTitle = 'Chưa chọn công ty'
  if (user?.role === 'EMPLOYEE') {
    headerTitle = user?.company_name || 'Công ty của bạn'
  } else {
    headerTitle = activeChatDetail?.Company?.company_name || 'Chưa chọn công ty'
  }
  const isOnline = true

  return (
    <div className='flex items-center justify-between border-b border-slate-200 bg-white px-5 py-3'>
      <div className='flex items-center gap-3'>
        <div className='flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-600'>
          <Building2 className='h-5 w-5' />
        </div>
        <div className='flex flex-col'>
          <div className='text-xl font-semibold text-slate-800'>{headerTitle}</div>
          <div className={`text-sm ${isOnline ? 'text-emerald-600' : 'text-slate-400'}`}>
            {isOnline ? 'Online' : 'Offline'}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatHeader
