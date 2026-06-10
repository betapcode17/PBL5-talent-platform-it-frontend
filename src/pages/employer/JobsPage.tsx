import { Plus, Download } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import EmployerPageHeader from '@/components/employer/EmployerPageHeader'
import EmployerSectionCard from '@/components/employer/EmployerSectionCard'
import EmployerJobList from '@/components/employer/EmployerJobList'
import EmployerEmptyState from '@/components/employer/EmployerEmptyState'
import { useEmployerJobs } from '@/hooks/useEmployerData'

const JobsPage = () => {
  const { i18n, t } = useTranslation()
  const { data, isLoading, error } = useEmployerJobs()
  const locale = i18n.language.startsWith('vi') ? 'vi-VN' : 'en-US'

  const handleExport = () => {
    if (!data?.jobs) return

    const csv = [
      [
        t('employer.jobs.table.jobTitle'),
        t('employer.jobs.table.category'),
        t('employer.jobs.table.location'),
        t('employer.jobs.table.salary'),
        t('employer.jobs.table.applicants'),
        t('employer.jobs.table.status'),
        t('employer.jobs.table.updatedDate')
      ],
      ...data.jobs.map((job) => [
        job.title,
        job.category?.name || '-',
        job.workLocation || '-',
        job.salary || '-',
        job.applicantCount || 0,
        job.isActive ? t('employer.statuses.OPEN') : t('employer.statuses.PAUSED'),
        new Date(job.updatedDate).toLocaleDateString(locale)
      ])
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `jobs-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const actionButtons = (
    <div className='flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center'>
      <Button variant='outline' size='sm' onClick={handleExport} className='w-full rounded-lg sm:w-auto'>
        <Download className='h-4 w-4' />
        {t('employer.actions.export')}
      </Button>
      <Link to='/employer/jobs/create' className='w-full sm:w-auto'>
        <Button size='sm' className='w-full rounded-lg sm:w-auto'>
          <Plus className='h-4 w-4' />
          {t('employer.jobs.page.addJob')}
        </Button>
      </Link>
    </div>
  )

  return (
    <div className='min-w-0 space-y-6'>
      <EmployerPageHeader
        eyebrow={t('employer.jobs.page.eyebrow')}
        title={t('employer.jobs.page.title')}
        description={t('employer.jobs.page.description')}
      />

      <EmployerSectionCard
        title={`${t('employer.jobs.page.sectionTitle')}${data ? ` - ${data.total}` : ''}`}
        description={t('employer.jobs.page.sectionDescription')}
        action={actionButtons}
        contentClassName='space-y-4'
      >
        {isLoading ? (
          <EmployerEmptyState
            title={t('employer.jobs.page.loadingTitle')}
            description={t('employer.jobs.page.loadingDescription')}
          />
        ) : null}
        {error ? <EmployerEmptyState title={t('employer.jobs.page.failedTitle')} description={error} /> : null}
        {data ? <EmployerJobList jobs={data.jobs} /> : null}
      </EmployerSectionCard>
    </div>
  )
}

export default JobsPage
