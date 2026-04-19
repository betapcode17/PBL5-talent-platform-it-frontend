import { Download } from 'lucide-react'

import { Button } from '@/components/ui/button'
import EmployerPageHeader from '@/components/employer/EmployerPageHeader'
import EmployerSectionCard from '@/components/employer/EmployerSectionCard'
import EmployerCandidateList from '@/components/employer/EmployerCandidateList'
import EmployerEmptyState from '@/components/employer/EmployerEmptyState'
import { useEmployerCandidates } from '@/hooks/useEmployerData'

const CandidatesPage = () => {
  const { data, isLoading, error } = useEmployerCandidates()

  const handleExport = () => {
    if (!data?.candidates) return

    const csv = [
      ['Candidate Name', 'Email', 'Phone', 'Job Applied', 'Stage', 'Skills', 'Applied Date'],
      ...data.candidates.map((candidate) => [
        candidate.seeker.fullName,
        candidate.seeker.email,
        candidate.seeker.phone || '-',
        candidate.job.title,
        candidate.stage || '-',
        candidate.seeker.skills.join('; '),
        new Date(candidate.appliedAt).toLocaleDateString('en-US')
      ])
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `candidates-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const actionButtons = (
    <Button variant='outline' size='sm' onClick={handleExport} className='rounded-lg'>
      <Download className='h-4 w-4' />
      Export
    </Button>
  )

  return (
    <div className='space-y-6'>
      <EmployerPageHeader
        eyebrow='Candidate pipeline'
        title='Submitted Candidates'
        description='Aggregated from applications and candidate profiles related to company jobs.'
      />

      <EmployerSectionCard
        title={`Candidate List${data ? ` • ${data.total}` : ''}`}
        description='Track current stage, key skills, and upcoming interviews.'
        action={actionButtons}
        contentClassName='space-y-4'
      >
        {isLoading ? (
          <EmployerEmptyState title='Loading candidates' description='System is fetching the latest candidate list.' />
        ) : null}
        {error ? <EmployerEmptyState title='Failed to load candidates' description={error} /> : null}
        {data ? <EmployerCandidateList candidates={data.candidates} /> : null}
      </EmployerSectionCard>
    </div>
  )
}

export default CandidatesPage
