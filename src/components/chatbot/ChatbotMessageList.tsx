import { useMemo } from 'react'
import type { ChatMessage } from '@/@types/chatbot'
import { useAutoScroll } from '@/hooks/useAutoScroll'
import type { HeaderMessageFilter } from './ChatbotHeader'
import ChatMessageBubble from './ChatbotMessageBubble'
import { Bot, Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

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
  return !!message.cvAnalysis || !!message.cvJdMatch || type.includes('cv') || intent.includes('cv')
}

const ChatMessageList = ({
  messages,
  isSending,
  streamStatus = null,
  isLoading = false,
  messageFilter = 'all'
}: ChatMessageListProps) => {
  const { t } = useTranslation()

  const filteredMessages = useMemo(() => {
    if (messageFilter === 'all') return messages

    return messages.filter((message) => {
      const cvMessage = isCvMessage(message)
      return messageFilter === 'cv' ? cvMessage : !cvMessage
    })
  }, [messages, messageFilter])

  const hasStreamingMessage = useMemo(
    () => filteredMessages.some((msg) => msg.role === 'assistant' && msg.isStreaming),
    [filteredMessages]
  )

  const bottomRef = useAutoScroll([filteredMessages, messageFilter, streamStatus])

  return (
    <div className='relative flex-1 overflow-y-auto px-2 py-4 sm:px-4'>
      <div className='space-y-4 max-w-4xl mx-auto'>
        {filteredMessages.map((msg) => (
          <ChatMessageBubble key={msg.id} message={msg} />
        ))}

        {!filteredMessages.length && messages.length > 0 ? (
          <div className='rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-6 text-center text-xs text-slate-500'>
            {messageFilter === 'cv'
              ? t('chatbot.emptyCvFilter')
              : messageFilter === 'jobs'
                ? t('chatbot.emptyJobsFilter')
                : t('chatbot.emptyAllFilter')}
          </div>
        ) : null}

        {/* Status / Loading indicator if sending and not streaming directly inside a bubble */}
        {isSending && !hasStreamingMessage && (
          <div className='flex items-start gap-2.5'>
            <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-xs'>
              <Bot className='h-4 w-4' />
            </div>

            <div className='rounded-2xl rounded-tl-sm border border-slate-200/80 bg-white px-4 py-3 shadow-2xs'>
              <div className='flex items-center gap-1.5'>
                <span className='h-2 w-2 animate-bounce rounded-full bg-violet-400' style={{ animationDelay: '0ms' }} />
                <span
                  className='h-2 w-2 animate-bounce rounded-full bg-violet-500'
                  style={{ animationDelay: '150ms' }}
                />
                <span
                  className='h-2 w-2 animate-bounce rounded-full bg-violet-600'
                  style={{ animationDelay: '300ms' }}
                />
                <span className='ml-2 text-xs font-medium text-slate-500'>
                  {streamStatus || t('chatbot.aiProcessing')}
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {isLoading && (
        <div className='absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-[1px] z-10'>
          <div className='flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-lg'>
            <Loader2 className='h-5 w-5 animate-spin text-violet-600' />
            <span className='text-xs font-semibold text-slate-700'>{t('chatbot.loadingMessages')}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatMessageList

