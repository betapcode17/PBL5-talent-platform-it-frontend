import { X, Maximize2, Minimize2, RotateCcw, Bot, Briefcase, FileText, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()
  const navigate = useNavigate()

  const handleFullScreenToggle = () => {
    if (!isFullScreen) {
      onClose?.()
      navigate('/chatbot')
      return
    }
    onToggleFullScreen?.()
  }

  return (
    <div className='flex flex-col border-b border-slate-200/80 bg-white/95 px-4 py-3 backdrop-blur-sm shadow-2xs'>
      {/* Top row: Brand & Action Controls */}
      <div className='flex items-center justify-between gap-3'>
        <div className='flex items-center gap-3 min-w-0'>
          <div className='relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-sm ring-2 ring-violet-100'>
            <Bot className='h-5 w-5' />
            <span className='absolute -bottom-0.5 -right-0.5 flex h-3 w-3'>
              <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75' />
              <span className='relative inline-flex h-3 w-3 rounded-full border-2 border-white bg-emerald-500' />
            </span>
          </div>

          <div className='min-w-0'>
            <div className='flex items-center gap-1.5'>
              <h3 className='truncate text-sm font-bold text-slate-900'>{t('chatbot.title')}</h3>
              <span className='hidden sm:inline-flex items-center gap-0.5 rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-semibold text-violet-700 border border-violet-200/50'>
                <Sparkles className='h-2.5 w-2.5' />
                {t('chatbot.multiAgent')}
              </span>
            </div>
            <p className='truncate text-[11px] text-slate-500'>{t('chatbot.subtitle')}</p>
          </div>
        </div>

        {/* Right action icons */}
        <div className='flex shrink-0 items-center gap-1'>
          {onRefresh && (
            <button
              onClick={onRefresh}
              type='button'
              title={t('chatbot.refreshTitle')}
              className='rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 active:scale-95'
              aria-label={t('chatbot.refreshTitle')}
            >
              <RotateCcw className='h-4 w-4' />
            </button>
          )}

          <button
            onClick={handleFullScreenToggle}
            type='button'
            title={isFullScreen ? t('chatbot.minimize') : t('chatbot.maximize')}
            className='rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 active:scale-95'
            aria-label={isFullScreen ? t('chatbot.minimize') : t('chatbot.maximize')}
          >
            {isFullScreen ? <Minimize2 className='h-4 w-4' /> : <Maximize2 className='h-4 w-4' />}
          </button>

          {onClose && (
            <button
              onClick={onClose}
              type='button'
              title={t('chatbot.close')}
              className='rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 active:scale-95'
              aria-label={t('chatbot.close')}
            >
              <X className='h-4 w-4' />
            </button>
          )}
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      {onModeChange && (
        <div className='mt-2.5 flex items-center justify-between gap-2 border-t border-slate-100 pt-2'>
          <div className='inline-flex rounded-xl bg-slate-100 p-0.5 text-xs font-medium text-slate-600'>
            <button
              type='button'
              onClick={() => {
                onModeChange('jobs')
                onMessageFilterChange?.('all')
              }}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all ${
                chatMode === 'jobs'
                  ? 'bg-white font-semibold text-violet-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Briefcase className='h-3.5 w-3.5' />
              {t('chatbot.modeJobs')}
            </button>

            <button
              type='button'
              onClick={() => {
                onModeChange('cv')
                onMessageFilterChange?.('all')
              }}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all ${
                chatMode === 'cv'
                  ? 'bg-white font-semibold text-violet-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className='h-3.5 w-3.5' />
              {t('chatbot.modeCv')}
            </button>
          </div>

          {/* Quick filter in fullscreen */}
          {isFullScreen && onMessageFilterChange && (
            <div className='hidden sm:flex items-center gap-1 text-[11px] text-slate-500'>
              <span className='font-medium'>{t('chatbot.filter')}</span>
              {(['all', 'jobs', 'cv'] as HeaderMessageFilter[]).map((f) => (
                <button
                  key={f}
                  type='button'
                  onClick={() => onMessageFilterChange(f)}
                  className={`rounded-md px-2 py-0.5 font-medium transition-colors ${
                    messageFilter === f ? 'bg-violet-100 text-violet-800' : 'hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  {f === 'all' ? t('chatbot.filterAll') : f === 'jobs' ? t('chatbot.filterJobs') : t('chatbot.filterCv')}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ChatHeader
