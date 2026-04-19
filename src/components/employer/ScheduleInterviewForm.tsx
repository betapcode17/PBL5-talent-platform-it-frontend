import { useMemo, useState } from 'react'
import { CalendarPlus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { useEmployerWorkspace } from './EmployerWorkspaceContext'

const ScheduleInterviewForm = () => {
  const { mockJobs, scheduleMockInterview } = useEmployerWorkspace()

  const defaultJobTitle = useMemo(() => mockJobs[0]?.title || '', [mockJobs])
  const [form, setForm] = useState({
    candidateName: '',
    candidateEmail: '',
    interviewerName: '',
    jobTitle: defaultJobTitle,
    interviewDate: '',
    interviewType: 'Online',
    location: ''
  })

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!form.candidateName || !form.candidateEmail || !form.jobTitle || !form.interviewDate) return

    scheduleMockInterview(form)
    setForm({
      candidateName: '',
      candidateEmail: '',
      interviewerName: '',
      jobTitle: mockJobs[0]?.title || '',
      interviewDate: '',
      interviewType: 'Online',
      location: ''
    })
  }

  return (
    <form onSubmit={handleSubmit} className='rounded-[26px] border border-slate-100 bg-slate-50/80 p-5'>
      <div className='mb-4'>
        <p className='text-lg font-semibold text-slate-950'>Schedule Interview</p>
        <p className='mt-1 text-sm text-slate-500'>
          New interviews will be added to the interviews table and candidate mock.
        </p>
      </div>

      <FieldGroup className='gap-4'>
        <div className='grid gap-4 md:grid-cols-2'>
          <Field>
            <FieldLabel>Candidate Name</FieldLabel>
            <Input
              value={form.candidateName}
              onChange={(event) => handleChange('candidateName', event.target.value)}
              placeholder='John Doe'
            />
          </Field>
          <Field>
            <FieldLabel>Email</FieldLabel>
            <Input
              value={form.candidateEmail}
              onChange={(event) => handleChange('candidateEmail', event.target.value)}
              placeholder='candidate@example.com'
            />
          </Field>
        </div>
        <div className='grid gap-4 md:grid-cols-2'>
          <Field>
            <FieldLabel>Interviewer</FieldLabel>
            <Input
              value={form.interviewerName}
              onChange={(event) => handleChange('interviewerName', event.target.value)}
              placeholder='Nguyen Minh Recruiter'
            />
          </Field>
          <Field>
            <FieldLabel>Position</FieldLabel>
            <select
              value={form.jobTitle}
              onChange={(event) => handleChange('jobTitle', event.target.value)}
              className='border-input h-10 w-full rounded-md border bg-white px-3 text-sm outline-none'
            >
              {mockJobs.map((job) => (
                <option key={job.id} value={job.title}>
                  {job.title}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <div className='grid gap-4 md:grid-cols-2'>
          <Field>
            <FieldLabel>Date & Time</FieldLabel>
            <Input
              type='datetime-local'
              value={form.interviewDate}
              onChange={(event) => handleChange('interviewDate', event.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel>Interview Type</FieldLabel>
            <select
              value={form.interviewType}
              onChange={(event) => handleChange('interviewType', event.target.value)}
              className='border-input h-10 w-full rounded-md border bg-white px-3 text-sm outline-none'
            >
              <option>Online</option>
              <option>Offline</option>
              <option>Technical</option>
              <option>HR Screen</option>
            </select>
          </Field>
        </div>
        <Field>
          <FieldLabel>Location / Link</FieldLabel>
          <Input
            value={form.location}
            onChange={(event) => handleChange('location', event.target.value)}
            placeholder='Google Meet / Office 3F'
          />
        </Field>
        <Button type='submit' className='rounded-2xl'>
          <CalendarPlus className='h-4 w-4' />
          Add to Schedule
        </Button>
      </FieldGroup>
    </form>
  )
}

export default ScheduleInterviewForm
