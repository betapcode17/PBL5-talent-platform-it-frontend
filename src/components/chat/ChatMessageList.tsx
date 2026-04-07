import { useChat } from '@/hooks/useChat'
import ChatMessageBubble from './ChatMessageBubble'

const ChatMessageList = () => {
  const { chatMessages, user, activeChatDetail } = useChat()

  return (
    <div className='flex-1 overflow-y-auto bg-slate-50 px-8 py-6'>
      {[...chatMessages].reverse().map((msg) => {
        // Xác định tên người gửi dựa vào sender_type và role
        let senderName = ''
        let avatarChar = ''

        if (msg.sender_type === 'SEEKER') {
          // Tin từ SEEKER
          if (user?.role === 'SEEKER') {
            // User là SEEKER, nên SEEKER = tôi
            senderName = user.full_name || 'Tôi'
            avatarChar = user.full_name?.[0] || 'T'
          } else {
            // User không phải SEEKER (là EMPLOYEE), nên SEEKER = ứng viên
            senderName = activeChatDetail?.Seeker?.User?.full_name || 'Ứng viên'
            avatarChar = activeChatDetail?.Seeker?.User?.full_name?.[0] || 'U'
          }
        } else {
          // Tin từ EMPLOYEE
          if (user?.role === 'EMPLOYEE') {
            // User là EMPLOYEE, nên EMPLOYEE = tôi
            senderName = user.full_name || 'Tôi'
            avatarChar = user.full_name?.[0] || 'T'
          } else {
            // User không phải EMPLOYEE (là SEEKER), nên EMPLOYEE = công ty
            senderName = activeChatDetail?.Company?.company_name || 'Công ty'
            avatarChar = activeChatDetail?.Company?.company_name?.[0] || 'C'
          }
        }

        return (
          <ChatMessageBubble
            key={msg.message_id}
            senderType={msg.sender_type}
            senderName={senderName}
            avatarText={avatarChar}
            content={msg.content}
            timestamp={new Date(msg.sent_at).toLocaleString('vi-VN', {
              hour: '2-digit',
              minute: '2-digit',
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            })}
          />
        )
      })}
    </div>
  )
}

export default ChatMessageList
