type ChatMessageBubbleProps = {
  content: string
  timestamp: string
  sender: 'me' | 'company'
  senderName?: string
  avatarText?: string
}

function ChatMessageBubble({ content, timestamp, sender, senderName, avatarText }: ChatMessageBubbleProps) {
  const isMe = sender === 'me'
  const hasSenderName = Boolean(senderName)

  return (
    <div className={`mb-4 flex ${isMe ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[78%] items-start gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
            isMe ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-700'
          } ${hasSenderName ? 'mt-6' : 'mt-0'}`}
        >
          {avatarText || (isMe ? 'ME' : 'CO')}
        </div>

        <div className={`flex ${isMe ? 'items-end' : 'items-start'} flex-col`}>
          {senderName ? <div className='mb-1 text-sm font-semibold text-slate-700'>{senderName}</div> : null}

          <div
            className={`rounded-2xl px-4 py-3 text-sm leading-7 ${
              isMe ? 'rounded-tr-md bg-blue-700 text-white' : 'rounded-tl-md bg-slate-100 text-slate-800'
            }`}
          >
            {content}
          </div>

          <span className='mt-1 text-xs text-slate-400'>{timestamp}</span>
        </div>
      </div>
    </div>
  )
}

export default ChatMessageBubble
