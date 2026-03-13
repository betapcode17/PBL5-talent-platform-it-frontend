import { useState, useRef, type KeyboardEvent } from 'react'
import { Send, Paperclip } from 'lucide-react'

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
  placeholder?: string
}

const ChatInput = ({ onSend, disabled, placeholder }: ChatInputProps) => {
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>(null)

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

  return (
    <div className='border-t bg-white p-4'>
      <div className='flex items-end gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-100'>
        <Paperclip className='mb-1 h-5 w-5 shrink-0 cursor-pointer text-slate-400 hover:text-purple-500' />
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
