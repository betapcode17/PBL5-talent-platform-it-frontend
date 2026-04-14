import { Building2, Search } from 'lucide-react'

const mockConversations = [
  {
    id: 1,
    company: 'HBA Corporation',
    preview: 'Thank you for your message. Looking forward to meeting you.',
    time: '5 months ago',
    unread: true
  },
  {
    id: 2,
    company: 'Bengo4.com,Inc.',
    preview: 'Good morning! We have reviewed your profile.',
    time: '6 months ago',
    unread: false
  },
  {
    id: 3,
    company: 'Management Solutions Co., Ltd.',
    preview: 'Please confirm your interview availability.',
    time: '6 months ago',
    unread: false
  },
  {
    id: 4,
    company: 'Golf Digest Online Inc. (GDO)',
    preview: 'Thanks for applying to our position.',
    time: '7 months ago',
    unread: false
  }
]

const ChatSidebar = () => {
  return (
    <aside className='flex h-full w-90 flex-col border-r border-slate-200 bg-white'>
      <div className='px-4 py-4'>
        <div className='flex items-center gap-2'>
          <div className='flex flex-1 items-center gap-2 rounded-lg border border-blue-500 px-3 py-2'>
            <Search className='h-4 w-4 text-blue-600' />
            <input
              type='text'
              placeholder='Search company'
              className='w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none'
            />
          </div>
        </div>
      </div>

      <div className='flex-1 overflow-y-auto px-3 pb-3'>
        {mockConversations.map((item) => {
          const isActive = item.id === 1
          return (
            <button
              type='button'
              key={item.id}
              className={`group mb-2 flex w-full items-start justify-between rounded-xl border px-3 py-3 text-left transition ${
                isActive
                  ? 'border-slate-200 bg-slate-100'
                  : 'border-transparent bg-white hover:border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className='mr-2 flex min-w-0 items-start gap-3'>
                <div className='mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-500'>
                  <Building2 className='h-4 w-4' />
                </div>

                <div className='min-w-0'>
                  <div className='truncate text-lg font-semibold text-slate-700'>{item.company}</div>
                  <div className='mt-1 truncate text-sm text-slate-500'>{item.preview}</div>
                </div>
              </div>

              <div className='flex shrink-0 flex-col items-end gap-2'>
                <span className='text-xs text-slate-400'>{item.time}</span>
                {item.unread ? <span className='h-2 w-2 rounded-full bg-red-500' /> : null}
              </div>

              <span className='sr-only'>Open conversation with {item.company}</span>
            </button>
          )
        })}
      </div>
    </aside>
  )
}

export default ChatSidebar
