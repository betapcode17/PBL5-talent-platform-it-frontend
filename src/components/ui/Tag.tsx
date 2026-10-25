import { cn } from '@/lib/utils'

type TagProps = {
  label: string
  className?: string
  onClick?: () => void
  active?: boolean
}

const Tag = ({ label, className, onClick, active = false }: TagProps) => {
  if (onClick) {
    return (
      <button
        type='button'
        onClick={onClick}
        className={cn(
          'inline-flex cursor-pointer items-center rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400',
          active
            ? 'border-violet-600 bg-violet-600 text-white shadow-sm'
            : 'border-slate-200 bg-white text-slate-600 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700',
          className
        )}
      >
        {label}
      </button>
    )
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-slate-200/80 bg-white px-3 py-1 text-xs font-medium text-slate-600 transition-colors duration-200 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300',
        className
      )}
    >
      {label}
    </span>
  )
}

export default Tag

