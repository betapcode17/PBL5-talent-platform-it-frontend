import { Plus, Download } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import EmployerPageHeader from '@/components/employer/EmployerPageHeader'
import EmployerSectionCard from '@/components/employer/EmployerSectionCard'
import EmployerInterviewList from '@/components/employer/EmployerInterviewList'
import EmployerEmptyState from '@/components/employer/EmployerEmptyState'
import { useEmployerInterviews } from '@/hooks/useEmployerData'

const InterviewsPage = () => {
  const { data, isLoading, error } = useEmployerInterviews()

  const handleExport = () => {
    if (!data?.interviews) return

    const csv = [
      ['Candidate', 'Job Title', 'Date', 'Time', 'Interview Type', 'Location', 'Status'],
      ...data.interviews.map((interview) => [
        interview.candidate.fullName,
        interview.job.title,
        interview.interviewDate ? new Date(interview.interviewDate).toLocaleDateString('en-US') : '-',
        interview.startTime || '-',
        interview.interviewType || '-',
        interview.location || '-',
        interview.status
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
    <div className='flex items-center gap-3'>
      <Button variant='outline' size='sm' onClick={handleExport} className='rounded-lg'>
        <Download className='h-4 w-4' />
        Export
      </Button>
      <Link to='/employer/interviews/create'>
        <Button size='sm' className='rounded-lg'>
          <Plus className='h-4 w-4' />
          Add Schedule
        </Button>
      </Link>
    </div>
  )

  return (
    <div className='space-y-6'>
      <EmployerPageHeader
        eyebrow='Interview schedule'
        title='Interview Schedule'
        description='Company interview schedules including candidate, round, and interviewer.'
      />

      <EmployerSectionCard
        title={`All Interview Schedules${data ? ` • ${data.total}` : ''}`}
        description='Data sourced from InterviewSchedule via employer endpoint.'
        action={actionButtons}
        contentClassName='space-y-4'
      >
        {isLoading ? (
          <EmployerEmptyState
            title='Loading interview schedules'
            description='System is syncing the latest interview schedules.'
          />
        ) : null}
        {error ? <EmployerEmptyState title='Failed to load interview schedules' description={error} /> : null}
        {data ? <EmployerInterviewList interviews={data.interviews} /> : null}
      </EmployerSectionCard>
    </div>
  )
}

export default InterviewsPage
