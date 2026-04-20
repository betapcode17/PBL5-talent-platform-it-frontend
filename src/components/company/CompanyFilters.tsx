import { useCompanyFilterStore } from '@/store/companyFilterStore'
import { Building2, RotateCcw, Search, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'

const INDUSTRIES = ['Công nghệ thông tin', 'Trí tuệ nhân tạo', 'Fintech', 'Thương mại điện tử', 'Gia công phần mềm']

export const CompanyFilters = () => {
  const { keyword, industry, setFilter } = useCompanyFilterStore()
  const [localKeyword, setLocalKeyword] = useState(keyword)

  useEffect(() => {
    setLocalKeyword(keyword)
  }, [keyword])

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilter({ keyword: localKeyword, page: 1 })
    }, 400)

    return () => clearTimeout(timer)
  }, [localKeyword, setFilter])

  const handleIndustryChange = (value: string) => {
    setFilter({
      industry: industry === value ? '' : value,
      page: 1
    })
  }

  const resetFilters = () => {
    setLocalKeyword('')
    setFilter({
      keyword: '',
      industry: '',
      page: 1
    })
  }

  return (
    <div className='sticky top-24 space-y-4'>
      <div className='rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_18px_56px_rgba(15,23,42,0.06)]'>
        <div className='flex items-start justify-between gap-3'>
          <div>
            <p className='text-xs font-semibold uppercase tracking-[0.24em] text-violet-500'>Company Search</p>
            <h2 className='mt-2 text-lg font-semibold text-slate-950'>Bộ lọc công ty</h2>
            <p className='mt-1 text-sm text-slate-500'>Lọc danh sách công ty theo từ khóa và lĩnh vực hoạt động.</p>
          </div>

          <button
            type='button'
            onClick={resetFilters}
            className='inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700'
          >
            <RotateCcw className='h-3.5 w-3.5' />
            Reset
          </button>
        </div>

        <div className='mt-5 space-y-5'>
          <div className='space-y-2'>
            <label className='text-sm font-semibold text-slate-900'>Từ khóa</label>
            <div className='relative'>
              <Search className='pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
              <input
                className='w-full rounded-2xl border border-slate-200 bg-slate-50/70 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100'
                placeholder='React, AI, Fintech...'
                value={localKeyword}
                onChange={(e) => setLocalKeyword(e.target.value)}
              />
            </div>
          </div>

          <div className='space-y-3'>
            <div className='flex items-center gap-2'>
              <Building2 className='h-4 w-4 text-violet-500' />
              <h3 className='text-sm font-semibold text-slate-900'>Ngành nghề</h3>
            </div>

            <div className='space-y-2'>
              {INDUSTRIES.map((item) => {
                const active = industry === item

                return (
                  <label
                    key={item}
                    htmlFor={`industry-${item}`}
                    className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-3 py-3 text-sm transition ${
                      active
                        ? 'border-violet-200 bg-violet-50 text-violet-900'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      id={`industry-${item}`}
                      type='checkbox'
                      checked={active}
                      onChange={() => handleIndustryChange(item)}
                      className='h-4 w-4 accent-violet-600'
                    />
                    <span className='flex-1'>{item}</span>
                    {active ? <Sparkles className='h-4 w-4 text-violet-500' /> : null}
                  </label>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
