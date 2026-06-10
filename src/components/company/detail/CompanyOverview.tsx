import type { CompanyDetail } from '@/@types/company'

export const CompanyOverview = ({ company }: { company: CompanyDetail }) => {
  return (
    <section className='rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_18px_56px_rgba(15,23,42,0.06)] sm:p-7'>
      <div className='space-y-6'>
        <div>
          <p className='text-xs font-semibold uppercase tracking-[0.24em] text-violet-500'>Overview</p>
          <h2 className='mt-2 text-2xl font-semibold text-slate-950'>Giới thiệu công ty</h2>
        </div>

        <div className='rounded-[24px] border border-slate-200 bg-slate-50/70 p-5'>
          <h3 className='text-sm font-semibold uppercase tracking-[0.18em] text-slate-400'>Profile</h3>
          <p className='mt-3 text-sm leading-7 text-slate-600'>{company.profile_description || 'Chưa có mô tả công ty.'}</p>
        </div>

        <div className='rounded-[24px] border border-violet-100 bg-[linear-gradient(135deg,rgba(238,242,255,0.95),rgba(250,245,255,0.95))] p-5'>
          <h3 className='text-sm font-semibold uppercase tracking-[0.18em] text-violet-500'>Why Join</h3>
          <p className='mt-3 text-sm leading-7 text-slate-700'>
            {company.why_love_working_here || 'Thông tin về môi trường làm việc sẽ được cập nhật sớm.'}
          </p>
        </div>
      </div>
    </section>
  )
}
