import { useMemo } from 'react'
import type { ChatMessage } from '@/@types/chatbot'
import { useAutoScroll } from '@/hooks/useAutoScroll'
import type { HeaderMessageFilter } from './ChatbotHeader'
import ChatMessageBubble from './ChatbotMessageBubble'

interface ChatMessageListProps {
  messages: ChatMessage[]
  isSending: boolean
  streamStatus?: string | null
  isLoading?: boolean
  messageFilter?: HeaderMessageFilter
}

const isCvMessage = (message: ChatMessage) => {
  const type = String(message.messageType || '').toLowerCase()
  const intent = String(message.detectedIntent || '').toLowerCase()
  return !!message.cvAnalysis || type.includes('cv') || intent.includes('cv')
}

const ChatMessageList = ({
  messages,
  isSending,
  streamStatus = null,
  isLoading = false,
  messageFilter = 'all'
}: ChatMessageListProps) => {
  const filteredMessages = useMemo(() => {
    if (messageFilter === 'all') return messages

    return messages.filter((message) => {
      const cvMessage = isCvMessage(message)
      return messageFilter === 'cv' ? cvMessage : !cvMessage
    })
  }, [messages, messageFilter])

  const bottomRef = useAutoScroll([filteredMessages, messageFilter])

  return (
    <div className='relative flex-1 overflow-y-auto bg-slate-50/60 transition-colors duration-500 dark:bg-[#171c26]'>
      <div className='space-y-4 p-4'>
        {filteredMessages.map((msg) => (
          <ChatMessageBubble key={msg.id} message={msg} />
        ))}

        {!filteredMessages.length && messages.length > 0 ? (
          <div className='rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500'>
            {messageFilter === 'cv'
              ? 'Conversation nay hien chua co message CV.'
              : messageFilter === 'jobs'
                ? 'Conversation nay hien chua co message job.'
                : 'Chua co message nao trong conversation nay.'}
          </div>
        ) : null}

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
            <div className='rounded-2xl rounded-bl-md bg-slate-100 px-4 py-3 dark:bg-slate-200/10'>
              <div className='flex gap-1'>
                <span className='h-2 w-2 animate-bounce rounded-full bg-slate-400' style={{ animationDelay: '0ms' }} />
                <span
                  className='h-2 w-2 animate-bounce rounded-full bg-slate-400'
                  style={{ animationDelay: '150ms' }}
                />
                <span
                  className='h-2 w-2 animate-bounce rounded-full bg-slate-400'
                  style={{ animationDelay: '300ms' }}
                />
              </div>
              {streamStatus ? <p className='mt-2 text-xs text-slate-500'>{streamStatus}</p> : null}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {isLoading && (
        <div className='absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-[1px] dark:bg-[#171c26]/72'>
          <div className='flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm dark:border-slate-300/16 dark:bg-[#252b38]'>
            <div className='h-6 w-6 animate-spin rounded-full border-2 border-violet-300 border-t-violet-600' />
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatMessageList
