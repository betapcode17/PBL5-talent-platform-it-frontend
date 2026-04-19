import { memo } from 'react'
import { cn } from '@/lib/utils'
import type { FilterOption } from '@/types/browse-jobs'

type WorkTypeChipsProps = {
  options: FilterOption[]
  selected: string[]
  onToggle: (value: string) => void
}

const WorkTypeChips = ({ options, selected, onToggle }: WorkTypeChipsProps) => {
  return (
    <div className='flex flex-wrap gap-2.5'>
      {options.map((option) => {
        const isActive = selected.includes(option.value)

        return (
          <button
            key={option.value}
            type='button'
            onClick={() => onToggle(option.value)}
            className={cn(
              'rounded-2xl border px-3.5 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200',
              isActive
                ? 'border-violet-200 bg-violet-50 text-violet-700 shadow-[0_8px_20px_rgba(124,58,237,0.08)]'
                : 'border-slate-200 bg-white text-slate-700 hover:border-violet-200 hover:bg-violet-50'
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

export default memo(WorkTypeChips)
