import { useEffect, useMemo, useState } from 'react'
import { CheckCircle2, Eye, RefreshCw, XCircle } from 'lucide-react'
import { AdminShell } from '@/components/admin/AdminShell'
import { AdminDetailModal } from '@/components/admin/AdminDetailModal'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  approveAdminEmployerRegistrationRequestApi,
  getAdminEmployerRegistrationRequestsApi,
  rejectAdminEmployerRegistrationRequestApi
} from '@/api/admin'
import type {
  AdminEmployerRegistrationRequestListItem,
  AdminEmployerRegistrationRoleCount,
  AdminEmployerRegistrationStatusCounts
} from '@/types/admin'
import { cn } from '@/lib/utils'

type StatusFilter = 'all' | 'PENDING' | 'APPROVED' | 'REJECTED'

const formatDate = (value?: string | null) => {
  if (!value) return 'N/A'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'N/A'
  return date.toLocaleString('vi-VN')
}

const statusLabel = (status: StatusFilter | AdminEmployerRegistrationRequestListItem['status']) => {
  if (status === 'PENDING') return 'Chờ duyệt'
  if (status === 'APPROVED') return 'Đã duyệt'
  if (status === 'REJECTED') return 'Đã từ chối'
  return 'Tất cả'
}

const EmployerRegistrationRequestsPage = () => {
  const pageSize = 10
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('PENDING')
  const [roleFilter, setRoleFilter] = useState('all')
  const [requests, setRequests] = useState<AdminEmployerRegistrationRequestListItem[]>([])
  const [selectedRequest, setSelectedRequest] = useState<AdminEmployerRegistrationRequestListItem | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [statusCounts, setStatusCounts] = useState<AdminEmployerRegistrationStatusCounts>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  })
  const [roleCounts, setRoleCounts] = useState<AdminEmployerRegistrationRoleCount[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState<number | null>(null)
  const [reviewNote, setReviewNote] = useState('')
  const [error, setError] = useState<string | null>(null)
  const emptyStatusCounts: AdminEmployerRegistrationStatusCounts = {
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  }

  const loadRequests = async (targetPage = page) => {
    try {
      setIsLoading(true)
      const response = await getAdminEmployerRegistrationRequestsApi({
        page: targetPage,
        limit: pageSize,
        search: search.trim() || undefined,
        status: statusFilter === 'all' ? undefined : statusFilter,
        role: roleFilter === 'all' ? undefined : roleFilter
      })

      setRequests(response.requests)
      setPage(response.page)
      setTotalPages(Math.max(1, response.totalPages))
      setTotal(response.total)
      setStatusCounts(
        response.statusCounts ?? {
          ...emptyStatusCounts,
          total: response.total ?? 0
        }
      )
      setRoleCounts(Array.isArray(response.roleCounts) ? response.roleCounts : [])
      setError(null)

      setSelectedRequest((current) => {
        if (!current) return null
        return response.requests.find((item) => item.id === current.id) || null
      })
    } catch {
      setRequests([])
      setStatusCounts(emptyStatusCounts)
      setRoleCounts([])
      setError('Không thể tải danh sách yêu cầu đăng ký nhà tuyển dụng.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadRequests(page)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, roleFilter, page])

  useEffect(() => {
    if (!selectedRequest) {
      setReviewNote('')
      return
    }

    setReviewNote(selectedRequest.reviewNote || '')
  }, [selectedRequest])

  const rowsText = useMemo(() => {
    if (isLoading) return 'Đang tải dữ liệu...'
    if (error) return error
    if (total === 0) return 'Chưa có yêu cầu đăng ký nào.'
    const fromRecord = (page - 1) * pageSize + 1
    const toRecord = Math.min(page * pageSize, total)
    return `Hiển thị ${fromRecord}-${toRecord} trên ${total} yêu cầu`
  }, [error, isLoading, page, pageSize, total])

  const summaryCards = useMemo(
    () => [
      {
        key: 'total',
        label: 'Tổng yêu cầu',
        value: statusCounts.total,
        tone: 'text-slate-900 dark:text-white'
      },
      {
        key: 'pending',
        label: 'Chờ duyệt',
        value: statusCounts.pending,
        tone: 'text-amber-600 dark:text-amber-300'
      },
      {
        key: 'approved',
        label: 'Đã duyệt',
        value: statusCounts.approved,
        tone: 'text-emerald-600 dark:text-emerald-300'
      },
      {
        key: 'rejected',
        label: 'Đã từ chối',
        value: statusCounts.rejected,
        tone: 'text-rose-600 dark:text-rose-300'
      }
    ],
    [statusCounts]
  )

  const visiblePages = useMemo(() => {
    const pages: number[] = []
    const start = Math.max(1, page - 2)
    const end = Math.min(totalPages, page + 2)

    for (let index = start; index <= end; index += 1) {
      pages.push(index)
    }

    return pages
  }, [page, totalPages])

  const handleApprove = async (request: AdminEmployerRegistrationRequestListItem) => {
    try {
      setIsUpdating(request.id)
      await approveAdminEmployerRegistrationRequestApi(request.id, reviewNote.trim() || undefined)
      await loadRequests(page)
    } finally {
      setIsUpdating(null)
    }
  }

  const handleReject = async (request: AdminEmployerRegistrationRequestListItem) => {
    try {
      setIsUpdating(request.id)
      await rejectAdminEmployerRegistrationRequestApi(request.id, reviewNote.trim() || undefined)
      await loadRequests(page)
    } finally {
      setIsUpdating(null)
    }
  }

  return (
    <AdminShell
      title='Duyệt đăng ký nhà tuyển dụng'
      subtitle='Admin phê duyệt yêu cầu mới. Mỗi yêu cầu được phê duyệt sẽ tạo mới công ty và tài khoản employee.'
    >
      <section className='space-y-5'>
        <div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-4'>
          {summaryCards.map((item) => (
            <Card
              key={item.key}
              className='border-slate-200/80 bg-white/90 py-0 shadow-[0_14px_40px_rgba(15,23,42,0.05)] dark:border-white/8 dark:bg-[#121423]/88'
            >
              <CardContent className='p-4'>
                <p className='text-xs font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400'>
                  {item.label}
                </p>
                <p className={cn('mt-2 text-2xl font-black', item.tone)}>{item.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className='border-slate-200/80 bg-white/90 py-0 shadow-[0_18px_60px_rgba(15,23,42,0.06)] dark:border-white/8 dark:bg-[#121423]/88'>
          <CardContent className='p-5 sm:p-6'>
            <div className='flex flex-wrap items-center gap-3'>
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder='Tìm theo tên người đăng ký, email, công ty...'
                className='h-10 max-w-md border-slate-200 bg-white dark:border-white/10 dark:bg-white/5'
              />
              <Button
                variant='outline'
                className='h-10'
                onClick={() => {
                  setPage(1)
                  void loadRequests(1)
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
                  ['PENDING', 'Chờ duyệt'],
                  ['APPROVED', 'Đã duyệt'],
                  ['REJECTED', 'Đã từ chối']
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

            <div className='mt-3 flex flex-wrap items-center gap-2'>
              <span className='text-xs font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400'>
                Lọc theo vai trò
              </span>
              <button
                type='button'
                onClick={() => {
                  setRoleFilter('all')
                  setPage(1)
                }}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-sm font-semibold transition',
                  roleFilter === 'all'
                    ? 'bg-sky-600/12 text-sky-700 dark:bg-sky-500/20 dark:text-sky-200'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 dark:bg-white/5 dark:text-slate-300'
                )}
              >
                Tất cả
              </button>
              {roleCounts.map((item) => (
                <button
                  key={item.role}
                  type='button'
                  onClick={() => {
                    setRoleFilter(item.role)
                    setPage(1)
                  }}
                  className={cn(
                    'rounded-lg px-3 py-1.5 text-sm font-semibold transition',
                    roleFilter === item.role
                      ? 'bg-sky-600/12 text-sky-700 dark:bg-sky-500/20 dark:text-sky-200'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900 dark:bg-white/5 dark:text-slate-300'
                  )}
                >
                  {item.role} ({item.count})
                </button>
              ))}
            </div>

            <p className='mt-3 text-sm font-medium text-slate-500 dark:text-slate-400'>{rowsText}</p>

            <div className='mt-5 overflow-x-auto'>
              <table className='w-full min-w-230 border-separate border-spacing-0'>
                <thead>
                  <tr className='text-left text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400'>
                    <th className='border-b border-slate-200 pb-3 dark:border-white/10'>Người đăng ký</th>
                    <th className='border-b border-slate-200 pb-3 dark:border-white/10'>Công ty</th>
                    <th className='border-b border-slate-200 pb-3 dark:border-white/10'>Vai trò</th>
                    <th className='border-b border-slate-200 pb-3 dark:border-white/10'>Trạng thái</th>
                    <th className='border-b border-slate-200 pb-3 dark:border-white/10'>Tạo lúc</th>
                    <th className='border-b border-slate-200 pb-3 text-right dark:border-white/10'>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => (
                    <tr key={request.id}>
                      <td className='border-b border-slate-200/80 py-3 dark:border-white/10'>
                        <p className='text-sm font-bold text-slate-950 dark:text-white'>{request.fullName}</p>
                        <p className='text-xs text-slate-500 dark:text-slate-400'>{request.email}</p>
                        <p className='text-xs text-slate-500 dark:text-slate-400'>{request.phone}</p>
                        <p className='mt-1 text-xs font-semibold text-slate-600 dark:text-slate-300'>
                          Ngày vào làm: {formatDate(request.joinedDate)}
                        </p>
                      </td>
                      <td className='border-b border-slate-200/80 py-3 dark:border-white/10'>
                        <p className='text-sm font-semibold text-slate-900 dark:text-white'>{request.companyName}</p>
                        <p className='text-xs text-slate-500 dark:text-slate-400'>{request.companyAddress}</p>
                        {request.companyWebsiteUrl ? (
                          <p className='text-xs text-sky-600 dark:text-sky-300'>{request.companyWebsiteUrl}</p>
                        ) : null}
                      </td>
                      <td className='border-b border-slate-200/80 py-3 text-sm text-slate-700 dark:border-white/10 dark:text-slate-200'>
                        {request.role}
                      </td>
                      <td className='border-b border-slate-200/80 py-3 dark:border-white/10'>
                        <span
                          className={cn(
                            'inline-flex rounded-full px-2.5 py-1 text-xs font-bold',
                            request.status === 'PENDING'
                              ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
                              : request.status === 'APPROVED'
                                ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                                : 'bg-rose-500/15 text-rose-700 dark:text-rose-300'
                          )}
                        >
                          {statusLabel(request.status)}
                        </span>
                      </td>
                      <td className='border-b border-slate-200/80 py-3 text-sm text-slate-600 dark:border-white/10 dark:text-slate-300'>
                        {formatDate(request.createdDate)}
                      </td>
                      <td className='border-b border-slate-200/80 py-3 text-right dark:border-white/10'>
                        <Button variant='outline' size='sm' onClick={() => setSelectedRequest(request)}>
                          <Eye className='size-4' />
                          Chi tiết
                        </Button>
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

        <AdminDetailModal
          open={Boolean(selectedRequest)}
          title={selectedRequest ? selectedRequest.companyName : ''}
          onClose={() => setSelectedRequest(null)}
        >
          {selectedRequest ? (
            <>
              <div className='rounded-2xl border border-white/10 bg-white/4 p-4'>
                <p className='text-sm text-slate-400'>Người đăng ký</p>
                <p className='text-base font-bold text-white'>{selectedRequest.fullName}</p>
                <p className='mt-1 text-sm text-slate-300'>{selectedRequest.email}</p>
                <p className='mt-1 text-sm text-slate-300'>{selectedRequest.phone}</p>
              </div>

              <dl className='mt-4 space-y-3 text-sm'>
                <div className='flex justify-between gap-4 border-b border-white/10 pb-3'>
                  <dt className='text-slate-400'>Công ty</dt>
                  <dd className='font-semibold text-white'>{selectedRequest.companyName}</dd>
                </div>
                <div className='flex justify-between gap-4 border-b border-white/10 pb-3'>
                  <dt className='text-slate-400'>Địa chỉ</dt>
                  <dd className='text-right font-semibold text-white'>{selectedRequest.companyAddress}</dd>
                </div>
                <div className='flex justify-between gap-4 border-b border-white/10 pb-3'>
                  <dt className='text-slate-400'>Website</dt>
                  <dd className='truncate font-semibold text-white'>{selectedRequest.companyWebsiteUrl || 'N/A'}</dd>
                </div>
                <div className='flex justify-between gap-4 border-b border-white/10 pb-3'>
                  <dt className='text-slate-400'>Vai trò đăng ký</dt>
                  <dd className='font-semibold text-white'>{selectedRequest.role}</dd>
                </div>
                <div className='flex justify-between gap-4 border-b border-white/10 pb-3'>
                  <dt className='text-slate-400'>Ngày vào làm</dt>
                  <dd className='font-semibold text-white'>{formatDate(selectedRequest.joinedDate)}</dd>
                </div>
                <div className='flex justify-between gap-4'>
                  <dt className='text-slate-400'>Trạng thái</dt>
                  <dd className='font-semibold text-white'>{statusLabel(selectedRequest.status)}</dd>
                </div>
                <div className='flex justify-between gap-4 border-t border-white/10 pt-3'>
                  <dt className='text-slate-400'>Tạo lúc</dt>
                  <dd className='font-semibold text-white'>{formatDate(selectedRequest.createdDate)}</dd>
                </div>
                <div className='flex justify-between gap-4'>
                  <dt className='text-slate-400'>Cập nhật lúc</dt>
                  <dd className='font-semibold text-white'>{formatDate(selectedRequest.updatedDate)}</dd>
                </div>
                <div className='flex justify-between gap-4'>
                  <dt className='text-slate-400'>Duyệt lúc</dt>
                  <dd className='font-semibold text-white'>{formatDate(selectedRequest.approvedAt)}</dd>
                </div>
                <div className='flex justify-between gap-4'>
                  <dt className='text-slate-400'>Từ chối lúc</dt>
                  <dd className='font-semibold text-white'>{formatDate(selectedRequest.rejectedAt)}</dd>
                </div>
                <div className='flex justify-between gap-4'>
                  <dt className='text-slate-400'>ID công ty</dt>
                  <dd className='font-semibold text-white'>{selectedRequest.companyId ?? 'N/A'}</dd>
                </div>
                <div className='flex justify-between gap-4'>
                  <dt className='text-slate-400'>ID người dùng</dt>
                  <dd className='font-semibold text-white'>{selectedRequest.createdUserId ?? 'N/A'}</dd>
                </div>
              </dl>

              <div className='mt-4 space-y-3'>
                <label className='block text-xs font-bold uppercase tracking-[0.14em] text-violet-300'>
                  Ghi chú admin
                </label>
                <textarea
                  rows={4}
                  value={reviewNote}
                  onChange={(event) => setReviewNote(event.target.value)}
                  disabled={selectedRequest.status !== 'PENDING'}
                  className='w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-violet-400'
                  placeholder='Nhập ghi chú phê duyệt hoặc lý do từ chối...'
                />
              </div>

              {selectedRequest.generatedLoginEmail ? (
                <div className='mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4'>
                  <p className='text-xs font-bold uppercase tracking-[0.14em] text-emerald-300'>Tài khoản đã tạo</p>
                  <p className='mt-2 text-sm text-slate-200'>{selectedRequest.generatedLoginEmail}</p>
                </div>
              ) : null}

              <div className='mt-5 flex flex-wrap justify-end gap-2'>
                <Button
                  variant='outline'
                  onClick={() => setSelectedRequest(null)}
                  className='border-white/10 bg-white/5 text-white hover:bg-white/10'
                >
                  Đóng
                </Button>
                {selectedRequest.status === 'PENDING' ? (
                  <>
                    <Button
                      variant='destructive'
                      disabled={isUpdating === selectedRequest.id}
                      onClick={() => void handleReject(selectedRequest)}
                    >
                      <XCircle className='size-4' />
                      Từ chối
                    </Button>
                    <Button
                      disabled={isUpdating === selectedRequest.id}
                      onClick={() => void handleApprove(selectedRequest)}
                    >
                      <CheckCircle2 className='size-4' />
                      Phê duyệt và tạo tài khoản
                    </Button>
                  </>
                ) : null}
              </div>
            </>
          ) : null}
        </AdminDetailModal>
      </section>
    </AdminShell>
  )
}

export default EmployerRegistrationRequestsPage
