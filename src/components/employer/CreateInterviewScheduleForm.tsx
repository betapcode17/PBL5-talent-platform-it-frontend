import { useState } from 'react'
import { Calendar, Clock, MapPin, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type FormData = {
  candidateId: string
  jobId: string
  interviewDate: string
  startTime: string
  endTime: string
  interviewType: 'Online' | 'Offline'
  location: string
  meetingLink: string
  notes: string
}

type CreateInterviewScheduleFormProps = {
  onClose?: () => void
}

const CreateInterviewScheduleForm = ({ onClose }: CreateInterviewScheduleFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    candidateId: '',
    jobId: '',
    interviewDate: '',
    startTime: '',
    endTime: '',
    interviewType: 'Online',
    location: '',
    meetingLink: '',
    notes: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.candidateId) newErrors.candidateId = 'Please select a candidate'
    if (!formData.jobId) newErrors.jobId = 'Please select a job position'
    if (!formData.interviewDate) newErrors.interviewDate = 'Please select an interview date'
    if (!formData.startTime) newErrors.startTime = 'Please enter start time'
    if (!formData.endTime) newErrors.endTime = 'Please enter end time'
    if (formData.interviewType === 'Online' && !formData.meetingLink) {
      newErrors.meetingLink = 'Please provide a meeting link for online interview'
    }
    if (formData.interviewType === 'Offline' && !formData.location) {
      newErrors.location = 'Please provide a location for offline interview'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      console.log('Interview schedule created:', formData)
      if (onClose) onClose()
    } catch (error) {
      console.error('Failed to create interview schedule:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Mock data for dropdowns
  const candidates = [
    { id: '1', name: 'Ngo Quoc An' },
    { id: '2', name: 'Pham Gia Huy' },
    { id: '3', name: 'Tran Minh Duc' },
    { id: '4', name: 'Vu Thanh Hoa' }
  ]

  const jobs = [
    { id: '1', title: 'Backend Engineer (Node.js)' },
    { id: '2', title: 'Senior Product Designer' },
    { id: '3', title: 'QA Automation Engineer' }
  ]

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      {/* Section 1: Select Candidate & Job */}
      <div className='space-y-4'>
        <h3 className='text-sm font-semibold text-slate-950'>Select Candidate & Position</h3>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <div>
            <label className='block text-sm font-medium text-slate-700 mb-2'>Candidate *</label>
            <select
              name='candidateId'
              value={formData.candidateId}
              onChange={handleChange}
              className='w-full px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition'
            >
              <option value=''>Choose candidate...</option>
              {candidates.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.candidateId && <p className='text-xs text-red-500 mt-1'>{errors.candidateId}</p>}
          </div>
          <div>
            <label className='block text-sm font-medium text-slate-700 mb-2'>Job Position *</label>
            <select
              name='jobId'
              value={formData.jobId}
              onChange={handleChange}
              className='w-full px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition'
            >
              <option value=''>Choose position...</option>
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title}
                </option>
              ))}
            </select>
            {errors.jobId && <p className='text-xs text-red-500 mt-1'>{errors.jobId}</p>}
          </div>
        </div>
      </div>

      {/* Section 2: Date & Time */}
      <div className='space-y-4 pb-4 border-b border-slate-200'>
        <div className='flex items-center gap-2'>
          <Calendar className='h-5 w-5 text-slate-600' />
          <h3 className='text-sm font-semibold text-slate-950'>Interview Schedule</h3>
        </div>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
          <div>
            <label className='block text-sm font-medium text-slate-700 mb-2'>Interview Date *</label>
            <Input
              type='date'
              name='interviewDate'
              value={formData.interviewDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className='rounded-lg'
            />
            {errors.interviewDate && <p className='text-xs text-red-500 mt-1'>{errors.interviewDate}</p>}
          </div>
          <div>
            <label className='block text-sm font-medium text-slate-700 mb-2'>Start Time *</label>
            <Input
              type='time'
              name='startTime'
              value={formData.startTime}
              onChange={handleChange}
              className='rounded-lg'
            />
            {errors.startTime && <p className='text-xs text-red-500 mt-1'>{errors.startTime}</p>}
          </div>
          <div>
            <label className='block text-sm font-medium text-slate-700 mb-2'>End Time *</label>
            <Input type='time' name='endTime' value={formData.endTime} onChange={handleChange} className='rounded-lg' />
            {errors.endTime && <p className='text-xs text-red-500 mt-1'>{errors.endTime}</p>}
          </div>
        </div>
      </div>

      {/* Section 3: Interview Type */}
      <div className='space-y-4 pb-4 border-b border-slate-200'>
        <div className='flex items-center gap-2'>
          <Users className='h-5 w-5 text-slate-600' />
          <h3 className='text-sm font-semibold text-slate-950'>Interview Method</h3>
        </div>
        <div className='flex items-center gap-4'>
          <label className='flex items-center gap-2 cursor-pointer'>
            <input
              type='radio'
              name='interviewType'
              value='Online'
              checked={formData.interviewType === 'Online'}
              onChange={handleChange}
              className='h-4 w-4 cursor-pointer'
            />
            <span className='text-sm font-medium text-slate-700'>Online Meeting</span>
          </label>
          <label className='flex items-center gap-2 cursor-pointer'>
            <input
              type='radio'
              name='interviewType'
              value='Offline'
              checked={formData.interviewType === 'Offline'}
              onChange={handleChange}
              className='h-4 w-4 cursor-pointer'
            />
            <span className='text-sm font-medium text-slate-700'>In-Person Meeting</span>
          </label>
        </div>
      </div>

      {/* Section 4: Location or Meeting Link */}
      <div className='space-y-4 pb-4 border-b border-slate-200'>
        <div className='flex items-center gap-2'>
          <MapPin className='h-5 w-5 text-slate-600' />
          <h3 className='text-sm font-semibold text-slate-950'>Interview Location</h3>
        </div>

        {formData.interviewType === 'Online' ? (
          <div>
            <label className='block text-sm font-medium text-slate-700 mb-2'>Meeting Link / Platform *</label>
            <Input
              type='url'
              name='meetingLink'
              placeholder='https://meet.google.com/... or Zoom link'
              value={formData.meetingLink}
              onChange={handleChange}
              className='rounded-lg'
            />
            {errors.meetingLink && <p className='text-xs text-red-500 mt-1'>{errors.meetingLink}</p>}
            <p className='text-xs text-slate-500 mt-1'>Include platform name (Google Meet, Zoom, Teams, etc.)</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div>
              <label className='block text-sm font-medium text-slate-700 mb-2'>Office Location *</label>
              <Input
                type='text'
                name='location'
                placeholder='e.g., Office 3F - Meeting Room A'
                value={formData.location}
                onChange={handleChange}
                className='rounded-lg'
              />
              {errors.location && <p className='text-xs text-red-500 mt-1'>{errors.location}</p>}
            </div>
            <div>
              <label className='block text-sm font-medium text-slate-700 mb-2'>Additional Details</label>
              <Input type='text' placeholder='e.g., Parking info, building access, etc.' className='rounded-lg' />
            </div>
          </div>
        )}
      </div>

      {/* Section 5: Notes */}
      <div className='space-y-4'>
        <div className='flex items-center gap-2'>
          <Clock className='h-5 w-5 text-slate-600' />
          <h3 className='text-sm font-semibold text-slate-950'>Additional Notes</h3>
        </div>
        <div>
          <label className='block text-sm font-medium text-slate-700 mb-2'>Candidate Notes</label>
          <textarea
            name='notes'
            value={formData.notes}
            onChange={handleChange}
            placeholder='Share any special instructions or requirements for the candidate (optional)'
            rows={4}
            className='w-full px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition resize-none'
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className='flex items-center justify-end gap-3 pt-6 border-t border-slate-200'>
        <Button type='button' variant='outline' onClick={onClose} className='rounded-lg'>
          Cancel
        </Button>
        <Button type='submit' disabled={isSubmitting} className='rounded-lg'>
          {isSubmitting ? 'Creating...' : 'Create Schedule'}
        </Button>
      </div>
    </form>
  )
}

export default CreateInterviewScheduleForm
