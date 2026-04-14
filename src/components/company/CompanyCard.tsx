import type { Company } from '@/@types/company'
import { Card } from '@/components/ui/card'
import { useFollow } from '@/hooks/useFollow'
import { Link, useNavigate } from 'react-router-dom'

type Props = {
  company: Company
}

export const CompanyCard = ({ company }: Props) => {
  const navigate = useNavigate()
  const { followerCount } = useFollow(company.company_id)

  return (
    <Card
      onClick={() => navigate(`/companies/${company.company_id}`)}
      className='p-5 flex flex-row gap-4 border hover:border-primary hover:shadow-md transition group cursor-pointer'
    >
      {/* COT 1: Logo */}
      <div className='w-36 h-36 shrink-0 rounded-xl overflow-hidden border bg-gray-50'>
        <img src={company.company_image} alt={company.company_name} className='object-cover w-full h-full' />
      </div>

      {/* COT 2: Noi dung van ban */}
      <div className='flex flex-col flex-1 w-full'>
        {/* Name */}
        <h3 className='text-lg font-bold group-hover:text-primary'>{company.company_name}</h3>

        {/* Info */}
        <p className='text-sm text-gray-500 mb-3'>
          {company.company_industry} • {company.city}
        </p>

        {/* Skills */}
        <div className='flex flex-wrap gap-2 mb-4'>
          {company.key_skills
            ?.split(',')
            .slice(0, 3)
            .map((skill, i) => (
              <span key={i} className='px-2 py-1 bg-gray-100 text-xs rounded'>
                {skill.trim()}
              </span>
            ))}
        </div>

        {/* Footer */}
        <div className='flex justify-between items-center mt-auto'>
          <span className='text-sm text-gray-600'>{company.company_size}</span>

          <div className='flex flex-col items-end gap-2'>
            <span className='text-sm text-gray-500'>{followerCount} người Follows</span>

            <Link
              to={`/companies/${company.company_id}`}
              onClick={(e) => e.stopPropagation()}
              className='bg-primary text-white px-4 py-2 rounded-lg text-sm'
            >
              Xem công ty
            </Link>
          </div>
        </div>
      </div>
    </Card>
  )
}
