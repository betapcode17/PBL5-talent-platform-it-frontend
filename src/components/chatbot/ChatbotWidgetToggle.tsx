import chatbot3dUrl from '@/assets/chatbot3d.svg'
import { useChatbotStore } from '@/store/chatbotStore'

const ChatWidgetToggle = () => {
  const { isWidgetOpen, setWidgetOpen } = useChatbotStore()

  if (isWidgetOpen) return null

  return (
    <button
      onClick={() => setWidgetOpen(true)}
      aria-label='Mo chatbot AI Career Advisor'
      className='group fixed bottom-4 right-4 z-50 flex h-28 w-28 items-center justify-center bg-transparent transition-transform duration-300 hover:-translate-y-1 active:scale-[0.98] sm:bottom-5 sm:right-5 sm:h-32 sm:w-32'
    >
      <span className='pointer-events-none absolute -inset-3 rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.22)_0%,rgba(125,211,252,0.14)_35%,rgba(255,255,255,0)_72%)] blur-xl transition-all duration-300 group-hover:scale-110 group-hover:bg-[radial-gradient(circle,rgba(56,189,248,0.28)_0%,rgba(125,211,252,0.16)_35%,rgba(255,255,255,0)_72%)]' />
      <span className='pointer-events-none absolute inset-1 rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.26),rgba(255,255,255,0)_68%)] opacity-80' />

      <span className='relative flex h-full w-full items-center justify-center overflow-visible'>
        <img
          src={chatbot3dUrl}
          alt='Chatbot 3D'
          className='relative z-10 h-[108%] w-[108%] object-contain drop-shadow-[0_18px_28px_rgba(14,165,233,0.24)] transition-transform duration-300 group-hover:scale-[1.14] group-hover:-rotate-3'
        />
      </span>
    </button>
  )
}

export default ChatWidgetToggle
