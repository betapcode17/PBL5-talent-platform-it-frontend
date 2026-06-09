import { X, Maximize2, Minimize2, RotateCcw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { ChatMode } from '@/@types/chatbot'

export type HeaderMessageFilter = 'all' | 'jobs' | 'cv'

interface ChatHeaderProps {
  onClose?: () => void
  isFullScreen?: boolean
  onToggleFullScreen?: () => void
  onRefresh?: () => void
  chatMode?: ChatMode
  onModeChange?: (mode: ChatMode) => void
  messageFilter?: HeaderMessageFilter
  onMessageFilterChange?: (filter: HeaderMessageFilter) => void
}

const FILTER_ITEMS: Array<{ key: HeaderMessageFilter; label: string }> = [
  { key: 'all', label: 'Tat ca' },
  { key: 'jobs', label: 'Hoi dap Job' },
  { key: 'cv', label: 'Phan tich CV' }
]

const ChatHeader = ({
  onClose,
  isFullScreen,
  onToggleFullScreen,
  onRefresh,
  chatMode = 'jobs',
  onModeChange,
  messageFilter = 'all',
  onMessageFilterChange
}: ChatHeaderProps) => {
  const navigate = useNavigate()

  const handleFullScreenToggle = () => {
    if (!isFullScreen) {
      onClose?.()
      navigate('/chatbot')
      return
    }

    onToggleFullScreen?.()
  }

  const handleFilterClick = (filter: HeaderMessageFilter) => {
    onMessageFilterChange?.(filter)
    if (filter !== 'all') {
      onModeChange?.(filter as ChatMode)
    }
  }

  const showFullWidthFilters = Boolean(isFullScreen && (onModeChange || onMessageFilterChange))

  return (
    <div className='flex items-start justify-between gap-4 border-b bg-white px-4 py-3'>
      <div className='flex min-w-0 items-start gap-3'>
        <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-md'>
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

        <div className='min-w-0'>
          <h3 className='text-sm font-semibold text-slate-800'>AI Career Advisor</h3>
          <div className='flex items-center gap-1.5'>
            <span className='h-2 w-2 rounded-full bg-green-500' />
            <span className='text-xs text-slate-500'>Online</span>
          </div>

          {showFullWidthFilters && (
            <div className='mt-2 inline-flex flex-wrap rounded-xl border border-slate-200 bg-slate-50 p-1 text-xs font-medium text-slate-600'>
              {FILTER_ITEMS.map((item) => (
                <button
                  key={item.key}
                  type='button'
                  onClick={() => handleFilterClick(item.key)}
                  className={`rounded-lg px-3 py-1.5 transition-all ${
                    messageFilter === item.key ? 'bg-white text-purple-700 shadow-sm' : 'hover:text-slate-800'
                  }`}
                  aria-pressed={messageFilter === item.key}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}

          {showFullWidthFilters && (
            <p className='mt-2 text-xs text-slate-500'>
              {messageFilter === 'all'
                ? `Dang hien tat ca message. Che do nhap hien tai: ${chatMode === 'cv' ? 'Phan tich CV' : 'Hoi dap Job'}.`
                : messageFilter === 'cv'
                  ? 'Chi dang hien message lien quan den CV trong conversation nay.'
                  : 'Chi dang hien message hoi dap cong viec trong conversation nay.'}
            </p>
          )}
        </div>
      </div>

      <div className='flex shrink-0 items-center gap-1'>
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
