import { Building2 } from 'lucide-react'

function ChatHeader() {
  return (
    <div className='flex items-center justify-between border-b border-slate-200 bg-white px-5 py-3'>
      <div className='flex items-center gap-3'>
        <div className='flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-600'>
          <Building2 className='h-5 w-5' />
        </div>
        <div className='flex flex-col'>
          <div className='text-xl font-semibold text-slate-800'>HBA Corporation</div>
          <div className='text-sm text-emerald-600'>Online</div>
        </div>
      </div>
    </div>
  )
}

export default ChatHeader
