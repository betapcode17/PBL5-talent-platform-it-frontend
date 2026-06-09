import { useEffect, useRef, useState, type ChangeEvent, type KeyboardEvent } from 'react'
import { ChevronDown, ChevronUp, Send, Upload } from 'lucide-react'
import type { ChatMode } from '@/@types/chatbot'

interface ChatInputProps {
  onSend: (message: string) => void
  onAnalyzeCv?: (file: File, jdText?: string) => void
  disabled?: boolean
  placeholder?: string
  mode?: ChatMode
  conversationId?: string | number | null
}

const ChatInput = ({ onSend, onAnalyzeCv, disabled, placeholder, mode = 'jobs', conversationId = null }: ChatInputProps) => {
  const [value, setValue] = useState('')
  const [jdValue, setJdValue] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isCvPanelExpanded, setIsCvPanelExpanded] = useState(true)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const jdTextareaRef = useRef<HTMLTextAreaElement>(null)
  const storageKey =
    conversationId !== undefined && conversationId !== null && String(conversationId).trim()
      ? `chatbot:cv-panel:${String(conversationId)}`
      : 'chatbot:cv-panel:default'
  const jdHeightStorageKey =
    conversationId !== undefined && conversationId !== null && String(conversationId).trim()
      ? `chatbot:cv-jd-height:${String(conversationId)}`
      : 'chatbot:cv-jd-height:default'

  useEffect(() => {
    if (mode === 'jobs') {
      setSelectedFile(null)
      setJdValue('')
      setIsCvPanelExpanded(true)
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

  useEffect(() => {
    if (mode !== 'cv') return
    try {
      window.localStorage.setItem(storageKey, isCvPanelExpanded ? 'expanded' : 'collapsed')
    } catch {
      // Ignore localStorage access errors
    }
  }, [isCvPanelExpanded, mode, storageKey])

  useEffect(() => {
    if (mode !== 'cv' || !jdTextareaRef.current) return

    try {
      const storedHeight = window.localStorage.getItem(jdHeightStorageKey)
      if (storedHeight) {
        const parsed = Number(storedHeight)
        if (Number.isFinite(parsed) && parsed >= 88) {
          jdTextareaRef.current.style.height = `${parsed}px`
        }
      }
    } catch {
      // Ignore localStorage access errors
    }
  }, [jdHeightStorageKey, mode, isCvPanelExpanded])

  const persistJdHeight = () => {
    if (!jdTextareaRef.current) return

    try {
      const nextHeight = Math.max(88, Math.round(jdTextareaRef.current.getBoundingClientRect().height))
      window.localStorage.setItem(jdHeightStorageKey, String(nextHeight))
      jdTextareaRef.current.style.height = `${nextHeight}px`
    } catch {
      // Ignore localStorage access errors
    }
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

  return (
    <div className='border-t bg-white p-4'>
      <div className='rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-100'>
        {mode === 'jobs' ? (
          <div className='flex items-end gap-2'>
            <textarea
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder || 'Ask me anything about your IT career...'}
              disabled={disabled}
              rows={1}
              className='max-h-32 flex-1 resize-none bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none'
            />

            <button
              onClick={handleSend}
              disabled={!value.trim() || disabled}
              className='mb-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-600 text-white transition-colors hover:bg-purple-700 disabled:opacity-40'
            >
              <Send className='h-4 w-4' />
            </button>
          </div>
        ) : (
          <div className='space-y-3'>
            <div className='rounded-xl border border-slate-200 bg-white p-3 shadow-sm'>
              <div className='flex items-start justify-between gap-3'>
                <div className='min-w-0'>
                  <p className='text-sm font-semibold text-slate-800'>Phan tich CV</p>
                  <p className='mt-1 text-xs text-slate-500'>
                    {selectedFile
                      ? `CV: ${selectedFile.name}${jdValue.trim() ? ' • co mo ta cong viec' : ' • chi phan tich CV'}`
                      : 'Chon CV va co the dan them mo ta cong viec. Ban co the thu gon phan nay de xem chat de hon.'}
                  </p>
                </div>
                <button
                  type='button'
                  onClick={() => setIsCvPanelExpanded((current) => !current)}
                  className='inline-flex shrink-0 items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:border-purple-300 hover:text-purple-700'
                >
                  {isCvPanelExpanded ? (
                    <>
                      <ChevronDown className='h-4 w-4' />
                      Thu gon
                    </>
                  ) : (
                    <>
                      <ChevronUp className='h-4 w-4' />
                      Mo rong
                    </>
                  )}
                </button>
              </div>

              <div
                className={`overflow-hidden transition-all duration-300 ease-out ${
                  isCvPanelExpanded ? 'mt-3 max-h-[520px] opacity-100' : 'mt-0 max-h-0 opacity-0'
                }`}
              >
                <div className='space-y-3 pb-1'>
                  <div className='flex items-center justify-between gap-3'>
                    <div>
                      <p className='text-xs font-medium text-slate-500'>Tai len CV PDF</p>
                    </div>
                    <label className='inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:border-purple-300 hover:text-purple-700'>
                      <Upload className='h-4 w-4' />
                      Chon file
                      <input type='file' accept='.pdf' className='hidden' onChange={handleFileChange} />
                    </label>
                  </div>

                  <div className='rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600'>
                    {selectedFile ? selectedFile.name : 'Chua chon file PDF'}
                  </div>

                  <div className='rounded-lg border border-slate-200 bg-white px-3 py-2'>
                    <div className='mb-2'>
                      <p className='text-sm font-semibold text-slate-800'>Mo ta cong viec tuy chon</p>
                      <p className='text-xs text-slate-500'>
                        Neu nhap mo ta cong viec, he thong se cham diem do phu hop cua CV va chi ra diem hop, diem thieu, can cai thien gi.
                      </p>
                    </div>
                    <textarea
                      ref={jdTextareaRef}
                      value={jdValue}
                      onChange={(e) => setJdValue(e.target.value)}
                      onMouseUp={persistJdHeight}
                      onTouchEnd={persistJdHeight}
                      onBlur={persistJdHeight}
                      placeholder='Dan job description vao day de danh gia do phu hop cua CV...'
                      disabled={disabled}
                      rows={3}
                      className='min-h-[88px] w-full resize-y overflow-auto bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none'
                    />
                  </div>

                  <div className='flex justify-end'>
                    <button
                      onClick={handleAnalyze}
                      disabled={!selectedFile || disabled}
                      className='flex h-10 items-center gap-2 rounded-lg bg-purple-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-purple-700 disabled:opacity-40'
                    >
                      <Upload className='h-4 w-4' />
                      {jdValue.trim() ? 'Phan tich do phu hop' : 'Phan tich CV'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className='rounded-lg border border-slate-200 bg-white px-3 py-2'>
              <div className='flex items-end gap-2'>
                <textarea
                  ref={inputRef}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder='Hoi tiep ve CV da phan tich, vi du: CV cua toi con thieu ky nang gi cho frontend?'
                  disabled={disabled}
                  rows={2}
                  className='max-h-32 flex-1 resize-none bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none'
                />

                <button
                  onClick={handleSend}
                  disabled={!value.trim() || disabled}
                  className='mb-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-600 text-white transition-colors hover:bg-purple-700 disabled:opacity-40'
                >
                  <Send className='h-4 w-4' />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatInput
