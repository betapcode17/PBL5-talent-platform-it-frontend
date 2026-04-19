import { memo } from 'react'
import { Mail } from 'lucide-react'
import { PrimaryButton } from '@/components/ui/Buttons'

const JobAlertsCard = () => {
  return (
    <section className='overflow-hidden rounded-[26px] border border-violet-200/80 bg-[radial-gradient(circle_at_top_right,_rgba(168,85,247,0.20),_transparent_38%),linear-gradient(180deg,#fbf7ff_0%,#f6efff_100%)] p-5 shadow-[0_16px_42px_rgba(124,58,237,0.08)]'>
      <div className='mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white shadow-[0_12px_30px_rgba(124,58,237,0.22)]'>
        <Mail className='h-5 w-5' />
      </div>
      <div className='space-y-2.5'>
        <h3 className='text-[1.75rem] font-semibold tracking-[-0.03em] text-slate-950'>Job Alerts</h3>
        <p className='text-[15px] leading-7 text-slate-600'>
          Get notified about new jobs matching your current filters.
        </p>
      </div>
      <PrimaryButton className='mt-5 w-full rounded-xl py-3 text-sm'>Enable Alerts</PrimaryButton>
    </section>
  )
}

export default memo(JobAlertsCard)
