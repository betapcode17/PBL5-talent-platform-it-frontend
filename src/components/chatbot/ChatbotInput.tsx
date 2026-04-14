import { useState, useRef, type KeyboardEvent } from 'react'
import { Send, Paperclip, X } from 'lucide-react'

interface ChatInputProps {
  onSend: (message: string, files?: File[]) => void
  disabled?: boolean
  placeholder?: string
}

const ChatInput = ({ onSend, disabled, placeholder }: ChatInputProps) => {
  const [value, setValue] = useState('')
  const [attachedFiles, setAttachedFiles] = useState<File[]>([])
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSend = () => {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed, attachedFiles.length > 0 ? attachedFiles : undefined)
    setValue('')
    setAttachedFiles([])
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const pdfFiles = files.filter((file) => file.type === 'application/pdf')
    
    if (pdfFiles.length === 0 && files.length > 0) {
      alert('Only PDF files are supported')
      return
    }

    setAttachedFiles((prev) => [...prev, ...pdfFiles])
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handlePaperclipClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className='border-t bg-white p-4'>
      {/* Attached Files Display */}
      {attachedFiles.length > 0 && (
        <div className='mb-3 flex flex-wrap gap-2'>
          {attachedFiles.map((file, index) => (
            <div
              key={index}
              className='flex items-center gap-2 rounded-lg bg-purple-100 px-3 py-2 text-sm text-purple-700'
            >
              <svg className='h-4 w-4 flex-shrink-0' fill='currentColor' viewBox='0 0 20 20'>
                <path d='M8 16.5a1 1 0 11-2 0 1 1 0 012 0zM15 7a2 2 0 11-4 0 2 2 0 014 0zM2.5 11a2.5 2.5 0 100-5 2.5 2.5 0 000 5z' />
              </svg>
              <span className='truncate'>{file.name}</span>
              <button
                onClick={() => removeFile(index)}
                className='ml-1 hover:text-purple-900'
              >
                <X className='h-4 w-4' />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className='flex items-end gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-100'>
        <button
          onClick={handlePaperclipClick}
          disabled={disabled}
          className='mb-1 h-5 w-5 shrink-0 cursor-pointer text-slate-400 hover:text-purple-500 disabled:opacity-40'
        >
          <Paperclip className='h-5 w-5' />
        </button>
        <input
          ref={fileInputRef}
          type='file'
          multiple
          accept='.pdf'
          onChange={handleFileSelect}
          className='hidden'
        />
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
    </div>
  )
}

export default ChatInput
