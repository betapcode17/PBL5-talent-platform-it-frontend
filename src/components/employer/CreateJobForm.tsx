import { useState } from 'react'
import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { useEmployerWorkspace } from './EmployerWorkspaceContext'

interface CreateJobFormProps {
  onClose?: () => void
}

const CreateJobForm = ({ onClose }: CreateJobFormProps) => {
  const { createMockJob } = useEmployerWorkspace()
  const [form, setForm] = useState({
    title: '',
    category: '',
    jobType: 'Full-time',
    workLocation: '',
    salary: '',
    level: 'Middle'
  })

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!form.title || !form.category || !form.workLocation || !form.salary) {
      alert('Please fill in all required fields')
      return
    }

    createMockJob(form)
    setForm({
      title: '',
      category: '',
      jobType: 'Full-time',
      workLocation: '',
      salary: '',
      level: 'Middle'
    })

    onClose?.()
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <FieldGroup className='gap-4'>
        <Field>
          <FieldLabel>Position Title *</FieldLabel>
          <Input
            value={form.title}
            onChange={(event) => handleChange('title', event.target.value)}
            placeholder='Senior Backend Engineer'
            required
          />
        </Field>
        <div className='grid gap-4 md:grid-cols-2'>
          <Field>
            <FieldLabel>Category *</FieldLabel>
            <Input
              value={form.category}
              onChange={(event) => handleChange('category', event.target.value)}
              placeholder='Engineering'
              required
            />
          </Field>
          <Field>
            <FieldLabel>Job Type</FieldLabel>
            <select
              value={form.jobType}
              onChange={(event) => handleChange('jobType', event.target.value)}
              className='border-input h-10 w-full rounded-md border bg-white px-3 text-sm outline-none'
            >
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Hybrid</option>
              <option>Remote</option>
            </select>
          </Field>
        </div>
        <div className='grid gap-4 md:grid-cols-2'>
          <Field>
            <FieldLabel>Location *</FieldLabel>
            <Input
              value={form.workLocation}
              onChange={(event) => handleChange('workLocation', event.target.value)}
              placeholder='Da Nang'
              required
            />
          </Field>
          <Field>
            <FieldLabel>Salary *</FieldLabel>
            <Input
              value={form.salary}
              onChange={(event) => handleChange('salary', event.target.value)}
              placeholder='25 - 35 million'
              required
            />
          </Field>
        </div>
        <Field>
          <FieldLabel>Level</FieldLabel>
          <select
            value={form.level}
            onChange={(event) => handleChange('level', event.target.value)}
            className='border-input h-10 w-full rounded-md border bg-white px-3 text-sm outline-none'
          >
            <option>Junior</option>
            <option>Middle</option>
            <option>Senior</option>
            <option>Lead</option>
          </select>
        </Field>
        <div className='flex gap-3 pt-4'>
          <Button type='submit' className='flex-1 rounded-xl'>
            <Plus className='h-4 w-4' />
            Create Job
          </Button>
          {onClose && (
            <Button type='button' variant='outline' className='flex-1 rounded-xl' onClick={onClose}>
              Cancel
            </Button>
          )}
        </div>
      </FieldGroup>
    </form>
  )
}

export default CreateJobForm
