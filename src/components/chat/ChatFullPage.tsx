import { useChat } from '@/hooks/useChat'
import ChatSidebar from './ChatSidebar'
import ChatHeader from './ChatHeader'
import ChatMessageList from './ChatMessageList'
import ChatInput from './ChatInput'
import ChatSuggestions from './ChatSuggestions'

const ChatFullPage = () => {
  const {
    user,
    conversations,
    activeConversationId,
    messages,
    isLoadingConversations,
    isSending,
    setActiveConversation,
    createConversation,
    deleteConversation,
    handleSendMessage,
    handleSuggestionClick
  } = useChat()

  const hasMessages = messages.length > 0

  return (
    <div className='flex h-screen bg-white'>
      {/* Sidebar */}
      <ChatSidebar
        conversations={conversations}
        activeId={activeConversationId}
        isLoading={isLoadingConversations}
        onSelect={(id: number) => setActiveConversation(id)}
        onNew={createConversation}
        onDelete={deleteConversation}
        userName={user?.full_name}
      />

      {/* Main Chat Area */}
      <div className='flex flex-1 flex-col'>
        <ChatHeader isFullScreen onToggleFullScreen={() => window.history.back()} onRefresh={createConversation} />

        {hasMessages ? (
          <ChatMessageList messages={messages} isSending={isSending} />
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
