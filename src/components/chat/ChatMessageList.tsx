import ChatMessageBubble from './ChatMessageBubble'

const mockMessages = [
  {
    id: 1,
    sender: 'company' as const,
    senderName: 'HBA Corporation',
    avatarText: 'HB',
    content:
      'We also welcome your questions. If you have any concerns before the interview, feel free to reply in this chat.',
    timestamp: '2025/10/21 14:10'
  },
  {
    id: 2,
    sender: 'company' as const,
    senderName: 'HBA Corporation',
    avatarText: 'HB',
    content: 'We are excited to meet you on the interview day. See you soon.',
    timestamp: '2025/10/21 14:12'
  },
  {
    id: 3,
    sender: 'me' as const,
    senderName: 'Tran Quoc Dat',
    avatarText: 'DD',
    content:
      'DearX,\nThank you for your message. I am also looking forward to meeting the HBA recruitment team, introducing myself, and learning more about your company.\nSee you on the interview day.\nBest regards,\nDang Quoc Dat',
    timestamp: '2025/10/21 18:02'
  }
]

const ChatMessageList = () => {
  return (
    <div className='flex-1 overflow-y-auto bg-slate-50 px-8 py-6'>
      {mockMessages.map((message) => (
        <ChatMessageBubble
          key={message.id}
          sender={message.sender}
          senderName={message.senderName}
          avatarText={message.avatarText}
          content={message.content}
          timestamp={message.timestamp}
        />
      ))}
    </div>
  )
}

export default ChatMessageList
