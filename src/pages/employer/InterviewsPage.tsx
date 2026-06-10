import { Plus, Download } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import EmployerPageHeader from '@/components/employer/EmployerPageHeader'
import EmployerSectionCard from '@/components/employer/EmployerSectionCard'
import EmployerInterviewList from '@/components/employer/EmployerInterviewList'
import EmployerEmptyState from '@/components/employer/EmployerEmptyState'
import { useEmployerInterviews } from '@/hooks/useEmployerData'

const InterviewsPage = () => {
  const { i18n, t } = useTranslation()
  const { data, isLoading, error } = useEmployerInterviews()
  const locale = i18n.language.startsWith('vi') ? 'vi-VN' : 'en-US'

  const getStatusLabel = (status?: string | null) => {
    if (!status) return '-'

    return t(`employer.statuses.${status}`, { defaultValue: status })
  }

  const handleExport = () => {
    if (!data?.interviews) return

    const csv = [
      [
        t('employer.interviews.table.candidate'),
        t('employer.interviews.table.jobTitle'),
        t('employer.interviews.table.date'),
        t('employer.interviews.table.time'),
        t('employer.interviews.table.interviewType'),
        t('employer.interviews.table.location'),
        t('employer.interviews.table.status')
      ],
      ...data.interviews.map((interview) => [
        interview.candidate.fullName,
        interview.job.title,
        interview.interviewDate ? new Date(interview.interviewDate).toLocaleDateString(locale) : '-',
        interview.startTime || '-',
        interview.interviewType || '-',
        interview.location || '-',
        getStatusLabel(interview.status)
      ])
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `interviews-${new Date().toISOString().split('T')[0]}.csv`)
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
      <Link to='/employer/interviews/create' className='w-full sm:w-auto'>
        <Button size='sm' className='w-full rounded-lg sm:w-auto'>
          <Plus className='h-4 w-4' />
          {t('employer.interviews.page.addSchedule')}
        </Button>
      </Link>
    </div>
  )

  return (
    <div className='min-w-0 space-y-6'>
      <EmployerPageHeader
        eyebrow={t('employer.interviews.page.eyebrow')}
        title={t('employer.interviews.page.title')}
        description={t('employer.interviews.page.description')}
      />

      <EmployerSectionCard
        title={`${t('employer.interviews.page.sectionTitle')}${data ? ` - ${data.total}` : ''}`}
        description={t('employer.interviews.page.sectionDescription')}
        action={actionButtons}
        contentClassName='space-y-4'
      >
        {isLoading ? (
          <EmployerEmptyState
            title={t('employer.interviews.page.loadingTitle')}
            description={t('employer.interviews.page.loadingDescription')}
          />
        ) : null}
        {error ? <EmployerEmptyState title={t('employer.interviews.page.failedTitle')} description={error} /> : null}
        {data ? <EmployerInterviewList interviews={data.interviews} /> : null}
      </EmployerSectionCard>
    </div>
  )
}

export default InterviewsPage
