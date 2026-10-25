import { Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

type LogoProps = {
  className?: string
  compact?: boolean
}

const Logo = ({ className, compact = false }: LogoProps) => {
  return (
    <Link
      to='/'
      className={cn(
        'group inline-flex min-w-0 items-center text-slate-950 transition-[gap] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] dark:text-slate-100',
        compact ? 'gap-0' : 'gap-3',
        className
      )}
    >
      <div className='relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-fuchsia-500 text-white shadow-[0_8px_20px_-4px_rgba(124,58,237,0.4)] transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_12px_28px_-4px_rgba(124,58,237,0.55)]'>
        {/* Geometric Tech Emblem */}
        <svg
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          className='h-5 w-5 transition-transform duration-300 group-hover:rotate-6'
        >
          <path
            d='M7 8L3 12L7 16'
            stroke='currentColor'
            strokeWidth='2.2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M17 8L21 12L17 16'
            stroke='currentColor'
            strokeWidth='2.2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M14 4L10 20'
            stroke='currentColor'
            strokeWidth='2.2'
            strokeLinecap='round'
          />
        </svg>
        <span className='absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900'>
          <Sparkles className='h-2 w-2 text-white' />
        </span>
      </div>

      <div
        className={cn(
          'flex flex-col overflow-hidden whitespace-nowrap transition-[max-width,opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
          compact ? 'max-w-0 -translate-x-1 opacity-0' : 'max-w-44 translate-x-0 opacity-100'
        )}
        aria-hidden={compact}
      >
        <div className='flex items-center gap-1.5'>
          <span className='text-lg font-extrabold tracking-tight text-slate-950 dark:text-white'>
            ITJob<span className='bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent'>VN</span>
          </span>
          <span className='rounded bg-violet-100 px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-violet-700 uppercase dark:bg-violet-950 dark:text-violet-300'>
            Pro
          </span>
        </div>
        <span className='text-[10px] font-medium tracking-wider text-slate-400 uppercase'>
          Tech Career Hub
        </span>
      </div>
    </Link>
  )
}

export default Logo
