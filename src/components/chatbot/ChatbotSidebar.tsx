import { useState } from 'react'
import type { Conversation } from '@/@types/chatbot'
import { SquarePen, Trash2, MessageCircle, Search, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChatSidebarProps {
  conversations: Conversation[]
  activeId: number | null
  isLoading: boolean
  onSelect: (id: number) => void
  onNew: () => void
  onDelete: (id: number) => void
  userName?: string
}

const ChatSidebar = ({ conversations, activeId, isLoading, onSelect, onNew, onDelete }: ChatSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false)
  const [search, setSearch] = useState('')

  const filtered = conversations.filter((c) => c.title.toLowerCase().includes(search.toLowerCase()))

  // Collapsed state — only show toggle button
  if (collapsed) {
    return (
      <aside className='flex h-full w-12 flex-col items-center border-r bg-white py-3'>
        <button
          onClick={() => setCollapsed(false)}
          className='rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900'
        >
          <PanelLeftOpen className='h-5 w-5' />
        </button>
      </aside>
    )
  }

  return (
    <aside className='flex h-full w-64 flex-col border-r bg-white'>
      {/* Top bar: Logo + New chat + Collapse */}
      <div className='flex items-center justify-between px-3 py-3'>
        <div className='flex h-8 w-8 items-center justify-center rounded-lg'>
          <svg
            viewBox='0 0 24 24'
            className='h-6 w-6 text-slate-800'
            fill='none'
            stroke='currentColor'
            strokeWidth='1.8'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path d='M12 8V4H8' />
            <rect x='4' y='8' width='16' height='12' rx='3' />
            <circle cx='9' cy='14' r='1' fill='currentColor' />
            <circle cx='15' cy='14' r='1' fill='currentColor' />
          </svg>
        </div>
        <div className='flex items-center gap-1'>
          <button
            onClick={onNew}
            title='New chat'
            className='rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900'
          >
            <SquarePen className='h-5 w-5' />
          </button>
          <button
            onClick={() => setCollapsed(true)}
            title='Close sidebar'
            className='rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900'
          >
            <PanelLeftClose className='h-5 w-5' />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className='px-3 pb-2'>
        <div className='flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2'>
          <Search className='h-4 w-4 text-slate-400' />
          <input
            type='text'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Search chats'
            className='w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none'
          />
        </div>
      </div>

      {/* Conversation list */}
      <div className='flex-1 overflow-y-auto px-2 py-1'>
        <div className='space-y-0.5'>
          {isLoading ? (
            <div className='px-2 py-4 text-center text-xs text-slate-400'>Loading...</div>
          ) : filtered.length === 0 ? (
            <div className='px-2 py-4 text-center text-xs text-slate-400'>
              {search ? 'No results found' : 'No conversations yet'}
            </div>
          ) : (
            filtered.map((conv) => (
              <div
                key={conv.id}
                onClick={() => onSelect(conv.id)}
                className={cn(
                  'group flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors',
                  activeId === conv.id
                    ? 'bg-slate-100 text-slate-900'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                )}
              >
                <div className='flex items-center gap-2 overflow-hidden'>
                  <MessageCircle className='h-4 w-4 shrink-0' />
                  <span className='truncate'>{conv.title}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(conv.id)
                  }}
                  className='hidden shrink-0 rounded p-1 text-slate-400 hover:text-red-500 group-hover:block'
                >
                  <Trash2 className='h-3.5 w-3.5' />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </aside>
  )
}

export default ChatSidebar
