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

  // =========================
  // SEND MESSAGE
  // =========================
  const handleSend = () => {
    const trimmed = value.trim()

    // ✅ Cho phép gửi nếu có text HOẶC có file
    if ((!trimmed && attachedFiles.length === 0) || disabled) return

    console.log('Sending message:', trimmed)
    console.log('Sending files:', attachedFiles)

    onSend(trimmed, attachedFiles.length > 0 ? attachedFiles : undefined)

    // reset
    setValue('')
    setAttachedFiles([])
    inputRef.current?.focus()
  }

  // =========================
  // ENTER TO SEND
  // =========================
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // =========================
  // FILE SELECT
  // =========================
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    console.log('Selected files:', files)

    // chỉ nhận PDF
    const pdfFiles = files.filter((file) => file.type === 'application/pdf')

    if (pdfFiles.length === 0 && files.length > 0) {
      alert('Only PDF files are supported')
      return
    }

    setAttachedFiles((prev) => [...prev, ...pdfFiles])

    // reset input để chọn lại cùng file vẫn trigger
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // =========================
  // REMOVE FILE
  // =========================
  const removeFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handlePaperclipClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className='border-t bg-white p-4'>
      {/* ================= FILE PREVIEW ================= */}
      {attachedFiles.length > 0 && (
        <div className='mb-3 flex flex-wrap gap-2'>
          {attachedFiles.map((file, index) => (
            <div
              key={index}
              className='flex items-center gap-2 rounded-lg bg-purple-100 px-3 py-2 text-sm text-purple-700'
            >
              <span className='truncate'>{file.name}</span>

              <button onClick={() => removeFile(index)} className='ml-1 hover:text-purple-900'>
                <X className='h-4 w-4' />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ================= INPUT AREA ================= */}
      <div className='flex items-end gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-100'>
        {/* Upload button */}
        <button
          onClick={handlePaperclipClick}
          disabled={disabled}
          className='mb-1 h-5 w-5 shrink-0 text-slate-400 hover:text-purple-500 disabled:opacity-40'
        >
          <Paperclip className='h-5 w-5' />
        </button>

        {/* Hidden file input */}
        <input ref={fileInputRef} type='file' multiple accept='.pdf' onChange={handleFileSelect} className='hidden' />

        {/* Text input */}
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

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={(!value.trim() && attachedFiles.length === 0) || disabled}
          className='mb-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-600 text-white transition-colors hover:bg-purple-700 disabled:opacity-40'
        >
          <Send className='h-4 w-4' />
        </button>
      </div>
    </div>
  )
}

export default ChatInput
