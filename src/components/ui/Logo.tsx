import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

type LogoProps = {
  className?: string
  compact?: boolean
}

const Logo = ({ className, compact = false }: LogoProps) => {
  return (
    <Link to='/' className={cn('inline-flex items-center gap-3 text-slate-950', className)}>
      <span className='flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-sm font-black text-white shadow-[0_10px_30px_rgba(124,58,237,0.28)]'>
        W
      </span>
      {!compact ? <span className='text-lg font-semibold tracking-[-0.02em]'>ITJobVN</span> : null}
    </Link>
  )
}

export default Logo
