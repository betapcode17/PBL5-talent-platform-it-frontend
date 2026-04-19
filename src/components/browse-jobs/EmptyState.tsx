import { memo } from 'react'
import { SearchX } from 'lucide-react'
import { OutlineButton } from '@/components/ui/Buttons'

type EmptyStateProps = {
  onReset: () => void
}

const EmptyState = ({ onReset }: EmptyStateProps) => {
  return (
    <div className='rounded-[30px] border border-dashed border-slate-300 bg-white/75 p-10 text-center shadow-[0_18px_50px_rgba(15,23,42,0.03)]'>
      <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50 text-violet-600'>
        <SearchX className='h-7 w-7' />
      </div>
      <h3 className='mt-5 text-2xl font-semibold tracking-[-0.03em] text-slate-950'>No jobs match your filters</h3>
      <p className='mx-auto mt-3 max-w-md text-base leading-7 text-slate-500'>
        Try removing a few filters or broaden your search to discover more opportunities across Vietnam.
      </p>
      <div className='mt-6'>
        <OutlineButton className='rounded-2xl px-6 py-3.5' onClick={onReset}>
          Reset Filters
        </OutlineButton>
      </div>
    </div>
  )
}

export default memo(EmptyState)
