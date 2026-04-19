import { X, MapPin, DollarSign, Briefcase, Users } from 'lucide-react'
import type { EmployerJobItem } from '@/@types/employer'
import { Button } from '@/components/ui/button'

type ViewJobModalProps = {
  job: EmployerJobItem
  isOpen: boolean
  onClose: () => void
}

const ViewJobModal = ({ job, isOpen, onClose }: ViewJobModalProps) => {
  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
      <div className='w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col'>
        {/* Header */}
        <div className='flex items-start justify-between p-6 border-b border-slate-200 bg-slate-50'>
          <div>
            <h2 className='text-2xl font-bold text-slate-950'>{job.title}</h2>
            <p className='text-sm text-slate-600 mt-1'>{job.category?.name}</p>
          </div>
          <button onClick={onClose} className='p-2 hover:bg-slate-200 rounded-lg transition'>
            <X className='h-5 w-5' />
          </button>
        </div>

        {/* Content */}
        <div className='flex-1 overflow-y-auto p-6'>
          <div className='space-y-6'>
            {/* Status & Quick Info */}
            <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
              <div className='p-4 bg-slate-50 rounded-lg'>
                <p className='text-xs font-medium text-slate-600 mb-1'>Status</p>
                <p className='text-sm font-semibold text-slate-950'>
                  <span
                    className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${
                      job.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {job.isActive ? 'Open' : 'Paused'}
                  </span>
                </p>
              </div>
              <div className='p-4 bg-slate-50 rounded-lg'>
                <p className='text-xs font-medium text-slate-600 mb-1'>Applicants</p>
                <p className='text-sm font-semibold text-slate-950'>{job.applicantCount || 0}</p>
              </div>
              <div className='p-4 bg-slate-50 rounded-lg'>
                <p className='text-xs font-medium text-slate-600 mb-1'>Updated</p>
                <p className='text-sm font-semibold text-slate-950'>
                  {new Date(job.updatedDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div className='p-4 bg-slate-50 rounded-lg'>
                <p className='text-xs font-medium text-slate-600 mb-1'>Job Type</p>
                <p className='text-sm font-semibold text-slate-950'>{job.jobType?.job_type || '-'}</p>
              </div>
            </div>

            {/* Key Details */}
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-slate-950'>Job Details</h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='flex items-start gap-3 p-4 bg-slate-50 rounded-lg'>
                  <MapPin className='h-5 w-5 text-blue-600 flex-shrink-0 mt-1' />
                  <div>
                    <p className='text-xs font-medium text-slate-600'>Location</p>
                    <p className='text-sm font-semibold text-slate-950'>{job.workLocation || 'Remote'}</p>
                  </div>
                </div>
                <div className='flex items-start gap-3 p-4 bg-slate-50 rounded-lg'>
                  <DollarSign className='h-5 w-5 text-emerald-600 flex-shrink-0 mt-1' />
                  <div>
                    <p className='text-xs font-medium text-slate-600'>Salary</p>
                    <p className='text-sm font-semibold text-slate-950'>{job.salary || 'Negotiable'}</p>
                  </div>
                </div>
                <div className='flex items-start gap-3 p-4 bg-slate-50 rounded-lg'>
                  <Briefcase className='h-5 w-5 text-violet-600 flex-shrink-0 mt-1' />
                  <div>
                    <p className='text-xs font-medium text-slate-600'>Experience Required</p>
                    <p className='text-sm font-semibold text-slate-950'>{job.experienceRequired || 'Not specified'}</p>
                  </div>
                </div>
                <div className='flex items-start gap-3 p-4 bg-slate-50 rounded-lg'>
                  <Users className='h-5 w-5 text-orange-600 flex-shrink-0 mt-1' />
                  <div>
                    <p className='text-xs font-medium text-slate-600'>Positions</p>
                    <p className='text-sm font-semibold text-slate-950'>{job.numberOfPositions || 1}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            {job.description && (
              <div className='space-y-3'>
                <h3 className='text-lg font-semibold text-slate-950'>Description</h3>
                <p className='text-sm text-slate-700 leading-relaxed whitespace-pre-wrap'>{job.description}</p>
              </div>
            )}

            {/* Requirements */}
            {job.requirements && (
              <div className='space-y-3'>
                <h3 className='text-lg font-semibold text-slate-950'>Requirements</h3>
                <p className='text-sm text-slate-700 leading-relaxed whitespace-pre-wrap'>{job.requirements}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className='flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50'>
          <Button variant='outline' onClick={onClose} className='rounded-lg'>
            Close
          </Button>
          <Button className='rounded-lg'>View Applications</Button>
        </div>
      </div>
    </div>
  )
}

export default ViewJobModal
