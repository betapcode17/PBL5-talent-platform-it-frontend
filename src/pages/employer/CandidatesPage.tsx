import { Download } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import EmployerPageHeader from '@/components/employer/EmployerPageHeader'
import EmployerSectionCard from '@/components/employer/EmployerSectionCard'
import EmployerCandidateList from '@/components/employer/EmployerCandidateList'
import EmployerEmptyState from '@/components/employer/EmployerEmptyState'
import { useEmployerCandidates } from '@/hooks/useEmployerData'
import { useAuthStore } from '@/store/authStore'

const CandidatesPage = () => {
  const { i18n, t } = useTranslation()
  const { data, isLoading, error } = useEmployerCandidates()
  const companyId = useAuthStore((state) => state.user?.employee?.company.company_id)
  const locale = i18n.language.startsWith('vi') ? 'vi-VN' : 'en-US'

  const handleExport = () => {
    if (!data?.candidates) return

    const csv = [
      [
        t('employer.candidates.table.candidateName'),
        t('employer.candidates.table.email'),
        t('employer.candidates.modal.phone'),
        t('employer.candidates.table.jobTitle'),
        t('employer.candidates.table.stage'),
        t('employer.candidates.table.skills'),
        t('employer.candidates.table.appliedDate')
      ],
      ...data.candidates.map((candidate) => [
        candidate.seeker.fullName,
        candidate.seeker.email,
        candidate.seeker.phone || '-',
        candidate.job.title,
        candidate.stage ? t(`employer.candidates.status.${candidate.stage}`, { defaultValue: candidate.stage }) : '-',
        candidate.seeker.skills.join('; '),
        new Date(candidate.appliedAt).toLocaleDateString(locale)
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
    <Button variant='outline' size='sm' onClick={handleExport} className='w-full rounded-lg sm:w-auto'>
      <Download className='h-4 w-4' />
      {t('employer.candidates.page.export')}
    </Button>
  )

  return (
    <div className='min-w-0 space-y-6'>
      <EmployerPageHeader
        eyebrow={t('employer.candidates.page.eyebrow')}
        title={t('employer.candidates.page.title')}
        description={t('employer.candidates.page.description')}
      />

      <EmployerSectionCard
        title={`${t('employer.candidates.page.sectionTitle')}${data ? ` - ${data.total}` : ''}`}
        description={t('employer.candidates.page.sectionDescription')}
        action={actionButtons}
        contentClassName='space-y-4'
      >
        {isLoading ? (
          <EmployerEmptyState
            title={t('employer.candidates.page.loadingTitle')}
            description={t('employer.candidates.page.loadingDescription')}
          />
        ) : null}
        {error ? <EmployerEmptyState title={t('employer.candidates.page.failedTitle')} description={error} /> : null}
        {data ? <EmployerCandidateList candidates={data.candidates} companyId={companyId} /> : null}
      </EmployerSectionCard>
    </div>
  )
}

export default CandidatesPage
