import type { ChatMessage } from '@/@types/chatbot'
import { cn } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'

interface ChatMessageBubbleProps {
  message: ChatMessage
}

const ChatMessageBubble = ({ message }: ChatMessageBubbleProps) => {
  const isUser = message.role === 'user'

  return (
    <div className={cn('flex w-full', isUser ? 'justify-end' : 'justify-start')}>
      <div className={cn('flex max-w-[80%] items-end gap-2', isUser && 'flex-row-reverse')}>
        {/* Avatar */}
        {!isUser && (
          <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 shadow-sm'>
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
        )}

        {/* Bubble */}
        <div
          className={cn(
            'min-w-0 break-words rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
            isUser ? 'rounded-br-md bg-purple-600 text-white' : 'rounded-bl-md bg-slate-100 text-slate-700'
          )}
        >
          {isUser ? (
            <span className='whitespace-pre-wrap break-words'>{message.content}</span>
          ) : (
            <ReactMarkdown
              components={{
                p: ({ children }) => <p className='mb-2 last:mb-0 break-words'>{children}</p>,
                strong: ({ children }) => <strong className='font-semibold'>{children}</strong>,
                ol: ({ children }) => <ol className='mb-2 list-decimal pl-4 space-y-1'>{children}</ol>,
                ul: ({ children }) => <ul className='mb-2 list-disc pl-4 space-y-1'>{children}</ul>,
                li: ({ children }) => <li className='break-words'>{children}</li>,
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='break-all text-indigo-600 underline hover:text-indigo-800'
                  >
                    {children}
                  </a>
                )
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChatMessageBubble
