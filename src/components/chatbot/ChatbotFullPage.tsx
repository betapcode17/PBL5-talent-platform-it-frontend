import { useChatbot } from '@/hooks/useChatbot'
import ChatSidebar from './ChatbotSidebar'
import ChatHeader from './ChatbotHeader'
import ChatMessageList from './ChatbotMessageList'
import ChatInput from './ChatbotInput'
import ChatSuggestions from './ChatbotSuggestions'

const ChatFullPage = () => {
  const {
    user,
    conversations,
    activeConversationId,
    pendingConversationId,
    messages,
    isLoadingConversations,
    isLoadingMessages,
    isSending,
    setActiveConversation,
    createConversation,
    deleteConversation,
    handleSendMessage,
    handleSuggestionClick
  } = useChatbot()

  const hasMessages = messages.length > 0
  const selectedConversationId = pendingConversationId ?? activeConversationId

  return (
    <div className='flex h-screen bg-white'>
      {/* Sidebar */}
      <ChatSidebar
        conversations={conversations}
        activeId={selectedConversationId}
        isLoading={isLoadingConversations}
        onSelect={setActiveConversation}
        onNew={createConversation}
        onDelete={deleteConversation}
        userName={user?.full_name}
      />

      {/* Main Chat Area */}
      <div className='flex flex-1 flex-col'>
        <ChatHeader isFullScreen onToggleFullScreen={() => window.history.back()} onRefresh={createConversation} />

        {hasMessages || isLoadingMessages ? (
          <ChatMessageList messages={messages} isSending={isSending} isLoading={isLoadingMessages} />
        ) : (
          <div className='flex-1 overflow-y-auto'>
            <ChatSuggestions userName={user?.full_name?.split(' ')[0]} onSuggestionClick={handleSuggestionClick} />
          </div>
        )}

        <ChatInput onSend={handleSendMessage} disabled={isSending} />
      </div>
    </div>
  )
}

export default ChatFullPage
