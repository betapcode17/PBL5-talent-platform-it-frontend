import ChatSidebar from './ChatSidebar'
import ChatHeader from './ChatHeader'
import ChatMessageList from './ChatMessageList'
import ChatInput from './ChatInput'

function ChatFullPage() {
  return (
    <div className='mt-4 mx-4 mb-3 flex h-[calc(100vh-5rem)] min-h-170 overflow-hidden rounded-xl border border-slate-200 bg-slate-50'>
      <ChatSidebar />

      <div className='flex flex-1 flex-col'>
        <ChatHeader />
        <ChatMessageList />
        <ChatInput />
      </div>
    </div>
  )
}

export default ChatFullPage
