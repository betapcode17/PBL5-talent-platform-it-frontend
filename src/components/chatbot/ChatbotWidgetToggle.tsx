import { useChatbotStore } from '@/store/chatbotStore'

const ChatWidgetToggle = () => {
  const { isWidgetOpen, setWidgetOpen } = useChatbotStore()

  if (isWidgetOpen) return null

  return (
    <button
      onClick={() => setWidgetOpen(true)}
      className='fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg transition-all hover:from-purple-600 hover:to-indigo-700 hover:shadow-xl active:scale-95'
    >
      <svg
        viewBox='0 0 24 24'
        className='h-7 w-7 text-white'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.8'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <path d='M12 8V4H8' />
        <rect x='4' y='8' width='16' height='12' rx='3' />
        <circle cx='9' cy='14' r='1' fill='currentColor' />
        <circle cx='15' cy='14' r='1' fill='currentColor' />
      </svg>
    </button>
  )
}

export default ChatWidgetToggle
