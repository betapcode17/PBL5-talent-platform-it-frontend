import { useEffect, useState } from 'react'
import { AdminRecentUsersTable } from '@/components/admin/AdminRecentUsersTable'
import { AdminShell } from '@/components/admin/AdminShell'
import { AdminStatCard } from '@/components/admin/AdminStatCard'
import { AdminStatisticsChart } from '@/components/admin/AdminStatisticsChart'
import { AdminTopIndustriesCard } from '@/components/admin/AdminTopIndustriesCard'
import { AdminUserDistributionCard } from '@/components/admin/AdminUserDistributionCard'
import { getAdminDashboardApi, type AdminDashboardData } from '@/api/admin'

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null)
  const [dashboardError, setDashboardError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadDashboard = async () => {
      try {
        const data = await getAdminDashboardApi()
        if (!isMounted) return
        setDashboardData(data)
        setDashboardError(null)
      } catch {
        if (!isMounted) return
        setDashboardError('Unable to load admin dashboard data from backend.')
      }
    }

    void loadDashboard()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <AdminShell title='Dashboard' subtitle='Theo dõi toàn bộ người dùng, công ty và công việc theo thời gian thực.'>
      {dashboardError ? (
        <div className='rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 dark:border-rose-400/20 dark:bg-rose-500/10 dark:text-rose-200'>
          {dashboardError}
        </div>
      ) : null}

      <section className='grid gap-5 md:grid-cols-2 2xl:grid-cols-4' aria-label='Admin statistics'>
        {(dashboardData?.statCards ?? []).map((stat) => (
          <AdminStatCard key={stat.id} stat={stat} />
        ))}
      </section>

      {dashboardData ? <AdminStatisticsChart data={dashboardData.chartData} /> : null}

      {dashboardData ? (
        <section className='grid min-w-0 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(320px,440px)]'>
          <div className='min-w-0'>
            <AdminRecentUsersTable users={dashboardData.recentUsers} />
          </div>

          <div className='min-w-0 space-y-5'>
            <AdminUserDistributionCard items={dashboardData.userDistribution} />
            <AdminTopIndustriesCard industries={dashboardData.topIndustries} />
          </div>
        </section>
      ) : null}
    </AdminShell>
  )
}

export default Dashboard
