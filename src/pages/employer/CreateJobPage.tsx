import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import EmployerPageHeader from '@/components/employer/EmployerPageHeader'
import EmployerSectionCard from '@/components/employer/EmployerSectionCard'
import CreateJobForm from '@/components/employer/CreateJobForm'

const CreateJobPage = () => {
  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-4'>
        <Link to='/employer/jobs'>
          <Button variant='outline' size='sm' className='rounded-lg'>
            <ArrowLeft className='h-4 w-4' />
            Back to Jobs
          </Button>
        </Link>
      </div>

      <EmployerPageHeader
        eyebrow='Create new posting'
        title='Add New Job Position'
        description='Fill in the details below to create a new job posting. Your position will be published immediately to candidate pool.'
      />

      <EmployerSectionCard
        title='Job Details'
        description='Enter all required information for your job posting.'
        contentClassName='max-w-3xl'
      >
        <CreateJobForm />
      </EmployerSectionCard>
    </div>
  )
}

export default CreateJobPage
