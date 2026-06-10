import { Briefcase, DollarSign, MapPin, Layers, X } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { EmployerJobItem } from '@/@types/employer'
import { Button } from '@/components/ui/button'
import JobApplicationsModal from './JobApplicationsModal'

type ViewJobModalProps = {
  job: EmployerJobItem
  isOpen: boolean
  onClose: () => void
}

const ViewJobModal = ({ job, isOpen, onClose }: ViewJobModalProps) => {
  const { i18n, t } = useTranslation()
  const [isApplicationsOpen, setIsApplicationsOpen] = useState(false)
  const locale = i18n.language.startsWith('vi') ? 'vi-VN' : 'en-US'

  if (!isOpen) return null

  return (
    <>
      <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-950/58 p-4 backdrop-blur-sm'>
        <div className='mx-auto flex max-h-[calc(100vh-2rem)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 transition-colors duration-500 dark:bg-[#1b202b] dark:ring-slate-300/14'>
          <div className='flex flex-col gap-4 border-b border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-start sm:justify-between sm:p-6 dark:border-slate-300/14 dark:bg-slate-200/8'>
            <div className='min-w-0'>
              <h2 className='text-xl font-bold text-slate-950 sm:text-2xl dark:text-white'>{job.title}</h2>
              <p className='mt-1 text-sm text-slate-600 dark:text-slate-300'>{job.category?.name}</p>
            </div>
            <button
              onClick={onClose}
              className='self-end rounded-lg p-2 text-slate-500 transition hover:bg-slate-200 hover:text-slate-900 sm:self-start dark:text-slate-300 dark:hover:bg-slate-200/12 dark:hover:text-white'
            >
              <X className='h-5 w-5' />
            </button>
          </div>

          <div className='flex-1 overflow-y-auto p-4 sm:p-6'>
            <div className='space-y-6'>
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                <div className='rounded-lg bg-slate-50 p-4 dark:bg-slate-200/7'>
                  <p className='mb-1 text-xs font-medium text-slate-600 dark:text-slate-300'>
                    {t('employer.jobs.table.status')}
                  </p>
                  <p className='text-sm font-semibold text-slate-950 dark:text-white'>
                    <span
                      className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${
                        job.isActive
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-400/12 dark:text-emerald-100'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-200/10 dark:text-slate-200'
                      }`}
                    >
                      {job.isActive ? t('employer.statuses.OPEN') : t('employer.statuses.PAUSED')}
                    </span>
                  </p>
                </div>
                <div className='rounded-lg bg-slate-50 p-4 dark:bg-slate-200/7'>
                  <p className='mb-1 text-xs font-medium text-slate-600 dark:text-slate-300'>
                    {t('employer.jobs.table.applicants')}
                  </p>
                  <p className='text-sm font-semibold text-slate-950 dark:text-white'>{job.applicantCount || 0}</p>
                </div>
                <div className='rounded-lg bg-slate-50 p-4 dark:bg-slate-200/7'>
                  <p className='mb-1 text-xs font-medium text-slate-600 dark:text-slate-300'>
                    {t('employer.jobs.table.updated')}
                  </p>
                  <p className='text-sm font-semibold text-slate-950 dark:text-white'>
                    {new Date(job.updatedDate).toLocaleDateString(locale, {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div className='rounded-lg bg-slate-50 p-4 dark:bg-slate-200/7'>
                  <p className='mb-1 text-xs font-medium text-slate-600 dark:text-slate-300'>
                    {t('employer.jobs.table.jobType')}
                  </p>
                  <p className='text-sm font-semibold text-slate-950 dark:text-white'>{job.jobType?.job_type || '-'}</p>
                </div>
              </div>

              <div className='space-y-4'>
                <h3 className='text-lg font-semibold text-slate-950 dark:text-white'>
                  {t('employer.jobs.modal.jobDetails')}
                </h3>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <div className='flex items-start gap-3 rounded-lg bg-slate-50 p-4 dark:bg-slate-200/7'>
                    <MapPin className='mt-1 h-5 w-5 flex-shrink-0 text-blue-600' />
                    <div>
                      <p className='text-xs font-medium text-slate-600 dark:text-slate-300'>
                        {t('employer.jobs.table.location')}
                      </p>
                      <p className='text-sm font-semibold text-slate-950 dark:text-white'>
                        {job.workLocation || t('employer.jobs.modal.remote')}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-start gap-3 rounded-lg bg-slate-50 p-4 dark:bg-slate-200/7'>
                    <DollarSign className='mt-1 h-5 w-5 flex-shrink-0 text-emerald-600' />
                    <div>
                      <p className='text-xs font-medium text-slate-600 dark:text-slate-300'>
                        {t('employer.jobs.table.salary')}
                      </p>
                      <p className='text-sm font-semibold text-slate-950 dark:text-white'>
                        {job.salary || t('employer.jobs.modal.negotiable')}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-start gap-3 rounded-lg bg-slate-50 p-4 dark:bg-slate-200/7'>
                    <Briefcase className='mt-1 h-5 w-5 flex-shrink-0 text-violet-600' />
                    <div>
                      <p className='text-xs font-medium text-slate-600 dark:text-slate-300'>
                        {t('employer.jobs.table.experience')}
                      </p>
                      <p className='text-sm font-semibold text-slate-950 dark:text-white'>
                        {job.experience || t('employer.jobs.modal.notSpecified')}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-start gap-3 rounded-lg bg-slate-50 p-4 dark:bg-slate-200/7'>
                    <Layers className='mt-1 h-5 w-5 flex-shrink-0 text-orange-600' />
                    <div>
                      <p className='text-xs font-medium text-slate-600 dark:text-slate-300'>
                        {t('employer.jobs.table.level')}
                      </p>
                      <p className='text-sm font-semibold text-slate-950 dark:text-white'>
                        {job.level || t('employer.jobs.modal.notSpecified')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-end sm:p-6 dark:border-slate-300/14 dark:bg-slate-200/8'>
            <Button variant='outline' onClick={onClose} className='w-full rounded-lg sm:w-auto'>
              {t('employer.actions.close')}
            </Button>
            <Button className='w-full rounded-lg sm:w-auto' onClick={() => setIsApplicationsOpen(true)}>
              {t('employer.jobs.modal.viewApplications')}
            </Button>
          </div>
        </div>
      </div>

      <JobApplicationsModal job={job} isOpen={isApplicationsOpen} onClose={() => setIsApplicationsOpen(false)} />
    </>
  )
}

export default ViewJobModal
