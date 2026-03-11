import type { ChatMessage } from '@/@types/chat'
import ChatMessageBubble from './ChatMessageBubble'
import { useAutoScroll } from '@/hooks/useAutoScroll'

interface ChatMessageListProps {
  messages: ChatMessage[]
  isSending: boolean
}

const ChatMessageList = ({ messages, isSending }: ChatMessageListProps) => {
  const bottomRef = useAutoScroll([messages])

  return (
    <div className='flex-1 space-y-4 overflow-y-auto p-4'>
      {messages.map((msg) => (
        <ChatMessageBubble key={msg.id} message={msg} />
      ))}

      {/* Typing indicator */}
      {isSending && (
        <div className='flex items-end gap-2'>
          <div className='flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 shadow-sm'>
            <svg
              viewBox='0 0 24 24'
              className='h-4 w-4 text-white'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <path d='M12 8V4H8' />
              <rect x='4' y='8' width='16' height='12' rx='3' />
              <circle cx='9' cy='14' r='1' fill='currentColor' />
              <circle cx='15' cy='14' r='1' fill='currentColor' />
            </svg>
          </div>
          <div className='rounded-2xl rounded-bl-md bg-slate-100 px-4 py-3'>
            <div className='flex gap-1'>
              <span className='h-2 w-2 animate-bounce rounded-full bg-slate-400' style={{ animationDelay: '0ms' }} />
              <span className='h-2 w-2 animate-bounce rounded-full bg-slate-400' style={{ animationDelay: '150ms' }} />
              <span className='h-2 w-2 animate-bounce rounded-full bg-slate-400' style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  )
}

export default ChatMessageList
