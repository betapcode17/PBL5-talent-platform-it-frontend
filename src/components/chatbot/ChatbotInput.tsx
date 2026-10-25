import { useEffect, useRef, useState, type ChangeEvent, type KeyboardEvent } from 'react'
import { ChevronDown, ChevronUp, Send, Upload, FileText, X, Sparkles, Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { ChatMode } from '@/@types/chatbot'

interface ChatInputProps {
  onSend: (message: string) => void
  onAnalyzeCv?: (file: File, jdText?: string) => void
  disabled?: boolean
  placeholder?: string
  mode?: ChatMode
  conversationId?: string | number | null
}

const ChatInput = ({
  onSend,
  onAnalyzeCv,
  disabled,
  placeholder,
  mode = 'jobs',
  conversationId = null
}: ChatInputProps) => {
  const { t } = useTranslation()
  const [value, setValue] = useState('')
  const [jdValue, setJdValue] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isCvPanelExpanded, setIsCvPanelExpanded] = useState(true)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const storageKey =
    conversationId !== undefined && conversationId !== null && String(conversationId).trim()
      ? `chatbot:cv-panel:${String(conversationId)}`
      : 'chatbot:cv-panel:default'

  useEffect(() => {
    if (mode === 'jobs') {
      setSelectedFile(null)
      setJdValue('')
    }
  }, [mode])

  useEffect(() => {
    if (mode !== 'cv') return
    try {
      const stored = window.localStorage.getItem(storageKey)
      if (stored === 'collapsed') {
        setIsCvPanelExpanded(false)
        return
      }
      if (stored === 'expanded') {
        setIsCvPanelExpanded(true)
        return
      }
    } catch {
      // Ignore localStorage access errors
    }
    setIsCvPanelExpanded(true)
  }, [mode, storageKey])

  const toggleCvPanel = () => {
    setIsCvPanelExpanded((prev) => {
      const next = !prev
      try {
        window.localStorage.setItem(storageKey, next ? 'expanded' : 'collapsed')
      } catch {
        // Ignore
      }
      return next
    })
  }

  const handleSend = () => {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setValue('')
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    setSelectedFile(file)
  }

  const handleAnalyze = () => {
    if (!selectedFile || disabled || !onAnalyzeCv) return
    onAnalyzeCv(selectedFile, jdValue.trim() || undefined)
    setSelectedFile(null)
    setJdValue('')
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (disabled) return
    const file = e.dataTransfer.files?.[0]
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file)
    }
  }

  return (
    <div className='border-t border-slate-200/80 bg-white/95 p-3.5 backdrop-blur-sm shadow-xs'>
      {mode === 'jobs' ? (
        /* Jobs & General Query Input */
        <div className='rounded-2xl border border-slate-200 bg-slate-50/80 p-2 shadow-2xs transition-all focus-within:border-violet-400 focus-within:bg-white focus-within:ring-3 focus-within:ring-violet-100'>
          <div className='flex items-end gap-2'>
            <textarea
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder || t('chatbot.inputPlaceholderJobs')}
              disabled={disabled}
              rows={1}
              className='max-h-32 min-h-[38px] flex-1 resize-none bg-transparent px-2.5 py-1.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none'
            />

            <button
              onClick={handleSend}
              disabled={!value.trim() || disabled}
              type='button'
              className='mb-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-xs transition-all hover:opacity-95 hover:shadow-sm active:scale-95 disabled:opacity-40'
              aria-label={t('chatbot.send')}
            >
              {disabled ? <Loader2 className='h-4 w-4 animate-spin' /> : <Send className='h-4 w-4' />}
            </button>
          </div>

          <div className='flex items-center justify-between px-2 pt-1.5 text-[11px] text-slate-400'>
            <span>{t('chatbot.tipEnter')}</span>
            <span className='hidden sm:inline'>{t('chatbot.engine')}</span>
          </div>
        </div>
      ) : (
        /* CV & JD Analysis Mode */
        <div className='space-y-3'>
          <div className='rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-xs'>
            <div className='flex items-center justify-between gap-3'>
              <div className='flex items-center gap-2'>
                <div className='flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100 text-violet-700 font-bold'>
                  <FileText className='h-4 w-4' />
                </div>
                <div>
                  <p className='text-xs font-bold text-slate-800'>{t('chatbot.cvPanelTitle')}</p>
                  <p className='text-[11px] text-slate-500'>
                    {selectedFile ? t('chatbot.cvPanelSelected', { name: selectedFile.name }) : t('chatbot.cvPanelSubtitle')}
                  </p>
                </div>
              </div>

              <button
                type='button'
                onClick={toggleCvPanel}
                className='inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 transition-colors hover:border-violet-300 hover:text-violet-700'
              >
                {isCvPanelExpanded ? (
                  <>
                    <ChevronDown className='h-3.5 w-3.5' />
                    {t('chatbot.collapse')}
                  </>
                ) : (
                  <>
                    <ChevronUp className='h-3.5 w-3.5' />
                    {t('chatbot.expand')}
                  </>
                )}
              </button>
            </div>

            {isCvPanelExpanded && (
              <div className='mt-3 space-y-3 border-t border-slate-100 pt-3'>
                {/* File picker drop area */}
                <input
                  ref={fileInputRef}
                  type='file'
                  accept='.pdf'
                  className='hidden'
                  onChange={handleFileChange}
                />

                {!selectedFile ? (
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className='flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-violet-200 bg-violet-50/30 p-4 transition-all hover:border-violet-400 hover:bg-violet-50/70'
                  >
                    <Upload className='h-6 w-6 text-violet-600 mb-1.5' />
                    <p className='text-xs font-semibold text-slate-700'>
                      {t('chatbot.cvDropzone')}
                    </p>
                    <p className='text-[11px] text-slate-400 mt-0.5'>{t('chatbot.cvDropzoneSub')}</p>
                  </div>
                ) : (
                  <div className='flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/60 p-2.5'>
                    <div className='flex items-center gap-2 min-w-0'>
                      <FileText className='h-5 w-5 text-emerald-600 shrink-0' />
                      <div className='min-w-0 truncate'>
                        <p className='truncate text-xs font-semibold text-emerald-950'>{selectedFile.name}</p>
                        <p className='text-[10px] text-emerald-700'>
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • {t('chatbot.cvReady')}
                        </p>
                      </div>
                    </div>

                    <div className='flex items-center gap-1.5 shrink-0'>
                      <button
                        type='button'
                        onClick={() => fileInputRef.current?.click()}
                        className='rounded-md border border-emerald-300 bg-white px-2 py-1 text-[11px] font-semibold text-emerald-800 hover:bg-emerald-50'
                      >
                        {t('chatbot.cvChangeFile')}
                      </button>
                      <button
                        type='button'
                        onClick={() => setSelectedFile(null)}
                        className='rounded-md p-1 text-slate-400 hover:bg-white hover:text-slate-700'
                        aria-label={t('chatbot.cvRemoveFile')}
                      >
                        <X className='h-3.5 w-3.5' />
                      </button>
                    </div>
                  </div>
                )}

                {/* Optional JD box */}
                <div className='space-y-1'>
                  <div className='flex items-center justify-between text-[11px] text-slate-500'>
                    <span className='font-semibold text-slate-700'>{t('chatbot.jdOptional')}</span>
                    <span>{t('chatbot.jdSub')}</span>
                  </div>
                  <textarea
                    value={jdValue}
                    onChange={(e) => setJdValue(e.target.value)}
                    placeholder={t('chatbot.jdPlaceholder')}
                    disabled={disabled}
                    rows={2}
                    className='w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:outline-none'
                  />
                </div>

                {/* Submit analyze button */}
                <div className='flex justify-end'>
                  <button
                    onClick={handleAnalyze}
                    disabled={!selectedFile || disabled}
                    type='button'
                    className='flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition-all hover:opacity-95 hover:shadow-sm active:scale-95 disabled:opacity-40'
                  >
                    {disabled ? (
                      <>
                        <Loader2 className='h-3.5 w-3.5 animate-spin' />
                        {t('chatbot.analyzing')}
                      </>
                    ) : (
                      <>
                        <Sparkles className='h-3.5 w-3.5' />
                        {jdValue.trim() ? t('chatbot.analyzeWithJd') : t('chatbot.analyzeCvOnly')}
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Follow-up question box */}
          <div className='rounded-2xl border border-slate-200 bg-slate-50/80 p-2 shadow-2xs focus-within:border-violet-400 focus-within:bg-white focus-within:ring-3 focus-within:ring-violet-100'>
            <div className='flex items-end gap-2'>
              <textarea
                ref={inputRef}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t('chatbot.followUpCvPlaceholder')}
                disabled={disabled}
                rows={1}
                className='max-h-24 min-h-[36px] flex-1 resize-none bg-transparent px-2.5 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none'
              />

              <button
                onClick={handleSend}
                disabled={!value.trim() || disabled}
                type='button'
                className='mb-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white shadow-xs transition-all hover:bg-violet-700 active:scale-95 disabled:opacity-40'
                aria-label={t('chatbot.followUpSend')}
              >
                <Send className='h-3.5 w-3.5' />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default ChatInput

