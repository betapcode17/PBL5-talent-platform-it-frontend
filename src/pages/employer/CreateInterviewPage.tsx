import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import EmployerPageHeader from '@/components/employer/EmployerPageHeader'
import EmployerSectionCard from '@/components/employer/EmployerSectionCard'
import CreateInterviewScheduleForm from '@/components/employer/CreateInterviewScheduleForm'

const CreateInterviewPage = () => {
  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-2'>
        <Link to='/employer/interviews'>
          <Button variant='outline' size='sm' className='rounded-lg'>
            <ArrowLeft className='h-4 w-4' />
            Back to Interviews
          </Button>
        </Link>
      </div>

      <EmployerPageHeader
        eyebrow='Interview schedule'
        title='Create New Interview Schedule'
        description='Set up a new interview session with a candidate for a specific position.'
      />

      <EmployerSectionCard
        title='Schedule Interview'
        description='Fill in the interview details including date, time, and location or meeting link.'
        contentClassName='space-y-6'
      >
        <CreateInterviewScheduleForm
          onClose={() => {
            window.location.href = '/employer/interviews'
          }}
        />
      </EmployerSectionCard>
    </div>
  )
}

export default CreateInterviewPage
