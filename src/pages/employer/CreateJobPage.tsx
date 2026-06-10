import { ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import EmployerPageHeader from '@/components/employer/EmployerPageHeader'
import EmployerSectionCard from '@/components/employer/EmployerSectionCard'
import CreateJobForm from '@/components/employer/CreateJobForm'

const CreateJobPage = () => {
  const { t } = useTranslation()

  return (
    <div className='min-w-0 space-y-6'>
      <div className='flex items-center gap-4'>
        <Link to='/employer/jobs' className='w-full sm:w-auto'>
          <Button variant='outline' size='sm' className='w-full rounded-lg sm:w-auto'>
            <ArrowLeft className='h-4 w-4' />
            {t('employer.jobs.create.back')}
          </Button>
        </Link>
      </div>

      <EmployerPageHeader
        eyebrow={t('employer.jobs.create.eyebrow')}
        title={t('employer.jobs.create.title')}
        description={t('employer.jobs.create.description')}
      />

      <EmployerSectionCard
        title={t('employer.jobs.create.sectionTitle')}
        description={t('employer.jobs.create.sectionDescription')}
        contentClassName='w-full max-w-3xl'
      >
        <CreateJobForm mode='create' />
      </EmployerSectionCard>
    </div>
  )
}

export default CreateJobPage
