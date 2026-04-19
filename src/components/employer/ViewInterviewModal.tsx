import { X, Calendar, Clock, MapPin, Users, Video } from 'lucide-react'
import type { EmployerInterviewItem } from '@/@types/employer'
import { Button } from '@/components/ui/button'

type ViewInterviewModalProps = {
  interview: EmployerInterviewItem
  isOpen: boolean
  onClose: () => void
}

const ViewInterviewModal = ({ interview, isOpen, onClose }: ViewInterviewModalProps) => {
  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
      <div className='w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col'>
        {/* Header */}
        <div className='flex items-start justify-between p-6 border-b border-slate-200 bg-slate-50'>
          <div>
            <h2 className='text-2xl font-bold text-slate-950'>{interview.candidate.fullName}</h2>
            <p className='text-sm text-slate-600 mt-1'>{interview.job.title}</p>
          </div>
          <button onClick={onClose} className='p-2 hover:bg-slate-200 rounded-lg transition'>
            <X className='h-5 w-5' />
          </button>
        </div>

        {/* Content */}
        <div className='flex-1 overflow-y-auto p-6'>
          <div className='space-y-6'>
            {/* Status & Status Info */}
            <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
              <div className='p-4 bg-slate-50 rounded-lg'>
                <p className='text-xs font-medium text-slate-600 mb-1'>Status</p>
                <span
                  className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                    interview.status === 'COMPLETED'
                      ? 'bg-emerald-50 text-emerald-700'
                      : interview.status === 'SCHEDULED'
                        ? 'bg-violet-50 text-violet-700'
                        : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {interview.status}
                </span>
              </div>
              <div className='p-4 bg-slate-50 rounded-lg'>
                <p className='text-xs font-medium text-slate-600 mb-1'>Interview Type</p>
                <span className='inline-block rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700'>
                  {interview.interviewType || 'Not specified'}
                </span>
              </div>
              <div className='p-4 bg-slate-50 rounded-lg'>
                <p className='text-xs font-medium text-slate-600 mb-1'>Interviewer</p>
                <p className='text-sm font-semibold text-slate-950'>{interview.interviewer?.fullName || '-'}</p>
              </div>
              <div className='p-4 bg-slate-50 rounded-lg'>
                <p className='text-xs font-medium text-slate-600 mb-1'>Round</p>
                <p className='text-sm font-semibold text-slate-950'>{interview.interviewRound || '-'}</p>
              </div>
            </div>

            {/* Interview Schedule */}
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-slate-950'>Interview Schedule</h3>
              <div className='space-y-3'>
                <div className='flex items-start gap-3 p-4 bg-slate-50 rounded-lg'>
                  <Calendar className='h-5 w-5 text-blue-600 flex-shrink-0 mt-1' />
                  <div>
                    <p className='text-xs font-medium text-slate-600'>Date</p>
                    <p className='text-sm font-semibold text-slate-950'>
                      {interview.interviewDate
                        ? new Date(interview.interviewDate).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        : '-'}
                    </p>
                  </div>
                </div>

                {interview.startTime || interview.endTime ? (
                  <div className='flex items-start gap-3 p-4 bg-slate-50 rounded-lg'>
                    <Clock className='h-5 w-5 text-orange-600 flex-shrink-0 mt-1' />
                    <div>
                      <p className='text-xs font-medium text-slate-600'>Time</p>
                      <p className='text-sm font-semibold text-slate-950'>
                        {interview.startTime}
                        {interview.endTime ? ` - ${interview.endTime}` : ''}
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Location/Meeting Details */}
            {interview.interviewType === 'Online' && interview.meetingLink ? (
              <div className='space-y-3'>
                <h3 className='text-lg font-semibold text-slate-950'>Meeting Details</h3>
                <div className='flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200'>
                  <Video className='h-5 w-5 text-blue-600 flex-shrink-0 mt-1' />
                  <div className='flex-1'>
                    <p className='text-xs font-medium text-blue-700 mb-1'>Meeting Link</p>
                    <a
                      href={interview.meetingLink}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-sm font-semibold text-blue-700 underline break-all'
                    >
                      {interview.meetingLink}
                    </a>
                  </div>
                </div>
              </div>
            ) : interview.location ? (
              <div className='space-y-3'>
                <h3 className='text-lg font-semibold text-slate-950'>Interview Location</h3>
                <div className='flex items-start gap-3 p-4 bg-slate-50 rounded-lg'>
                  <MapPin className='h-5 w-5 text-red-600 flex-shrink-0 mt-1' />
                  <div>
                    <p className='text-xs font-medium text-slate-600'>Location</p>
                    <p className='text-sm font-semibold text-slate-950'>{interview.location}</p>
                  </div>
                </div>
              </div>
            ) : null}

            {/* Candidate Info */}
            <div className='space-y-3'>
              <h3 className='text-lg font-semibold text-slate-950'>Candidate Information</h3>
              <div className='grid grid-cols-2 gap-4'>
                <div className='p-4 bg-slate-50 rounded-lg'>
                  <p className='text-xs font-medium text-slate-600 mb-1'>Email</p>
                  <p className='text-sm font-semibold text-slate-950'>{interview.candidate.email || '-'}</p>
                </div>
                <div className='p-4 bg-slate-50 rounded-lg'>
                  <p className='text-xs font-medium text-slate-600 mb-1'>Phone</p>
                  <p className='text-sm font-semibold text-slate-950'>{interview.candidate.phone || '-'}</p>
                </div>
              </div>
            </div>

            {/* Notes */}
            {interview.notes && (
              <div className='space-y-3'>
                <h3 className='text-lg font-semibold text-slate-950'>Interview Notes</h3>
                <p className='text-sm text-slate-700 leading-relaxed whitespace-pre-wrap bg-slate-50 p-4 rounded-lg'>
                  {interview.notes}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className='flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50'>
          <Button variant='outline' onClick={onClose} className='rounded-lg'>
            Close
          </Button>
          <Button className='rounded-lg'>Reschedule</Button>
        </div>
      </div>
    </div>
  )
}

export default ViewInterviewModal
