import type { ReactNode } from 'react'
import type { CompanyDetail } from '@/@types/company'
import { Globe, Mail } from 'lucide-react'

export const CompanyContact = ({ company }: { company: CompanyDetail }) => {
  return (
    <section className='rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_18px_56px_rgba(15,23,42,0.06)]'>
      <div className='mb-5'>
        <p className='text-xs font-semibold uppercase tracking-[0.24em] text-slate-400'>Contact</p>
        <h2 className='mt-2 text-xl font-semibold text-slate-950'>Kết nối với công ty</h2>
      </div>

      <div className='space-y-3'>
        <ContactItem
          icon={<Mail className='h-4 w-4' />}
          label='Email'
          href={company.company_email ? `mailto:${company.company_email}` : undefined}
          value={company.company_email || 'Chưa cập nhật'}
        />
        <ContactItem
          icon={<Globe className='h-4 w-4' />}
          label='Website'
          href={company.company_website_url || undefined}
          value={company.company_website_url || 'Chưa cập nhật'}
          external={Boolean(company.company_website_url)}
        />
      </div>
    </section>
  )
}

const ContactItem = ({
  icon,
  label,
  value,
  href,
  external
}: {
  icon: ReactNode
  label: string
  value: string
  href?: string
  external?: boolean
}) => {
  const content = (
    <div className='flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 transition hover:border-violet-200 hover:bg-violet-50/70'>
      <div className='mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-white text-violet-600 shadow-sm'>
        {icon}
      </div>
      <div className='min-w-0'>
        <p className='text-xs font-semibold uppercase tracking-[0.18em] text-slate-400'>{label}</p>
        <p className='mt-1 break-all text-sm font-medium leading-6 text-slate-900'>{value}</p>
      </div>
    </div>
  )

  if (!href) {
    return content
  }

  return (
    <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined} className='block'>
      {content}
    </a>
  )
}
