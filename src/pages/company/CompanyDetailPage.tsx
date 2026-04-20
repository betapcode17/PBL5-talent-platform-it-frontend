import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getCompanyByIdApi } from '@/api/company'
import { CompanyContact } from '@/components/company/detail/CompanyContact'
import { CompanyGallery } from '@/components/company/detail/CompanyGallery'
import { CompanyHeader } from '@/components/company/detail/CompanyHeader'
import { CompanyInfo } from '@/components/company/detail/CompanyInfo'
import { CompanyJobs } from '@/components/company/detail/CompanyJobs'
import { CompanyOverview } from '@/components/company/detail/CompanyOverview'

export default function CompanyDetailPage() {
  const { id } = useParams()

  const { data, isLoading } = useQuery({
    queryKey: ['company', id],
    queryFn: () => getCompanyByIdApi(Number(id)),
    enabled: !!id
  })

  const company = data?.company

  if (isLoading) {
    return (
      <div className='min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(139,92,246,0.14),_transparent_32%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] px-4 py-10'>
        <div className='mx-auto max-w-7xl animate-pulse space-y-6'>
          <div className='h-[360px] rounded-[34px] bg-slate-200' />
          <div className='grid gap-6 lg:grid-cols-3'>
            <div className='space-y-6 lg:col-span-2'>
              <div className='h-72 rounded-[28px] bg-slate-200' />
              <div className='h-72 rounded-[28px] bg-slate-200' />
            </div>
            <div className='space-y-6'>
              <div className='h-64 rounded-[28px] bg-slate-200' />
              <div className='h-56 rounded-[28px] bg-slate-200' />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!company) {
    return <div className='p-10 text-center text-slate-500'>Không tìm thấy công ty.</div>
  }

  return (
    <div className='min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(139,92,246,0.14),_transparent_32%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] pb-10'>
      <div className='mx-auto max-w-7xl space-y-6'>
        <CompanyHeader company={company} />

        <div className='grid grid-cols-1 gap-6 px-4 lg:grid-cols-3'>
          <div className='space-y-6 lg:col-span-2'>
            <CompanyOverview company={company} />
            <CompanyGallery company={company} />
            <CompanyJobs companyId={company.company_id} />
          </div>

          <div className='space-y-6'>
            <CompanyInfo company={company} />
            <CompanyContact company={company} />
          </div>
        </div>
      </div>
    </div>
  )
}
