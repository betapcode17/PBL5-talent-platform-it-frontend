import { Building2, SearchX } from 'lucide-react'
import { useCompany } from '@/hooks/useCompany'
import { CompanyCard } from './CompanyCard'

export const CompanyList = () => {
  const { companies, isLoading } = useCompany()

  if (isLoading) {
    return (
      <div className='space-y-5'>
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (companies.length === 0) {
    return <EmptyState />
  }

  return (
    <div className='space-y-5'>
      {companies.map((company) => (
        <CompanyCard key={company.company_id} company={company} />
      ))}
    </div>
  )
}

const EmptyState = () => {
  return (
    <div className='flex min-h-[360px] flex-col items-center justify-center rounded-[28px] border border-dashed border-slate-300 bg-white px-6 text-center shadow-[0_18px_56px_rgba(15,23,42,0.04)]'>
      <div className='flex h-16 w-16 items-center justify-center rounded-full bg-violet-50 text-violet-600'>
        <SearchX className='h-7 w-7' />
      </div>
      <h3 className='mt-5 text-xl font-semibold text-slate-950'>Không tìm thấy công ty phù hợp</h3>
      <p className='mt-2 max-w-md text-sm leading-6 text-slate-500'>
        Hãy thử thay đổi từ khóa hoặc bỏ bớt bộ lọc để xem thêm các công ty đang hoạt động trên nền tảng.
      </p>
    </div>
  )
}

const SkeletonCard = () => {
  return (
    <div className='animate-pulse rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_18px_56px_rgba(15,23,42,0.05)]'>
      <div className='flex flex-col gap-5 md:flex-row'>
        <div className='h-24 w-24 rounded-[24px] bg-slate-200 md:h-28 md:w-28' />

        <div className='flex-1 space-y-4'>
          <div className='flex items-start justify-between gap-4'>
            <div className='space-y-3'>
              <div className='h-6 w-56 rounded-full bg-slate-200' />
              <div className='h-4 w-40 rounded-full bg-slate-200' />
            </div>
            <div className='h-10 w-28 rounded-2xl bg-slate-200' />
          </div>

          <div className='flex flex-wrap gap-2'>
            <div className='h-8 w-24 rounded-full bg-slate-200' />
            <div className='h-8 w-20 rounded-full bg-slate-200' />
            <div className='h-8 w-28 rounded-full bg-slate-200' />
          </div>

          <div className='grid gap-3 lg:grid-cols-2'>
            <div className='rounded-2xl border border-slate-100 p-4'>
              <div className='mb-3 flex items-center gap-2 text-slate-300'>
                <Building2 className='h-4 w-4' />
                <div className='h-4 w-28 rounded-full bg-slate-200' />
              </div>
              <div className='space-y-2'>
                <div className='h-4 w-full rounded-full bg-slate-200' />
                <div className='h-4 w-5/6 rounded-full bg-slate-200' />
              </div>
            </div>
            <div className='rounded-2xl border border-slate-100 p-4'>
              <div className='mb-3 h-4 w-32 rounded-full bg-slate-200' />
              <div className='space-y-2'>
                <div className='h-4 w-full rounded-full bg-slate-200' />
                <div className='h-4 w-4/5 rounded-full bg-slate-200' />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
