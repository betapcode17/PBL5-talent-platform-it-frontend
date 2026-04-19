import { memo, useMemo } from 'react'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'

type PaginationProps = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const pages = useMemo(() => {
    if (totalPages <= 4) {
      return Array.from({ length: totalPages }, (_, index) => index + 1)
    }

    if (currentPage <= 2) {
      return [1, 2, 3, totalPages]
    }

    if (currentPage >= totalPages - 1) {
      return [1, totalPages - 2, totalPages - 1, totalPages]
    }

    return [1, currentPage, currentPage + 1, totalPages]
  }, [currentPage, totalPages])

  return (
    <div className='flex flex-wrap items-center justify-center gap-2.5 rounded-[24px] border border-slate-200/80 bg-white/80 p-3.5 shadow-[0_14px_34px_rgba(15,23,42,0.04)] backdrop-blur-sm'>
      <button
        type='button'
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        className='flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 transition hover:border-violet-200 hover:text-violet-700'
      >
        <ChevronLeft className='h-[18px] w-[18px]' />
      </button>

      {pages.map((page, index) => (
        <div key={`${page}-${index}`} className='flex items-center gap-2.5'>
          {totalPages > 4 && index === 3 ? (
            <>
              <span className='px-1 text-slate-400'>
                <MoreHorizontal className='h-[18px] w-[18px]' />
              </span>
              <button
                type='button'
                onClick={() => onPageChange(page)}
                className='flex h-10 min-w-[40px] items-center justify-center rounded-xl border border-slate-200 bg-white px-3.5 text-base text-slate-700 transition hover:border-violet-200 hover:text-violet-700'
              >
                {page}
              </button>
            </>
          ) : (
            <button
              type='button'
              onClick={() => onPageChange(page)}
              className={cn(
                'flex h-10 min-w-[40px] items-center justify-center rounded-xl border px-3.5 text-base transition',
                currentPage === page
                  ? 'border-violet-500 bg-violet-600 text-white shadow-[0_12px_30px_rgba(124,58,237,0.24)]'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-violet-200 hover:text-violet-700'
              )}
            >
              {page}
            </button>
          )}
        </div>
      ))}

      <button
        type='button'
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        className='flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 transition hover:border-violet-200 hover:text-violet-700'
      >
        <ChevronRight className='h-[18px] w-[18px]' />
      </button>
    </div>
  )
}

export default memo(Pagination)
