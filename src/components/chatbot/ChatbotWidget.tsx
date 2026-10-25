import { useChatbot } from '@/hooks/useChatbot'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import ChatHeader from './ChatbotHeader'
import ChatMessageList from './ChatbotMessageList'
import ChatInput from './ChatbotInput'
import ChatSuggestions from './ChatbotSuggestions'
import type { HeaderMessageFilter } from './ChatbotHeader'

const ChatWidget = () => {
  const { t } = useTranslation()
  const [messageFilter, setMessageFilter] = useState<HeaderMessageFilter>('all')
  const {
    user,
    messages,
    isLoadingMessages,
    isSending,
    streamStatus,
    isWidgetOpen,
    chatMode,
    setWidgetOpen,
    createConversation,
    setChatMode,
    handleSendMessage,
    handleSuggestionClick,
    handleCvUpload
  } = useChatbot()

  if (!isWidgetOpen) return null

  const hasMessages = messages.length > 0

  return (
    <div className='fixed bottom-4 right-4 z-50 flex h-[min(640px,calc(100vh-80px))] w-[calc(100vw-32px)] max-w-[440px] sm:bottom-6 sm:right-6 sm:w-[430px] flex-col overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-[0_25px_70px_-12px_rgba(15,23,42,0.22)] ring-1 ring-slate-900/5 animate-in fade-in-0 zoom-in-95 duration-200'>
      <ChatHeader
        onClose={() => setWidgetOpen(false)}
        isFullScreen={false}
        onRefresh={createConversation}
        chatMode={chatMode}
        onModeChange={setChatMode}
        messageFilter={messageFilter}
        onMessageFilterChange={setMessageFilter}
      />

      {hasMessages || isLoadingMessages ? (
        <ChatMessageList
          messages={messages}
          isSending={isSending}
          streamStatus={streamStatus}
          isLoading={isLoadingMessages}
          messageFilter={messageFilter}
        />
      ) : (
        <div className='flex-1 overflow-y-auto'>
          <ChatSuggestions
            userName={user?.full_name?.split(' ')[0]}
            onSuggestionClick={handleSuggestionClick}
            mode={chatMode}
          />
        </div>
      )}

      <ChatInput
        mode={chatMode}
        conversationId={null}
        onSend={handleSendMessage}
        onAnalyzeCv={handleCvUpload}
        disabled={isSending}
        placeholder={chatMode === 'jobs' ? t('chatbot.inputPlaceholderJobs') : t('chatbot.inputPlaceholderCv')}
      />
    </div>
  )
}

export default ChatWidget
