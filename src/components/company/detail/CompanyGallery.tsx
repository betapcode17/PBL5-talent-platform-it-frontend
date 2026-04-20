import type { Company } from '@/@types/company'
import { ImageIcon } from 'lucide-react'

export const CompanyGallery = ({ company }: { company: Company }) => {
  if (!company.cover_image) return null

  return (
    <section className='rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_18px_56px_rgba(15,23,42,0.06)]'>
      <div className='mb-4 flex items-center gap-3'>
        <div className='flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-600'>
          <ImageIcon className='h-5 w-5' />
        </div>
        <div>
          <p className='text-xs font-semibold uppercase tracking-[0.22em] text-slate-400'>Gallery</p>
          <h2 className='text-xl font-semibold text-slate-950'>Hình ảnh công ty</h2>
        </div>
      </div>

      <img src={company.cover_image} alt={company.company_name} className='h-72 w-full rounded-[24px] object-cover' />
    </section>
  )
}
