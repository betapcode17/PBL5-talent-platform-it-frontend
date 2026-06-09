import { useChatbot } from '@/hooks/useChatbot'
import { useState } from 'react'
import ChatHeader from './ChatbotHeader'
import ChatMessageList from './ChatbotMessageList'
import ChatInput from './ChatbotInput'
import ChatSuggestions from './ChatbotSuggestions'
import type { HeaderMessageFilter } from './ChatbotHeader'

const ChatWidget = () => {
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
    <div className='fixed bottom-10 right-6 z-50 flex h-[560px] w-[400px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl'>
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
        placeholder={chatMode === 'jobs' ? 'Ask me anything about your IT career...' : 'Choose a CV PDF to analyze'}
      />
    </div>
  )
}

export default ChatWidget
