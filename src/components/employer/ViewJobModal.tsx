import { Briefcase, DollarSign, Layers, MapPin, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import type { EmployerJobItem } from '@/@types/employer'
import { Button } from '@/components/ui/button'

type ViewJobModalProps = {
  job: EmployerJobItem
  isOpen: boolean
  onClose: () => void
}

const ViewJobModal = ({ job, isOpen, onClose }: ViewJobModalProps) => {
  const { i18n, t } = useTranslation()
  const locale = i18n.language.startsWith('vi') ? 'vi-VN' : 'en-US'

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50 flex justify-end'>
      <button
        type='button'
        aria-label={t('employer.actions.close')}
        className='absolute inset-0 bg-slate-950/30 backdrop-blur-[2px]'
        onClick={onClose}
      />

      <aside className='relative h-full w-full max-w-2xl overflow-hidden border-l border-slate-200 bg-white shadow-[0_0_60px_rgba(15,23,42,0.2)]'>
        <div className='flex h-full flex-col'>
          <div className='flex flex-col gap-4 border-b border-slate-200 bg-slate-50 px-5 py-5 sm:flex-row sm:items-start sm:justify-between sm:px-6'>
            <div className='min-w-0'>
              <p className='text-xs font-semibold uppercase tracking-[0.22em] text-slate-400'>{t('employer.jobs.modal.jobDetails')}</p>
              <h2 className='mt-2 text-xl font-bold text-slate-950 sm:text-2xl'>{job.title}</h2>
              <p className='mt-1 text-sm text-slate-600'>{job.category?.name || '-'}</p>
            </div>
            <button
              type='button'
              onClick={onClose}
              className='self-end rounded-xl p-2 text-slate-500 transition hover:bg-slate-200 hover:text-slate-900 sm:self-start'
            >
              <X className='h-5 w-5' />
            </button>
          </div>

          <div className='flex-1 overflow-y-auto px-5 py-5 sm:px-6'>
            <div className='space-y-6'>
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
                <MetricTile label={t('employer.jobs.table.status')}>
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      job.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {job.isActive ? t('employer.statuses.OPEN') : t('employer.statuses.PAUSED')}
                  </span>
                </MetricTile>
                <MetricTile label={t('employer.jobs.table.applicants')}>
                  <span className='text-sm font-semibold text-slate-950'>{job.applicantCount || 0}</span>
                </MetricTile>
                <MetricTile label={t('employer.jobs.table.updated')}>
                  <span className='text-sm font-semibold text-slate-950'>
                    {new Date(job.updatedDate).toLocaleDateString(locale, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </MetricTile>
                <MetricTile label={t('employer.jobs.table.jobType')}>
                  <span className='text-sm font-semibold text-slate-950'>{job.jobType?.job_type || '-'}</span>
                </MetricTile>
              </div>

              <section className='space-y-4'>
                <h3 className='text-lg font-semibold text-slate-950'>{t('employer.jobs.modal.jobDetails')}</h3>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <DetailTile
                    icon={<MapPin className='h-5 w-5 text-blue-600' />}
                    label={t('employer.jobs.table.location')}
                    value={job.workLocation || t('employer.jobs.modal.remote')}
                  />
                  <DetailTile
                    icon={<DollarSign className='h-5 w-5 text-emerald-600' />}
                    label={t('employer.jobs.table.salary')}
                    value={job.salary || t('employer.jobs.modal.negotiable')}
                  />
                  <DetailTile
                    icon={<Briefcase className='h-5 w-5 text-violet-600' />}
                    label={t('employer.jobs.table.experience')}
                    value={job.experience || t('employer.jobs.modal.notSpecified')}
                  />
                  <DetailTile
                    icon={<Layers className='h-5 w-5 text-orange-600' />}
                    label={t('employer.jobs.table.level')}
                    value={job.level || t('employer.jobs.modal.notSpecified')}
                  />
                </div>
              </section>

              {job.description ? (
                <section className='space-y-3'>
                  <h3 className='text-lg font-semibold text-slate-950'>{t('employer.jobs.create.labels.description')}</h3>
                  <div className='rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-700 whitespace-pre-line'>
                    {job.description}
                  </div>
                </section>
              ) : null}

              {job.requirements ? (
                <section className='space-y-3'>
                  <h3 className='text-lg font-semibold text-slate-950'>{t('employer.jobs.create.labels.requirements')}</h3>
                  <div className='rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-700 whitespace-pre-line'>
                    {job.requirements}
                  </div>
                </section>
              ) : null}
            </div>
          </div>

          <div className='flex flex-col-reverse gap-3 border-t border-slate-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-6'>
            <Button variant='outline' onClick={onClose} className='w-full rounded-xl sm:w-auto'>
              {t('employer.actions.close')}
            </Button>
            <Button className='w-full rounded-xl sm:w-auto'>{t('employer.jobs.modal.viewApplications')}</Button>
          </div>
        </div>
      </aside>
    </div>
  )
}

const MetricTile = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className='rounded-2xl border border-slate-200 bg-slate-50 p-4'>
    <p className='mb-2 text-xs font-medium uppercase tracking-[0.16em] text-slate-500'>{label}</p>
    {children}
  </div>
)

const DetailTile = ({
  icon,
  label,
  value
}: {
  icon: React.ReactNode
  label: string
  value: string
}) => (
  <div className='flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4'>
    <span className='mt-1 shrink-0'>{icon}</span>
    <div>
      <p className='text-xs font-medium uppercase tracking-[0.16em] text-slate-500'>{label}</p>
      <p className='mt-1 text-sm font-semibold text-slate-950'>{value}</p>
    </div>
  </div>
)

export default ViewJobModal
