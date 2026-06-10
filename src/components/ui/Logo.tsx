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
        'inline-flex min-w-0 items-center text-slate-950 transition-[gap] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] dark:text-slate-100',
        compact ? 'gap-0' : 'gap-3',
        className
      )}
    >
      <span className='flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-sm font-black text-white shadow-[0_10px_30px_rgba(124,58,237,0.28)]'>
        W
      </span>
      <span
        className={cn(
          'overflow-hidden whitespace-nowrap text-lg font-semibold tracking-[-0.02em] transition-[max-width,opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
          compact ? 'max-w-0 -translate-x-1 opacity-0' : 'max-w-28 translate-x-0 opacity-100'
        )}
        aria-hidden={compact}
      >
        ITJobVN
      </span>
    </Link>
  )
}

export default Logo
