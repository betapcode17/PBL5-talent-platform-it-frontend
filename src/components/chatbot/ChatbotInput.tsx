import { useEffect, useRef, useState, type ChangeEvent, type KeyboardEvent } from 'react'
import { Send, Upload } from 'lucide-react'
import type { ChatMode } from '@/@types/chatbot'

interface ChatInputProps {
  onSend: (message: string) => void
  onAnalyzeCv?: (file: File) => void
  disabled?: boolean
  placeholder?: string
  mode?: ChatMode
}

const ChatInput = ({ onSend, onAnalyzeCv, disabled, placeholder, mode = 'jobs' }: ChatInputProps) => {
  const [value, setValue] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (mode === 'jobs') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedFile(null)
    }
  }, [mode])

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
    onAnalyzeCv(selectedFile)
    setSelectedFile(null)
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
            <div className='flex items-center justify-between gap-3'>
              <div>
                <p className='text-sm font-semibold text-slate-800'>Upload CV PDF</p>
                <p className='text-xs text-slate-500'>Hệ thống sẽ phân tích điểm mạnh, điểm yếu và gợi ý nên học gì.</p>
              </div>
              <label className='inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:border-purple-300 hover:text-purple-700'>
                <Upload className='h-4 w-4' />
                Chọn file
                <input type='file' accept='.pdf' className='hidden' onChange={handleFileChange} />
              </label>
            </div>

            <div className='flex items-center gap-2'>
              <div className='min-w-0 flex-1 rounded-lg border border-dashed border-slate-300 bg-white px-3 py-2 text-sm text-slate-600'>
                {selectedFile ? selectedFile.name : 'Chưa chọn file PDF'}
              </div>

              <button
                onClick={handleAnalyze}
                disabled={!selectedFile || disabled}
                className='flex h-10 items-center gap-2 rounded-lg bg-purple-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-purple-700 disabled:opacity-40'
              >
                <Upload className='h-4 w-4' />
                Phân tích CV
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatInput
