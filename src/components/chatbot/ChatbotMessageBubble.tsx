import type { ChatMessage } from '@/@types/chatbot'
import { cn } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'
import { FileText } from 'lucide-react'

interface ChatMessageBubbleProps {
  message: ChatMessage
}

const ChatMessageBubble = ({ message }: ChatMessageBubbleProps) => {
  const isUser = message.role === 'user'

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

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
        <div className={cn('min-w-0 break-words rounded-2xl px-4 py-2.5 text-sm leading-relaxed', isUser ? 'rounded-br-md bg-purple-600 text-white' : 'rounded-bl-md bg-slate-100 text-slate-700')}>
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

          {/* Attachments Display */}
          {message.attachments && message.attachments.length > 0 && (
            <div className={cn('mt-3 space-y-2 border-t', isUser ? 'border-purple-500 pt-3' : 'border-slate-300 pt-3')}>
              {message.attachments.map((attachment, index) => (
                <div
                  key={index}
                  className={cn(
                    'flex items-center gap-2 rounded-lg p-2',
                    isUser ? 'bg-purple-500' : 'bg-white'
                  )}
                >
                  <FileText className='h-4 w-4 flex-shrink-0' />
                  <div className='min-w-0 flex-1'>
                    <p className='truncate text-xs font-medium'>{attachment.name}</p>
                    <p className='text-xs opacity-75'>{formatFileSize(attachment.size)}</p>
                  </div>
                  {attachment.url && (
                    <a
                      href={attachment.url}
                      download
                      className={cn(
                        'flex-shrink-0 rounded px-2 py-1 text-xs font-semibold',
                        isUser ? 'bg-white text-purple-600 hover:bg-purple-100' : 'bg-purple-600 text-white hover:bg-purple-700'
                      )}
                    >
                      Download
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChatMessageBubble
