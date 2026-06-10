import { memo, useEffect, useMemo, useRef, useState } from 'react'
import { Check, ChevronDown, Search, X } from 'lucide-react'
import type { FilterOption } from '@/types/browse-jobs'
import { cn } from '@/lib/utils'

type FilterSelectGroupProps = {
  title: string
  options: FilterOption[]
  selected: string[]
  placeholder?: string
  emptyText?: string
  searchable?: boolean
  onToggle: (value: string) => void
}

const FilterSelectGroup = ({
  title,
  options,
  selected,
  placeholder = 'Select option',
  emptyText = 'No matching options',
  searchable = false,
  onToggle
}: FilterSelectGroupProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const rootRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const selectedLabels = useMemo(
    () => selected.map((value) => options.find((item) => item.value === value)?.label ?? value).filter(Boolean),
    [options, selected]
  )

  const filteredOptions = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase()

    if (!keyword) {
      return options
    }

    return options.filter((option) =>
      [option.label, option.value].some((value) => value.toLowerCase().includes(keyword))
    )
  }, [options, searchQuery])

  const handleToggle = (value: string) => {
    onToggle(value)
    setSearchQuery('')

    if (searchable) {
      inputRef.current?.focus()
    }
  }

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
        {searchable ? (
          <div
            className={cn(
              'flex h-11 w-full items-center gap-2 rounded-2xl border bg-white px-3.5 text-sm text-slate-700 shadow-[0_8px_20px_rgba(15,23,42,0.03)] transition focus-within:outline-none focus-within:ring-2 focus-within:ring-violet-200',
              isOpen ? 'border-violet-300 ring-2 ring-violet-100' : 'border-slate-200 hover:border-violet-200'
            )}
            onClick={() => inputRef.current?.focus()}
          >
            <Search className='h-4 w-4 shrink-0 text-slate-400' />
            <input
              ref={inputRef}
              type='text'
              value={searchQuery}
              placeholder={selectedLabels.length > 0 ? selectedLabels.join(', ') : placeholder}
              onFocus={() => setIsOpen(true)}
              onChange={(event) => {
                setSearchQuery(event.target.value)
                setIsOpen(true)
              }}
              className='min-w-0 flex-1 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none'
            />
            {searchQuery ? (
              <button
                type='button'
                aria-label='Clear search'
                onClick={(event) => {
                  event.stopPropagation()
                  setSearchQuery('')
                  inputRef.current?.focus()
                }}
                className='flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600'
              >
                <X className='h-3.5 w-3.5' />
              </button>
            ) : null}
            <button
              type='button'
              aria-label={placeholder}
              onClick={(event) => {
                event.stopPropagation()
                setIsOpen((current) => !current)
                inputRef.current?.focus()
              }}
              className='flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600'
            >
              <ChevronDown className={cn('h-4 w-4 transition-transform', isOpen ? 'rotate-180' : '')} />
            </button>
          </div>
        ) : (
          <button
            type='button'
            onClick={() => setIsOpen((current) => !current)}
            className={cn(
              'flex h-11 w-full items-center justify-between rounded-2xl border bg-white px-3.5 text-left text-sm text-slate-700 shadow-[0_8px_20px_rgba(15,23,42,0.03)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200',
              isOpen ? 'border-violet-300 ring-2 ring-violet-100' : 'border-slate-200 hover:border-violet-200'
            )}
          >
            <span className='truncate'>{selectedLabels.length > 0 ? selectedLabels.join(', ') : placeholder}</span>
            <ChevronDown
              className={cn('h-4 w-4 shrink-0 text-slate-400 transition-transform', isOpen ? 'rotate-180' : '')}
            />
          </button>
        )}

        {isOpen ? (
          <div className='absolute left-0 right-0 top-[calc(100%+8px)] z-30 overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_18px_36px_rgba(15,23,42,0.12)]'>
            <div className='max-h-56 overflow-y-auto p-2'>
              {filteredOptions.map((option) => {
                const isSelected = selected.includes(option.value)

                return (
                  <button
                    key={option.value}
                    type='button'
                    onClick={() => handleToggle(option.value)}
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
              {filteredOptions.length === 0 ? (
                <div className='px-3 py-3 text-sm text-slate-400'>{emptyText}</div>
              ) : null}
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
