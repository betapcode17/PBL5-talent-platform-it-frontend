import type { Company } from '@/@types/company'
import { Users, Heart } from 'lucide-react'
import { useFollow } from '@/hooks/useFollow'

export const CompanyHeader = ({ company }: { company: Company }) => {
  const { isFollowed, isLoading, toggleFollow } = useFollow(company.company_id)

  return (
    <div className='relative'>
      {/* Cover */}
      <img src={company.cover_image} className='w-full h-64 object-cover' />

      {/* Main Info Container */}
      <div className='max-w-7xl mx-auto px-4 flex justify-between items-end -mt-12 relative z-10'>
        {/* CỘT TRÁI: Logo và Thông tin */}
        <div className='flex items-end gap-4'>
          <img
            src={company.company_image}
            className='w-64 h-full rounded-xl border bg-white object-contain shadow-sm'
            alt={company.company_name}
          />

          <div className='mb-2'>
            {' '}
            {/* Thêm margin-bottom để chữ canh đều đẹp hơn so với đáy logo */}
            <h1 className='text-2xl font-bold'>{company.company_name}</h1>
            <p className='text-gray-500'>
              {company.company_industry} • {company.city}
            </p>
            <div className='mt-2'>
              <div className='flex items-center space-x-2'>
                <div className='p-1.5 bg-gray-100 rounded-md'>
                  <Users className='w-4 h-4 text-gray-600' />
                </div>
                <p className='text-base font-semibold'>{company.company_size} Nhân Viên</p>
              </div>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: Các nút hành động */}
        <div className='flex items-center gap-3 mb-2'>
          <button
            onClick={toggleFollow}
            disabled={isLoading}
            className={`px-10 py-4 font-medium text-base rounded-lg transition-colors shadow-sm ${
              isFollowed
                ? 'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-500'
                : 'bg-purple-600 text-white hover:bg-purple-700 disabled:bg-purple-500'
            }`}
          >
            {isLoading ? 'Đang xử lý...' : isFollowed ? '- Hủy theo dõi' : '+ Theo dõi công ty'}
          </button>

          <button className='p-2.5 border border-gray-300 bg-white rounded-lg hover:bg-gray-50 text-gray-600 transition-colors shadow-sm flex items-center justify-center'>
            <Heart className='w-6 h-6' />
          </button>
        </div>
      </div>
    </div>
  )
}
