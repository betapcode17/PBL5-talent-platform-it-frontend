import { useChatbot } from '@/hooks/useChatbot'
import ChatHeader from './ChatbotHeader'
import ChatMessageList from './ChatbotMessageList'
import ChatInput from './ChatbotInput'
import ChatSuggestions from './ChatbotSuggestions'

const ChatWidget = () => {
  const {
    user,
    messages,
    isLoadingMessages,
    isSending,
    isWidgetOpen,
    setWidgetOpen,
    createConversation,
    handleSendMessage,
    handleSuggestionClick
  } = useChatbot()

  if (!isWidgetOpen) return null

  const hasMessages = messages.length > 0

  return (
    <div className='fixed bottom-10 right-6 z-50 flex h-[560px] w-[400px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl'>
      <ChatHeader onClose={() => setWidgetOpen(false)} isFullScreen={false} onRefresh={createConversation} />

      {hasMessages || isLoadingMessages ? (
        <ChatMessageList messages={messages} isSending={isSending} isLoading={isLoadingMessages} />
      ) : (
        <div className='flex-1 overflow-y-auto'>
          <ChatSuggestions userName={user?.full_name?.split(' ')[0]} onSuggestionClick={handleSuggestionClick} />
        </div>
      )}

      <ChatInput onSend={handleSendMessage} disabled={isSending} />
    </div>
  )
}

export default ChatWidget
