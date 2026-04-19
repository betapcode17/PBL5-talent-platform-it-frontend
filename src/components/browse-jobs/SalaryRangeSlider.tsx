import { memo } from 'react'

type SalaryRangeSliderProps = {
  minValue: string
  maxValue: string
  onMinChange: (value: string) => void
  onMaxChange: (value: string) => void
}

const SalaryRangeSlider = ({ minValue, maxValue, onMinChange, onMaxChange }: SalaryRangeSliderProps) => {
  return (
    <div className='space-y-3.5'>
      <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
        <label className='space-y-1.5'>
          <span className='text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400'>From</span>
          <div className='flex items-center rounded-2xl border border-slate-200 bg-white px-3.5 focus-within:border-violet-300 focus-within:ring-2 focus-within:ring-violet-100'>
            <span className='text-sm text-slate-400'>$</span>
            <input
              type='number'
              min={0}
              inputMode='numeric'
              placeholder='1000'
              value={minValue}
              onChange={(event) => onMinChange(event.target.value)}
              className='h-11 w-full bg-transparent px-2 text-sm text-slate-700 outline-none placeholder:text-slate-400'
            />
          </div>
        </label>

        <label className='space-y-1.5'>
          <span className='text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400'>To</span>
          <div className='flex items-center rounded-2xl border border-slate-200 bg-white px-3.5 focus-within:border-violet-300 focus-within:ring-2 focus-within:ring-violet-100'>
            <span className='text-sm text-slate-400'>$</span>
            <input
              type='number'
              min={0}
              inputMode='numeric'
              placeholder='10000'
              value={maxValue}
              onChange={(event) => onMaxChange(event.target.value)}
              className='h-11 w-full bg-transparent px-2 text-sm text-slate-700 outline-none placeholder:text-slate-400'
            />
          </div>
        </label>
      </div>

      <p className='text-xs leading-5 text-slate-500'>Enter your preferred salary range to narrow down matching jobs.</p>
    </div>
  )
}

export default memo(SalaryRangeSlider)
