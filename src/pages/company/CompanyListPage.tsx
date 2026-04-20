import type { ReactNode } from 'react'
import { Building2, LayoutGrid, Sparkles } from 'lucide-react'
import { CompanyFilters } from '@/components/company/CompanyFilters'
import { CompanyList } from '@/components/company/CompanyList'
import { CompanyPagination } from '@/components/company/CompanyPagination'
import { useCompany } from '@/hooks/useCompany'

export default function CompanyListPage() {
  const { total, companies } = useCompany()

  return (
    <div className='min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(139,92,246,0.14),_transparent_32%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)]'>
      <div className='mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 lg:flex-row'>
        <aside className='w-full shrink-0 lg:sticky lg:top-8 lg:w-[320px] lg:self-start'>
          <CompanyFilters />
        </aside>

        <section className='min-w-0 flex-1 space-y-6'>
          <HeaderSection total={total} visibleCount={companies.length} />
          <CompanyList />
          <CompanyPagination />
        </section>
      </div>
    </div>
  )
}

const HeaderSection = ({ total, visibleCount }: { total: number; visibleCount: number }) => {
  return (
    <section className='rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8'>
      <div className='flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between'>
        <div className='max-w-2xl'>
          <div className='inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-violet-700'>
            <Sparkles className='h-3.5 w-3.5' />
            Company Explorer
          </div>

          <h1 className='mt-4 text-3xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-[3.1rem]'>
            Khám phá các công ty công nghệ phù hợp với định hướng của bạn
          </h1>
          <p className='mt-3 max-w-xl text-sm leading-7 text-slate-500 sm:text-base'>
            Theo dõi nhanh quy mô, lĩnh vực, kỹ năng nổi bật và các vị trí đang tuyển để chọn ra môi trường làm việc phù
            hợp trước khi ứng tuyển.
          </p>
        </div>

        <div className='grid gap-3 sm:grid-cols-2'>
          <MetricCard icon={<Building2 className='h-5 w-5' />} label='Tổng công ty' value={total} />
          <MetricCard icon={<LayoutGrid className='h-5 w-5' />} label='Đang hiển thị' value={visibleCount} />
        </div>
      </div>
    </section>
  )
}

const MetricCard = ({ icon, label, value }: { icon: ReactNode; label: string; value: number }) => {
  return (
    <div className='rounded-[24px] border border-slate-200 bg-slate-50/80 px-4 py-4'>
      <div className='flex items-center gap-3'>
        <div className='flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-violet-600 shadow-sm'>{icon}</div>
        <div>
          <p className='text-xs font-semibold uppercase tracking-[0.2em] text-slate-400'>{label}</p>
          <p className='mt-1 text-2xl font-semibold text-slate-950'>{value}</p>
        </div>
      </div>
    </div>
  )
}
