import type { JobDetailSectionId } from '@/types/job-detail'
import { cn } from '@/lib/utils'

type JobDetailTabsProps = {
  sections: Array<{
    id: JobDetailSectionId
    label: string
  }>
  activeSection: JobDetailSectionId
  onNavigate: (sectionId: JobDetailSectionId) => void
}

const JobDetailTabs = ({ sections, activeSection, onNavigate }: JobDetailTabsProps) => {
  return (
    <nav aria-label='Job detail sections' className='overflow-x-auto'>
      <div className='flex min-w-max items-center gap-2 rounded-2xl border border-slate-200/80 bg-white/90 p-2 shadow-[0_12px_32px_rgba(15,23,42,0.04)]'>
        {sections.map((section) => (
          <button
            key={section.id}
            type='button'
            onClick={() => onNavigate(section.id)}
            className={cn(
              'rounded-xl px-4 py-2.5 text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300',
              activeSection === section.id
                ? 'bg-violet-600 text-white shadow-[0_12px_24px_rgba(124,58,237,0.22)]'
                : 'text-slate-600 hover:bg-violet-50 hover:text-violet-700'
            )}
          >
            {section.label}
          </button>
        ))}
      </div>
    </nav>
  )
}

export default JobDetailTabs
