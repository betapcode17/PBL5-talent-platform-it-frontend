import type { ReactNode } from 'react'
import type { CompanyDetail } from '@/@types/company'
import { BriefcaseBusiness, CalendarDays, Clock3, Rocket, TimerReset } from 'lucide-react'

export const CompanyInfo = ({ company }: { company: CompanyDetail }) => {
  return (
    <section className='rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_18px_56px_rgba(15,23,42,0.06)]'>
      <div className='mb-5'>
        <p className='text-xs font-semibold uppercase tracking-[0.24em] text-slate-400'>Company Facts</p>
        <h2 className='mt-2 text-xl font-semibold text-slate-950'>Thông tin công ty</h2>
      </div>

      <div className='space-y-3'>
        <Info icon={<Rocket className='h-4 w-4' />} label='Loại hình' value={company.company_type} />
        <Info icon={<CalendarDays className='h-4 w-4' />} label='Thành lập' value={company.establishment_date?.slice(0, 10)} />
        <Info icon={<BriefcaseBusiness className='h-4 w-4' />} label='Ngày làm việc' value={company.working_days} />
        <Info icon={<Clock3 className='h-4 w-4' />} label='Giờ làm việc' value={company.working_time} />
        <Info icon={<TimerReset className='h-4 w-4' />} label='Chính sách OT' value={company.overtime_policy} />
      </div>
    </section>
  )
}

const Info = ({ icon, label, value }: { icon: ReactNode; label: string; value?: string | null }) => (
  <div className='flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3'>
    <div className='mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-white text-violet-600 shadow-sm'>
      {icon}
    </div>
    <div className='min-w-0'>
      <p className='text-xs font-semibold uppercase tracking-[0.18em] text-slate-400'>{label}</p>
      <p className='mt-1 text-sm font-medium leading-6 text-slate-900'>{value || '-'}</p>
    </div>
  </div>
)
