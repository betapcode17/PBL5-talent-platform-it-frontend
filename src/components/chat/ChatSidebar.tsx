import { Building2, Search } from 'lucide-react'
import { useChat } from '@/hooks/useChat'
import { useAuthStore } from '@/store/authStore'

const ChatSidebar = () => {
  const { chatCompanies, activeChatCompaniesId, handleSelectChat, isLoadingChatCompanies } = useChat()
  const { user } = useAuthStore()

  // Nếu là EMPLOYEE thì hiển thị danh sách ứng viên (seeker)
  // Map chatCompanies to include seeker info
  const itemsWithSeeker = chatCompanies.map((item) => ({
    ...item,
    seeker_name: item.seeker_name,
    seeker_id: item.seeker_id
  }))

  type SidebarItem = (typeof itemsWithSeeker)[number]
  let sidebarList: SidebarItem[] = itemsWithSeeker
  let getTitle: (item: SidebarItem) => string = (item) => item.company_name
  let getSubtitle: (item: SidebarItem) => string = (item) => item.last_message || 'No messages yet'
  if (user?.role === 'EMPLOYEE') {
    sidebarList = [...itemsWithSeeker].sort((a, b) => {
      if (!a.last_message_at && !b.last_message_at) return 0
      if (!a.last_message_at) return 1
      if (!b.last_message_at) return -1
      return new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime()
    })
    getTitle = (item) => item.seeker_name || `Seeker #${item.seeker_id ?? ''}`
    getSubtitle = (item) => item.last_message || 'No messages yet'
  } else {
    sidebarList = [...itemsWithSeeker].sort((a, b) => {
      if (!a.last_message_at && !b.last_message_at) return 0
      if (!a.last_message_at) return 1
      if (!b.last_message_at) return -1
      return new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime()
    })
    getTitle = (item) => item.company_name
    getSubtitle = (item) => item.last_message || 'No messages yet'
  }

  return (
    <aside className='flex h-full w-90 flex-col border-r border-slate-200 bg-white'>
      <div className='px-4 py-4'>
        <div className='flex items-center gap-2'>
          <div className='flex flex-1 items-center gap-2 rounded-lg border border-blue-500 px-3 py-2'>
            <Search className='h-4 w-4 text-blue-600' />
            <input
              type='text'
              placeholder='Search company'
              className='w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none'
              // TODO: Thêm logic search nếu muốn
            />
          </div>
        </div>
      </div>

      <div className='flex-1 overflow-y-auto px-3 pb-3'>
        {isLoadingChatCompanies ? (
          <div className='text-center text-slate-400 py-8'>Loading...</div>
        ) : sidebarList.length === 0 ? (
          <div className='text-center text-slate-400 py-8'>No conversations</div>
        ) : (
          sidebarList.map((item) => {
            const isActive = item.chat_id === activeChatCompaniesId
            return (
              <button
                type='button'
                key={item.chat_id}
                className={`group mb-2 flex w-full items-start justify-between rounded-xl border px-3 py-3 text-left transition ${
                  isActive
                    ? 'border-slate-200 bg-slate-100'
                    : 'border-transparent bg-white hover:border-slate-200 hover:bg-slate-50'
                }`}
                onClick={() => handleSelectChat(item.chat_id)}
              >
                <div className='mr-2 flex min-w-0 items-start gap-3'>
                  <div className='mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-500'>
                    <Building2 className='h-4 w-4' />
                  </div>

                  <div className='min-w-0'>
                    <div className='truncate text-lg font-semibold text-slate-700'>{getTitle(item)}</div>
                    <div className='mt-1 truncate text-sm text-slate-500'>{getSubtitle(item)}</div>
                  </div>
                </div>

                <div className='flex shrink-0 flex-col items-end gap-2'>
                  <span className='text-xs text-slate-400'>
                    {item.last_message_at
                      ? new Date(item.last_message_at).toLocaleDateString('vi-VN', {
                          month: 'short',
                          day: '2-digit',
                          year: 'numeric'
                        })
                      : ''}
                  </span>
                </div>

                <span className='sr-only'>Open conversation with {getTitle(item)}</span>
              </button>
            )
          })
        )}
      </div>
    </aside>
  )
}

export default ChatSidebar
