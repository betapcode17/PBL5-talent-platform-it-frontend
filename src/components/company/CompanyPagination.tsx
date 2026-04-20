import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCompany } from '@/hooks/useCompany'
import { useCompanyFilterStore } from '@/store/companyFilterStore'

export const CompanyPagination = () => {
  const { page, limit, setFilter } = useCompanyFilterStore()
  const { total } = useCompany()

  const totalPages = Math.ceil(total / limit)

  if (totalPages <= 1) return null

  const startPage = Math.max(1, page - 2)
  const endPage = Math.min(totalPages, startPage + 4)
  const pages = Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index)

  return (
    <div className='flex flex-col gap-4 rounded-[28px] border border-slate-200/80 bg-white px-5 py-4 shadow-[0_18px_56px_rgba(15,23,42,0.06)] sm:flex-row sm:items-center sm:justify-between'>
      <p className='text-sm text-slate-500'>
        Trang <span className='font-semibold text-slate-900'>{page}</span> / {totalPages}
      </p>

      <div className='flex flex-wrap items-center gap-2'>
        <button
          type='button'
          onClick={() => setFilter({ page: page - 1 })}
          disabled={page === 1}
          className='inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 px-4 text-sm font-semibold text-slate-600 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-50'
        >
          <ChevronLeft className='h-4 w-4' />
          Trước
        </button>

        {pages.map((item) => (
          <button
            key={item}
            type='button'
            onClick={() => setFilter({ page: item })}
            className={`h-11 min-w-11 rounded-2xl px-4 text-sm font-semibold transition ${
              page === item
                ? 'bg-violet-600 text-white shadow-[0_12px_24px_rgba(124,58,237,0.24)]'
                : 'border border-slate-200 bg-white text-slate-600 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700'
            }`}
          >
            {item}
          </button>
        ))}

        <button
          type='button'
          onClick={() => setFilter({ page: page + 1 })}
          disabled={page === totalPages}
          className='inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 px-4 text-sm font-semibold text-slate-600 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-50'
        >
          Sau
          <ChevronRight className='h-4 w-4' />
        </button>
      </div>
    </div>
  )
}
