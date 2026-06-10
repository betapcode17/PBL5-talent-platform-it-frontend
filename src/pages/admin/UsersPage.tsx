import { useEffect, useMemo, useState } from 'react'
import { Eye, RefreshCw, ShieldBan, ShieldCheck } from 'lucide-react'
import { AdminShell } from '@/components/admin/AdminShell'
import { AdminDetailModal } from '@/components/admin/AdminDetailModal'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { getAdminUsersApi, toggleAdminUserStatusApi } from '@/api/admin'
import type { AdminUserListItem } from '@/types/admin'
import { cn } from '@/lib/utils'

type StatusFilter = 'all' | 'active' | 'banned'

const roleLabel = (role: AdminUserListItem['role']) => {
  if (role === 'ADMIN') return 'Admin'
  if (role === 'EMPLOYEE') return 'Employer'
  return 'Seeker'
}

const formatDate = (value?: string | null) => {
  if (!value) return 'N/A'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'N/A'
  return date.toLocaleDateString('vi-VN')
}

const UsersPage = () => {
  const pageSize = 10
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [users, setUsers] = useState<AdminUserListItem[]>([])
  const [selectedUser, setSelectedUser] = useState<AdminUserListItem | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const loadUsers = async (targetPage = page) => {
    try {
      setIsLoading(true)
      const response = await getAdminUsersApi({
        page: targetPage,
        limit: pageSize,
        search: search.trim() || undefined,
        active: statusFilter === 'all' ? undefined : statusFilter === 'active',
        excludeAdmins: true
      })

      setPage(response.page)
      setTotalPages(Math.max(1, response.totalPages))
      setUsers(response.users)
      setTotal(response.total)
      setError(null)

      setSelectedUser((current) => {
        if (!current) return null
        return response.users.find((item) => item.id === current.id) || null
      })
    } catch {
      setError('Không thể tải danh sách người dùng.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadUsers(page)
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
    return `Hiển thị ${fromRecord}-${toRecord} trên ${total} người dùng`
  }, [isLoading, error, fromRecord, toRecord, total])

  const handleToggleStatus = async (user: AdminUserListItem) => {
    try {
      setIsUpdating(user.id)
      await toggleAdminUserStatusApi(user.id, !user.isActive)
      await loadUsers(page)
    } finally {
      setIsUpdating(null)
    }
  }

  return (
    <AdminShell
      title='Quản lý người dùng'
      subtitle='Xem danh sách tài khoản, kiểm soát trạng thái hoạt động và kiểm tra hồ sơ chi tiết.'
    >
      <section className='space-y-5'>
        <Card className='border-slate-200/80 bg-white/90 py-0 shadow-[0_18px_60px_rgba(15,23,42,0.06)] dark:border-white/8 dark:bg-[#121423]/88'>
          <CardContent className='p-5 sm:p-6'>
            <div className='flex flex-wrap items-center gap-3'>
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder='Tìm theo tên, email hoặc số điện thoại...'
                className='h-10 max-w-md border-slate-200 bg-white dark:border-white/10 dark:bg-white/5'
              />
              <Button
                variant='outline'
                className='h-10'
                onClick={() => {
                  setPage(1)
                  void loadUsers(1)
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
              <table className='w-full min-w-190 border-separate border-spacing-0'>
                <thead>
                  <tr className='text-left text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400'>
                    <th className='border-b border-slate-200 pb-3 dark:border-white/10'>Người dùng</th>
                    <th className='border-b border-slate-200 pb-3 dark:border-white/10'>Vai trò</th>
                    <th className='border-b border-slate-200 pb-3 dark:border-white/10'>Trạng thái</th>
                    <th className='border-b border-slate-200 pb-3 dark:border-white/10'>Ngày tạo</th>
                    <th className='border-b border-slate-200 pb-3 text-right dark:border-white/10'>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className='border-b border-slate-200/80 py-3 dark:border-white/10'>
                        <p className='text-sm font-bold text-slate-950 dark:text-white'>
                          {user.fullName || 'Chưa cập nhật tên'}
                        </p>
                        <p className='text-xs text-slate-500 dark:text-slate-400'>{user.email}</p>
                      </td>
                      <td className='border-b border-slate-200/80 py-3 text-sm font-semibold text-slate-700 dark:border-white/10 dark:text-slate-200'>
                        {roleLabel(user.role)}
                      </td>
                      <td className='border-b border-slate-200/80 py-3 dark:border-white/10'>
                        <span
                          className={cn(
                            'inline-flex rounded-full px-2.5 py-1 text-xs font-bold',
                            user.isActive
                              ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                              : 'bg-rose-500/15 text-rose-700 dark:text-rose-300'
                          )}
                        >
                          {user.isActive ? 'Active' : 'Banned'}
                        </span>
                      </td>
                      <td className='border-b border-slate-200/80 py-3 text-sm text-slate-600 dark:border-white/10 dark:text-slate-300'>
                        {formatDate(user.registrationDate)}
                      </td>
                      <td className='border-b border-slate-200/80 py-3 text-right dark:border-white/10'>
                        <div className='flex justify-end gap-2'>
                          <Button variant='outline' size='sm' onClick={() => setSelectedUser(user)}>
                            <Eye className='size-4' /> Chi tiết
                          </Button>
                          <Button
                            size='sm'
                            variant={user.isActive ? 'destructive' : 'default'}
                            disabled={isUpdating === user.id}
                            onClick={() => void handleToggleStatus(user)}
                          >
                            {user.isActive ? <ShieldBan className='size-4' /> : <ShieldCheck className='size-4' />}
                            {user.isActive ? 'Ban' : 'Active'}
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

        <AdminDetailModal
          open={Boolean(selectedUser)}
          title={selectedUser ? selectedUser.fullName || selectedUser.email : ''}
          onClose={() => setSelectedUser(null)}
        >
          {selectedUser ? (
            <>
              <div className='rounded-2xl border border-white/10 bg-white/4 p-4'>
                <p className='text-sm text-slate-400'>Họ tên</p>
                <p className='text-base font-bold text-white'>{selectedUser.fullName || 'Chưa cập nhật'}</p>
                <p className='mt-1 text-sm text-slate-300'>{selectedUser.email}</p>
              </div>

              <dl className='mt-4 space-y-3 text-sm'>
                <div className='flex justify-between gap-4 border-b border-white/10 pb-3'>
                  <dt className='text-slate-400'>Số điện thoại</dt>
                  <dd className='font-semibold text-white'>{selectedUser.phone || 'N/A'}</dd>
                </div>
                <div className='flex justify-between gap-4 border-b border-white/10 pb-3'>
                  <dt className='text-slate-400'>Giới tính</dt>
                  <dd className='font-semibold text-white'>{selectedUser.gender || 'N/A'}</dd>
                </div>
                <div className='flex justify-between gap-4 border-b border-white/10 pb-3'>
                  <dt className='text-slate-400'>Vai trò</dt>
                  <dd className='font-semibold text-white'>{roleLabel(selectedUser.role)}</dd>
                </div>
                <div className='flex justify-between gap-4 border-b border-white/10 pb-3'>
                  <dt className='text-slate-400'>Trạng thái</dt>
                  <dd className='font-semibold text-white'>{selectedUser.isActive ? 'Active' : 'Banned'}</dd>
                </div>
                <div className='flex justify-between gap-4'>
                  <dt className='text-slate-400'>Ngày đăng ký</dt>
                  <dd className='font-semibold text-white'>{formatDate(selectedUser.registrationDate)}</dd>
                </div>
              </dl>

              {selectedUser.employee ? (
                <div className='mt-4 rounded-2xl border border-sky-400/20 bg-sky-500/10 p-4'>
                  <p className='text-xs font-bold uppercase tracking-[0.14em] text-sky-300'>Thông tin nhà tuyển dụng</p>
                  <p className='mt-2 text-sm font-semibold text-white'>Công ty: {selectedUser.employee.company.name}</p>
                  <p className='text-sm text-slate-300'>Vai trò: {selectedUser.employee.role}</p>
                </div>
              ) : null}

              {selectedUser.seeker ? (
                <div className='mt-4 rounded-2xl border border-violet-400/20 bg-violet-500/10 p-4'>
                  <p className='text-xs font-bold uppercase tracking-[0.14em] text-violet-300'>Thông tin ứng viên</p>
                  <p className='mt-2 text-sm text-slate-300'>CV: {selectedUser.seeker.fileCv || 'Chưa có CV'}</p>
                </div>
              ) : null}
            </>
          ) : null}
        </AdminDetailModal>
      </section>
    </AdminShell>
  )
}

export default UsersPage
