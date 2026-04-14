import { Paperclip, SendHorizontal } from 'lucide-react'

function ChatInput() {
  return (
    <div className='border-t border-slate-200 bg-white p-4'>
      <div className='mx-auto flex w-[98%] items-center gap-2 rounded-xl border border-slate-200 px-3 py-2'>
        <button
          type='button'
          className='rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700'
        >
          <Paperclip className='h-5 w-5' />
        </button>

        <input
          type='text'
          placeholder='Type a message...'
          className='flex-1 bg-transparent py-1 text-base text-slate-700 placeholder:text-slate-400 focus:outline-none'
        />

        <button
          type='button'
          className='inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700'
        >
          <SendHorizontal className='h-4 w-4' />
          Send
        </button>
      </div>
    </div>
  )
}

export default ChatInput
