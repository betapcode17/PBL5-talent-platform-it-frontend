const SkeletonBlock = ({ className }: { className: string }) => (
  <div className={`animate-pulse rounded-2xl bg-slate-200/80 ${className}`} />
)

const JobDetailSkeleton = () => {
  return (
    <div className='grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]'>
      <div className='space-y-6'>
        <div className='rounded-[30px] border border-slate-200/80 bg-white p-5 shadow-[0_18px_56px_rgba(15,23,42,0.06)] sm:p-7'>
          <div className='flex gap-5'>
            <SkeletonBlock className='h-20 w-20 rounded-[22px]' />
            <div className='flex-1 space-y-4'>
              <SkeletonBlock className='h-5 w-28' />
              <SkeletonBlock className='h-12 w-3/4' />
              <div className='flex flex-wrap gap-3'>
                <SkeletonBlock className='h-9 w-28' />
                <SkeletonBlock className='h-9 w-24' />
                <SkeletonBlock className='h-9 w-32' />
              </div>
            </div>
          </div>
        </div>

        <div className='rounded-[24px] border border-slate-200/80 bg-white p-3 shadow-[0_12px_32px_rgba(15,23,42,0.04)]'>
          <div className='flex gap-3 overflow-hidden'>
            <SkeletonBlock className='h-11 w-28' />
            <SkeletonBlock className='h-11 w-32' />
            <SkeletonBlock className='h-11 w-24' />
            <SkeletonBlock className='h-11 w-24' />
          </div>
        </div>

        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={`section-skeleton-${index}`}
            className='rounded-[30px] border border-slate-200/80 bg-white p-6 shadow-[0_18px_56px_rgba(15,23,42,0.06)]'
          >
            <SkeletonBlock className='mb-5 h-7 w-40' />
            <div className='space-y-3'>
              <SkeletonBlock className='h-4 w-full' />
              <SkeletonBlock className='h-4 w-[92%]' />
              <SkeletonBlock className='h-4 w-[84%]' />
              <SkeletonBlock className='h-4 w-[76%]' />
            </div>
          </div>
        ))}
      </div>

      <aside className='space-y-5'>
        <div className='rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_18px_56px_rgba(15,23,42,0.06)]'>
          <SkeletonBlock className='h-14 w-full' />
          <SkeletonBlock className='mt-4 h-12 w-full' />
          <SkeletonBlock className='mt-5 h-4 w-32' />
          <div className='mt-4 flex gap-3'>
            <SkeletonBlock className='h-11 w-11 rounded-full' />
            <SkeletonBlock className='h-11 w-11 rounded-full' />
            <SkeletonBlock className='h-11 w-11 rounded-full' />
          </div>
        </div>

        <div className='rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_18px_56px_rgba(15,23,42,0.06)]'>
          <div className='flex gap-4'>
            <SkeletonBlock className='h-14 w-14 rounded-[18px]' />
            <div className='flex-1 space-y-3'>
              <SkeletonBlock className='h-5 w-2/3' />
              <SkeletonBlock className='h-4 w-3/4' />
            </div>
          </div>
          <div className='mt-5 space-y-3'>
            <SkeletonBlock className='h-4 w-full' />
            <SkeletonBlock className='h-4 w-[88%]' />
            <SkeletonBlock className='h-4 w-[80%]' />
          </div>
        </div>
      </aside>
    </div>
  )
}

export default JobDetailSkeleton
