import { memo } from 'react'

const SkeletonJobCard = () => {
  return (
    <div className='animate-pulse rounded-[28px] border border-slate-200/80 bg-white p-7 shadow-[0_18px_55px_rgba(15,23,42,0.04)]'>
      <div className='flex items-start justify-between gap-6'>
        <div className='flex flex-1 gap-4'>
          <div className='h-16 w-16 rounded-2xl bg-slate-100' />
          <div className='flex-1 space-y-4'>
            <div className='space-y-3'>
              <div className='h-6 w-2/3 rounded-full bg-slate-100' />
              <div className='h-4 w-1/2 rounded-full bg-slate-100' />
            </div>
            <div className='flex gap-2'>
              <div className='h-8 w-20 rounded-full bg-slate-100' />
              <div className='h-8 w-24 rounded-full bg-slate-100' />
              <div className='h-8 w-16 rounded-full bg-slate-100' />
            </div>
            <div className='flex gap-4'>
              <div className='h-5 w-32 rounded-full bg-slate-100' />
              <div className='h-5 w-24 rounded-full bg-slate-100' />
            </div>
          </div>
        </div>
        <div className='space-y-4'>
          <div className='h-10 w-10 rounded-xl bg-slate-100' />
          <div className='h-12 w-32 rounded-2xl bg-slate-100' />
        </div>
      </div>
    </div>
  )
}

export default memo(SkeletonJobCard)
