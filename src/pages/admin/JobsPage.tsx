import { useEffect, useMemo, useState } from 'react'
import { Eye, RefreshCw, ShieldBan, ShieldCheck } from 'lucide-react'
import { AdminShell } from '@/components/admin/AdminShell'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { getAdminJobsApi, toggleAdminJobStatusApi } from '@/api/admin'
import type { AdminJobListItem } from '@/types/admin'
import { cn } from '@/lib/utils'

type StatusFilter = 'all' | 'active' | 'banned'

const formatDate = (value?: string | null) => {
  if (!value) return 'N/A'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'N/A'
  return date.toLocaleDateString('vi-VN')
}

const JobsPage = () => {
  const pageSize = 10
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [jobs, setJobs] = useState<AdminJobListItem[]>([])
  const [selectedJob, setSelectedJob] = useState<AdminJobListItem | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const loadJobs = async (targetPage = page) => {
    try {
      setIsLoading(true)
      const response = await getAdminJobsApi({
        page: targetPage,
        limit: pageSize,
        search: search.trim() || undefined,
        active: statusFilter === 'all' ? undefined : statusFilter === 'active',
        sortBy: 'updatedDate',
        sortOrder: 'desc'
      })

      setPage(response.page)
      setTotalPages(Math.max(1, response.totalPages))

      setJobs(response.jobs)
      setTotal(response.total)
      setError(null)

      setSelectedJob((current) => {
        if (!current) return response.jobs[0] || null
        return response.jobs.find((item) => item.id === current.id) || response.jobs[0] || null
      })
    } catch {
      setError('Không thể tải danh sách công việc.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadJobs(page)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, page])

  const fromRecord = total === 0 ? 0 : (page - 1) * pageSize + 1
  const toRecord = Math.min(page * pageSize, total)

  const visiblePages = useMemo(() => {
    const pages: number[] = []
    const start = Math.max(1, page - 2)
    const end = Math.min(totalPages, page + 2)

    for (let index = start; index <= end; index += 1) {
      pages.push(index)
    }

    return pages
  }, [page, totalPages])

  const rowsText = useMemo(() => {
    if (isLoading) return 'Đang tải dữ liệu...'
    if (error) return error
    return `Hiển thị ${fromRecord}-${toRecord} trên ${total} công việc`
  }, [isLoading, error, fromRecord, toRecord, total])

  const handleToggleStatus = async (job: AdminJobListItem) => {
    try {
      setIsUpdating(job.id)
      await toggleAdminJobStatusApi(job.id, !job.isActive)
      await loadJobs(page)
    } finally {
      setIsUpdating(null)
    }
  }

  return (
    <AdminShell
      title='Quản lý công việc'
      subtitle='Theo dõi tin tuyển dụng, trạng thái hiển thị và thông tin vị trí chi tiết.'
    >
      <section className='grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]'>
        <Card className='border-slate-200/80 bg-white/90 py-0 shadow-[0_18px_60px_rgba(15,23,42,0.06)] dark:border-white/8 dark:bg-[#121423]/88'>
          <CardContent className='p-5 sm:p-6'>
            <div className='flex flex-wrap items-center gap-3'>
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder='Tìm theo tiêu đề việc làm, công ty, kỹ năng...'
                className='h-10 max-w-md border-slate-200 bg-white dark:border-white/10 dark:bg-white/5'
              />
              <Button
                variant='outline'
                className='h-10'
                onClick={() => {
                  setPage(1)
                  void loadJobs(1)
                }}
              >
                <RefreshCw className='size-4' />
                Làm mới
              </Button>
            </div>

            <div className='mt-3 flex flex-wrap gap-2'>
              {(
                [
                  ['all', 'Tất cả'],
                  ['active', 'Đang hoạt động'],
                  ['banned', 'Đã ban']
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type='button'
                  onClick={() => {
                    setStatusFilter(value)
                    setPage(1)
                  }}
                  className={cn(
                    'rounded-lg px-3 py-1.5 text-sm font-semibold transition',
                    statusFilter === value
                      ? 'bg-violet-600/12 text-violet-700 dark:bg-violet-500/20 dark:text-violet-200'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900 dark:bg-white/5 dark:text-slate-300'
                  )}
                >
                  {label}
                </button>
              ))}
            </div>

            <p className='mt-3 text-sm font-medium text-slate-500 dark:text-slate-400'>{rowsText}</p>

            <div className='mt-5 overflow-x-auto'>
              <table className='w-full min-w-215 border-separate border-spacing-0'>
                <thead>
                  <tr className='text-left text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400'>
                    <th className='border-b border-slate-200 pb-3 dark:border-white/10'>Công việc</th>
                    <th className='border-b border-slate-200 pb-3 dark:border-white/10'>Công ty</th>
                    <th className='border-b border-slate-200 pb-3 dark:border-white/10'>Mức lương</th>
                    <th className='border-b border-slate-200 pb-3 dark:border-white/10'>Ứng tuyển</th>
                    <th className='border-b border-slate-200 pb-3 dark:border-white/10'>Trạng thái</th>
                    <th className='border-b border-slate-200 pb-3 dark:border-white/10'>Deadline</th>
                    <th className='border-b border-slate-200 pb-3 text-right dark:border-white/10'>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job.id}>
                      <td className='border-b border-slate-200/80 py-3 dark:border-white/10'>
                        <p className='text-sm font-bold text-slate-950 dark:text-white'>{job.title}</p>
                        <p className='text-xs text-slate-500 dark:text-slate-400'>
                          {job.level || 'N/A'} · {job.jobType.name}
                        </p>
                      </td>
                      <td className='border-b border-slate-200/80 py-3 text-sm font-semibold text-slate-700 dark:border-white/10 dark:text-slate-200'>
                        {job.company.name}
                      </td>
                      <td className='border-b border-slate-200/80 py-3 text-sm text-slate-700 dark:border-white/10 dark:text-slate-200'>
                        {job.salary || 'Thoả thuận'}
                      </td>
                      <td className='border-b border-slate-200/80 py-3 text-sm text-slate-700 dark:border-white/10 dark:text-slate-200'>
                        {job.applicationsCount}
                      </td>
                      <td className='border-b border-slate-200/80 py-3 dark:border-white/10'>
                        <span
                          className={cn(
                            'inline-flex rounded-full px-2.5 py-1 text-xs font-bold',
                            job.isActive
                              ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                              : 'bg-rose-500/15 text-rose-700 dark:text-rose-300'
                          )}
                        >
                          {job.isActive ? 'Active' : 'Banned'}
                        </span>
                      </td>
                      <td className='border-b border-slate-200/80 py-3 text-sm text-slate-600 dark:border-white/10 dark:text-slate-300'>
                        {formatDate(job.deadline)}
                      </td>
                      <td className='border-b border-slate-200/80 py-3 text-right dark:border-white/10'>
                        <div className='flex justify-end gap-2'>
                          <Button variant='outline' size='sm' onClick={() => setSelectedJob(job)}>
                            <Eye className='size-4' /> Chi tiết
                          </Button>
                          <Button
                            size='sm'
                            variant={job.isActive ? 'destructive' : 'default'}
                            disabled={isUpdating === job.id}
                            onClick={() => void handleToggleStatus(job)}
                          >
                            {job.isActive ? <ShieldBan className='size-4' /> : <ShieldCheck className='size-4' />}
                            {job.isActive ? 'Ban' : 'Active'}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className='mt-4 flex flex-wrap items-center justify-between gap-3'>
              <p className='text-xs font-semibold text-slate-500 dark:text-slate-400'>
                Trang {page}/{totalPages}
              </p>

              <div className='flex items-center gap-1.5'>
                <Button
                  variant='outline'
                  size='sm'
                  disabled={isLoading || page <= 1}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                >
                  Trước
                </Button>

                {visiblePages.map((item) => (
                  <Button
                    key={item}
                    size='sm'
                    variant={item === page ? 'default' : 'outline'}
                    disabled={isLoading}
                    onClick={() => setPage(item)}
                  >
                    {item}
                  </Button>
                ))}

                <Button
                  variant='outline'
                  size='sm'
                  disabled={isLoading || page >= totalPages}
                  onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                >
                  Sau
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='border-slate-200/80 bg-white/90 py-0 shadow-[0_18px_60px_rgba(15,23,42,0.06)] dark:border-white/8 dark:bg-[#121423]/88'>
          <CardContent className='space-y-4 p-5 sm:p-6'>
            <h3 className='text-lg font-bold text-slate-950 dark:text-white'>Chi tiết công việc</h3>
            {selectedJob ? (
              <>
                <div className='rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5'>
                  <p className='text-sm text-slate-500 dark:text-slate-400'>Tiêu đề</p>
                  <p className='text-base font-bold text-slate-900 dark:text-white'>{selectedJob.title}</p>
                  <p className='mt-1 text-sm text-slate-600 dark:text-slate-300'>{selectedJob.company.name}</p>
                </div>

                <dl className='space-y-3 text-sm'>
                  <div className='flex justify-between gap-4'>
                    <dt className='text-slate-500 dark:text-slate-400'>Loại công việc</dt>
                    <dd className='font-semibold text-slate-900 dark:text-white'>{selectedJob.jobType.name}</dd>
                  </div>
                  <div className='flex justify-between gap-4'>
                    <dt className='text-slate-500 dark:text-slate-400'>Danh mục</dt>
                    <dd className='font-semibold text-slate-900 dark:text-white'>{selectedJob.category.name}</dd>
                  </div>
                  <div className='flex justify-between gap-4'>
                    <dt className='text-slate-500 dark:text-slate-400'>Mức lương</dt>
                    <dd className='font-semibold text-slate-900 dark:text-white'>
                      {selectedJob.salary || 'Thoả thuận'}
                    </dd>
                  </div>
                  <div className='flex justify-between gap-4'>
                    <dt className='text-slate-500 dark:text-slate-400'>Số lượng tuyển</dt>
                    <dd className='font-semibold text-slate-900 dark:text-white'>
                      {selectedJob.numberOfHires ?? 'N/A'}
                    </dd>
                  </div>
                  <div className='flex justify-between gap-4'>
                    <dt className='text-slate-500 dark:text-slate-400'>Trạng thái</dt>
                    <dd className='font-semibold text-slate-900 dark:text-white'>
                      {selectedJob.isActive ? 'Active' : 'Banned'}
                    </dd>
                  </div>
                </dl>

                <div className='rounded-xl border border-violet-200/70 bg-violet-50/70 p-4 dark:border-violet-400/20 dark:bg-violet-500/10'>
                  <p className='text-xs font-bold uppercase tracking-[0.14em] text-violet-600 dark:text-violet-300'>
                    Mô tả công việc
                  </p>
                  <p className='mt-2 text-sm text-slate-700 dark:text-slate-200'>
                    {selectedJob.description || 'Chưa có mô tả chi tiết.'}
                  </p>
                </div>
              </>
            ) : (
              <p className='text-sm text-slate-500 dark:text-slate-400'>
                Chọn một công việc trong bảng để xem chi tiết.
              </p>
            )}
          </CardContent>
        </Card>
      </section>
    </AdminShell>
  )
}

export default JobsPage
