import { X, Maximize2, Minimize2, RotateCcw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface ChatHeaderProps {
  onClose?: () => void
  isFullScreen?: boolean
  onToggleFullScreen?: () => void
  onRefresh?: () => void
}

const ChatHeader = ({ onClose, isFullScreen, onToggleFullScreen, onRefresh }: ChatHeaderProps) => {
  const navigate = useNavigate()

  const handleFullScreenToggle = () => {
    if (!isFullScreen) {
      // Từ widget → chuyển sang trang full
      onClose?.()
      navigate('/chat')
    } else {
      onToggleFullScreen?.()
    }
  }

  return (
    <div className='flex items-center justify-between border-b bg-white px-4 py-3'>
      <div className='flex items-center gap-3'>
        <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-md'>
          <svg
            viewBox='0 0 24 24'
            className='h-5 w-5 text-white'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path d='M12 8V4H8' />
            <rect x='4' y='8' width='16' height='12' rx='3' />
            <circle cx='9' cy='14' r='1' fill='currentColor' />
            <circle cx='15' cy='14' r='1' fill='currentColor' />
          </svg>
        </div>
        <div>
          <h3 className='text-sm font-semibold text-slate-800'>AI Career Advisor</h3>
          <div className='flex items-center gap-1.5'>
            <span className='h-2 w-2 rounded-full bg-green-500' />
            <span className='text-xs text-slate-500'>Online</span>
          </div>
        </div>
      </div>
      <div className='flex items-center gap-1'>
        {onRefresh && (
          <button
            onClick={onRefresh}
            title='New chat'
            className='rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600'
          >
            <RotateCcw className='h-4 w-4' />
          </button>
        )}
        <button
          onClick={handleFullScreenToggle}
          className='rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600'
        >
          {isFullScreen ? <Minimize2 className='h-4 w-4' /> : <Maximize2 className='h-4 w-4' />}
        </button>
        {onClose && (
          <button
            onClick={onClose}
            className='rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600'
          >
            <X className='h-4 w-4' />
          </button>
        )}
      </div>
    </div>
  )
}

export default ChatHeader
