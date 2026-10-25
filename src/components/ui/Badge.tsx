import { cn } from '@/lib/utils'

type BadgeTone = 'new' | 'featured' | 'neutral' | 'urgent' | 'salary' | 'verified'

type BadgeProps = {
  label: string
  tone?: BadgeTone
  dot?: boolean
  className?: string
}

const toneClasses: Record<BadgeTone, { container: string; dot: string }> = {
  new: {
    container: 'bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60',
    dot: 'bg-emerald-500'
  },
  featured: {
    container: 'bg-violet-50 text-violet-700 border-violet-200/80 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-800/60',
    dot: 'bg-violet-500'
  },
  urgent: {
    container: 'bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60',
    dot: 'bg-rose-500'
  },
  salary: {
    container: 'bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60',
    dot: 'bg-amber-500'
  },
  verified: {
    container: 'bg-sky-50 text-sky-700 border-sky-200/80 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800/60',
    dot: 'bg-sky-500'
  },
  neutral: {
    container: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
    dot: 'bg-slate-400'
  }
}

const Badge = ({ label, tone = 'neutral', dot = false, className }: BadgeProps) => {
  const currentTone = toneClasses[tone] ?? toneClasses.neutral

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide shadow-[0_1px_2px_rgba(0,0,0,0.03)]',
        currentTone.container,
        className
      )}
    >
      {dot && (
        <span className='relative flex h-1.5 w-1.5'>
          <span className={cn('absolute inline-flex h-full w-full animate-ping rounded-full opacity-75', currentTone.dot)} />
          <span className={cn('relative inline-flex h-1.5 w-1.5 rounded-full', currentTone.dot)} />
        </span>
      )}
      {label}
    </span>
  )
}

export default Badge

