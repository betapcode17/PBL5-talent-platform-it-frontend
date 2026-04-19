import { memo, useEffect, useMemo, useRef, useState } from 'react'
import { Check, ChevronDown, X } from 'lucide-react'
import type { FilterOption } from '@/types/browse-jobs'
import { cn } from '@/lib/utils'

type FilterSelectGroupProps = {
  title: string
  options: FilterOption[]
  selected: string[]
  placeholder?: string
  onToggle: (value: string) => void
}

const FilterSelectGroup = ({
  title,
  options,
  selected,
  placeholder = 'Select option',
  onToggle
}: FilterSelectGroupProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  const selectedLabels = useMemo(
    () =>
      selected
        .map((value) => options.find((item) => item.value === value)?.label ?? value)
        .filter(Boolean),
    [options, selected]
  )

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  return (
    <div ref={rootRef} className='space-y-3.5'>
      <p className='text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500'>{title}</p>

      <div className='relative'>
        <button
          type='button'
          onClick={() => setIsOpen((current) => !current)}
          className={cn(
            'flex h-11 w-full items-center justify-between rounded-2xl border bg-white px-3.5 text-left text-sm text-slate-700 shadow-[0_8px_20px_rgba(15,23,42,0.03)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200',
            isOpen ? 'border-violet-300 ring-2 ring-violet-100' : 'border-slate-200 hover:border-violet-200'
          )}
        >
          <span className='truncate'>{selectedLabels.length > 0 ? selectedLabels.join(', ') : placeholder}</span>
          <ChevronDown className={cn('h-4 w-4 shrink-0 text-slate-400 transition-transform', isOpen ? 'rotate-180' : '')} />
        </button>

        {isOpen ? (
          <div className='absolute left-0 right-0 top-[calc(100%+8px)] z-30 overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_18px_36px_rgba(15,23,42,0.12)]'>
            <div className='max-h-56 overflow-y-auto p-2'>
              {options.map((option) => {
                const isSelected = selected.includes(option.value)

                return (
                  <button
                    key={option.value}
                    type='button'
                    onClick={() => onToggle(option.value)}
                    className={cn(
                      'flex w-full items-center justify-between gap-3 rounded-2xl px-3 py-2.5 text-left text-sm transition',
                      isSelected ? 'bg-violet-50 text-violet-700' : 'text-slate-700 hover:bg-slate-50'
                    )}
                  >
                    <span className='flex min-w-0 items-center gap-2.5'>
                      <span
                        className={cn(
                          'flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-md border',
                          isSelected
                            ? 'border-violet-500 bg-violet-500 text-white'
                            : 'border-slate-300 bg-white text-transparent'
                        )}
                      >
                        <Check className='h-3 w-3' />
                      </span>
                      <span className='truncate'>{option.label}</span>
                    </span>
                    {option.count ? <span className='shrink-0 text-slate-400'>{option.count}</span> : null}
                  </button>
                )
              })}
            </div>
          </div>
        ) : null}
      </div>

      {selected.length > 0 ? (
        <div className='flex flex-wrap gap-2'>
          {selected.map((value) => {
            const option = options.find((item) => item.value === value)
            const label = option?.label ?? value

            return (
              <button
                key={value}
                type='button'
                onClick={() => onToggle(value)}
                className='inline-flex items-center gap-1.5 rounded-full border border-violet-100 bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-700 transition hover:border-violet-200 hover:bg-violet-100'
              >
                {label}
                <X className='h-3.5 w-3.5' />
              </button>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}

export default memo(FilterSelectGroup)
