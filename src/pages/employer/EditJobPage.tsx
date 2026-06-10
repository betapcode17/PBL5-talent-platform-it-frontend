import { ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

import { getEmployerJobDetailApi } from '@/api/employer'
import type { EmployerJobItem } from '@/@types/employer'
import CreateJobForm from '@/components/employer/CreateJobForm'
import EmployerEmptyState from '@/components/employer/EmployerEmptyState'
import EmployerPageHeader from '@/components/employer/EmployerPageHeader'
import EmployerSectionCard from '@/components/employer/EmployerSectionCard'
import { Button } from '@/components/ui/button'

const EditJobPage = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const params = useParams()
  const jobId = Number(params.id)
  const locationJob = (location.state as { job?: EmployerJobItem } | null)?.job ?? null
  const [job, setJob] = useState<EmployerJobItem | null>(locationJob)
  const [isLoading, setIsLoading] = useState(!locationJob)

  useEffect(() => {
    if (locationJob || !Number.isFinite(jobId) || jobId <= 0) {
      return
    }

    let isMounted = true

    const loadJob = async () => {
      try {
        setIsLoading(true)
        const detail = await getEmployerJobDetailApi(jobId)
        if (!isMounted) return
        setJob(detail)
      } catch {
        if (!isMounted) return
        setJob(null)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadJob()

    return () => {
      isMounted = false
    }
  }, [jobId, locationJob])

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
        eyebrow={t('employer.jobs.edit.eyebrow', { defaultValue: 'Chỉnh sửa việc làm' })}
        title={t('employer.jobs.edit.title', { defaultValue: 'Cập nhật tin tuyển dụng' })}
        description={t('employer.jobs.edit.description', {
          defaultValue: 'Điều chỉnh thông tin vị trí tuyển dụng và lưu lại ngay trên hệ thống.'
        })}
      />

      <EmployerSectionCard
        title={t('employer.jobs.edit.sectionTitle', { defaultValue: 'Cập nhật chi tiết việc làm' })}
        description={t('employer.jobs.edit.sectionDescription', {
          defaultValue: 'Chỉnh sửa thông tin cần thiết rồi lưu thay đổi.'
        })}
        contentClassName='w-full max-w-3xl'
      >
        {isLoading && !job ? (
          <EmployerEmptyState
            title={t('employer.jobs.page.loadingTitle')}
            description={t('employer.jobs.page.loadingDescription')}
          />
        ) : null}
        {!isLoading && !job ? (
          <EmployerEmptyState
            title={t('employer.jobs.edit.notFoundTitle', { defaultValue: 'Không tìm thấy việc làm' })}
            description={t('employer.jobs.edit.notFoundDescription', {
              defaultValue: 'Việc làm này không tồn tại hoặc bạn không còn quyền chỉnh sửa.'
            })}
          />
        ) : null}
        {job ? <CreateJobForm mode='edit' initialJob={job} /> : null}
      </EmployerSectionCard>
    </div>
  )
}

export default EditJobPage
