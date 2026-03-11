import { useChat } from '@/hooks/useChat'
import ChatHeader from './ChatHeader'
import ChatMessageList from './ChatMessageList'
import ChatInput from './ChatInput'
import ChatSuggestions from './ChatSuggestions'

const ChatWidget = () => {
  const {
    user,
    messages,
    isSending,
    isWidgetOpen,
    setWidgetOpen,
    createConversation,
    handleSendMessage,
    handleSuggestionClick
  } = useChat()

  if (!isWidgetOpen) return null

  const hasMessages = messages.length > 0

  return (
    <div className='fixed bottom-10 right-6 z-50 flex h-[560px] w-[400px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl'>
      <ChatHeader onClose={() => setWidgetOpen(false)} isFullScreen={false} onRefresh={createConversation} />

      {hasMessages ? (
        <ChatMessageList messages={messages} isSending={isSending} />
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
