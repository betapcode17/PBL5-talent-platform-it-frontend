import { Plus, Download } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import EmployerPageHeader from '@/components/employer/EmployerPageHeader'
import EmployerSectionCard from '@/components/employer/EmployerSectionCard'
import EmployerJobList from '@/components/employer/EmployerJobList'
import EmployerEmptyState from '@/components/employer/EmployerEmptyState'
import { useEmployerJobs } from '@/hooks/useEmployerData'

const JobsPage = () => {
  const { data, isLoading, error } = useEmployerJobs()

  const handleExport = () => {
    if (!data?.jobs) return

    const csv = [
      ['Job Title', 'Category', 'Location', 'Salary', 'Applicants', 'Status', 'Updated Date'],
      ...data.jobs.map((job) => [
        job.title,
        job.category?.name || '-',
        job.workLocation || '-',
        job.salary || '-',
        job.applicantCount || 0,
        job.isActive ? 'Open' : 'Paused',
        new Date(job.updatedDate).toLocaleDateString('en-US')
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
    <div className='flex items-center gap-3'>
      <Button variant='outline' size='sm' onClick={handleExport} className='rounded-lg'>
        <Download className='h-4 w-4' />
        Export
      </Button>
      <Link to='/employer/jobs/create'>
        <Button size='sm' className='rounded-lg'>
          <Plus className='h-4 w-4' />
          Add Job
        </Button>
      </Link>
    </div>
  )

  return (
    <div className='space-y-6'>
      <EmployerPageHeader
        eyebrow='Jobs management'
        title='Company Job Postings'
        description='Monitor open positions, number of applicants, and latest update time.'
      />

      <EmployerSectionCard
        title={`All Job Postings${data ? ` • ${data.total}` : ''}`}
        description='Data sourced directly from the backend employer jobs endpoint.'
        action={actionButtons}
        contentClassName='space-y-4'
      >
        {isLoading ? (
          <EmployerEmptyState title='Loading jobs' description='System is fetching the company job postings list.' />
        ) : null}
        {error ? <EmployerEmptyState title='Failed to load jobs' description={error} /> : null}
        {data ? <EmployerJobList jobs={data.jobs} /> : null}
      </EmployerSectionCard>
    </div>
  )
}

export default JobsPage
