import { useChatbot } from '@/hooks/useChatbot'
import { useState } from 'react'
import ChatSidebar from './ChatbotSidebar'
import ChatHeader from './ChatbotHeader'
import ChatMessageList from './ChatbotMessageList'
import ChatInput from './ChatbotInput'
import ChatSuggestions from './ChatbotSuggestions'
import type { HeaderMessageFilter } from './ChatbotHeader'

const ChatbotFullPage = () => {
  const [messageFilter, setMessageFilter] = useState<HeaderMessageFilter>('all')
  const {
    user,
    conversations,
    activeConversationId,
    pendingConversationId,
    chatMode,
    messages,
    isLoadingConversations,
    isLoadingMessages,
    isSending,
    streamStatus,
    deletingConversationId,
    setActiveConversation,
    createConversation,
    deleteConversation,
    renameConversation,
    setChatMode,
    handleSendMessage,
    handleSuggestionClick,
    handleCvUpload
  } = useChatbot()

  const hasMessages = messages.length > 0
  const selectedConversationId = pendingConversationId ?? activeConversationId

  return (
    <div className='flex h-screen bg-white transition-colors duration-500 dark:bg-[#11151d]'>
      {/* Sidebar */}
      <ChatSidebar
        conversations={conversations}
        activeId={selectedConversationId}
        isLoading={isLoadingConversations}
        isDeletingId={deletingConversationId}
        onSelect={setActiveConversation}
        onNew={createConversation}
        onDelete={deleteConversation}
        onRename={renameConversation}
        userName={user?.full_name}
      />

      {/* Main Chat Area */}
      <div className='flex flex-1 flex-col'>
        <ChatHeader
          isFullScreen
          onToggleFullScreen={() => window.history.back()}
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
          conversationId={selectedConversationId}
          onSend={handleSendMessage}
          onAnalyzeCv={handleCvUpload}
          disabled={isSending}
          placeholder={chatMode === 'jobs' ? 'Ask me anything about your IT career...' : 'Choose a CV PDF to analyze'}
        />
      </div>
    </div>
  )
}

export default ChatbotFullPage
