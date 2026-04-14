import { useChat } from '@/hooks/useChat'
import { useAuthStore } from '@/store/authStore'

function ChatHeader() {
  const { activeChatDetail } = useChat()
  const { user } = useAuthStore()

  // Hiển thị tên ứng viên nếu là EMPLOYEE, tên công ty nếu là SEEKER
  let headerTitle = 'Chưa chọn'
  let avatarText = ''
  let avatarBgColor = 'bg-slate-100'
  let avatarTextColor = 'text-slate-600'

  // Guard: Nếu chưa có activeChatDetail
  if (!activeChatDetail) {
    return (
      <div className='flex items-center justify-between border-b border-slate-200 bg-white px-5 py-3'>
        <div className='flex items-center gap-3'>
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-full font-semibold ${avatarBgColor} ${avatarTextColor}`}
          >
            -
          </div>
          <div className='flex flex-col'>
            <div className='text-xl font-semibold text-slate-800'>{headerTitle}</div>
            <div className='text-sm text-slate-400'>Offline</div>
          </div>
        </div>
      </div>
    )
  }

  if (user?.role === 'EMPLOYEE') {
    // EMPLOYEE xem tên ứng viên
    headerTitle = activeChatDetail.Seeker?.User?.full_name || 'Chưa chọn ứng viên'
    avatarText = activeChatDetail.Seeker?.User?.full_name?.[0]?.toUpperCase() || 'U'
    avatarBgColor = 'bg-blue-50'
    avatarTextColor = 'text-blue-600'
  } else {
    // SEEKER xem tên công ty
    headerTitle = activeChatDetail.Company?.company_name || 'Chưa chọn công ty'
    avatarText = activeChatDetail.Company?.company_name?.[0]?.toUpperCase() || 'C'
    avatarBgColor = 'bg-green-50'
    avatarTextColor = 'text-green-600'
  }

  const isOnline = true

  return (
    <div className='flex items-center justify-between border-b border-slate-200 bg-white px-5 py-3'>
      <div className='flex items-center gap-3'>
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-full font-semibold ${avatarBgColor} ${avatarTextColor}`}
        >
          {avatarText}
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
