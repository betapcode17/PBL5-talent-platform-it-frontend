import { useEffect, useState, type ComponentType, type FormEvent, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Briefcase,
  Building2,
  Edit3,
  Globe,
  ImageUp,
  Mail,
  MapPin,
  Save,
  TrendingUp,
  Upload,
  Users,
  X
} from 'lucide-react'

import type { CompanyDetail, UpdateCompanyRequest } from '@/@types/company'
import { getCompanyByIdApi, updateCompanyApi, uploadCompanyCoverApi, uploadCompanyLogoApi } from '@/api/company'
import EmployerPageHeader from '@/components/employer/EmployerPageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/store/authStore'

type CompanyFormState = {
  company_name: string
  profile_description: string
  company_type: string
  company_industry: string
  company_size: string
  country: string
  city: string
  working_days: string
  working_time: string
  overtime_policy: string
  company_website_url: string
  company_email: string
  company_image: string
  cover_image: string
  key_skills: string
  why_love_working_here: string
}

const emptyCompanyForm: CompanyFormState = {
  company_name: '',
  profile_description: '',
  company_type: '',
  company_industry: '',
  company_size: '',
  country: '',
  city: '',
  working_days: '',
  working_time: '',
  overtime_policy: '',
  company_website_url: '',
  company_email: '',
  company_image: '',
  cover_image: '',
  key_skills: '',
  why_love_working_here: ''
}

const optionalValue = (value: string) => {
  const trimmed = value.trim()
  return trimmed ? trimmed : null
}

const toCompanyForm = (company: CompanyDetail): CompanyFormState => ({
  company_name: company.company_name ?? '',
  profile_description: company.profile_description ?? '',
  company_type: company.company_type ?? '',
  company_industry: company.company_industry ?? '',
  company_size: company.company_size ?? '',
  country: company.country ?? '',
  city: company.city ?? '',
  working_days: company.working_days ?? '',
  working_time: company.working_time ?? '',
  overtime_policy: company.overtime_policy ?? '',
  company_website_url: company.company_website_url ?? '',
  company_email: company.company_email ?? '',
  company_image: company.company_image ?? '',
  cover_image: company.cover_image ?? '',
  key_skills: company.key_skills ?? '',
  why_love_working_here: company.why_love_working_here ?? ''
})

const buildUpdatePayload = (form: CompanyFormState): UpdateCompanyRequest => ({
  company_name: form.company_name.trim(),
  profile_description: optionalValue(form.profile_description),
  company_type: optionalValue(form.company_type),
  company_industry: optionalValue(form.company_industry),
  company_size: optionalValue(form.company_size),
  country: optionalValue(form.country),
  city: optionalValue(form.city),
  working_days: optionalValue(form.working_days),
  working_time: optionalValue(form.working_time),
  overtime_policy: optionalValue(form.overtime_policy),
  company_website_url: optionalValue(form.company_website_url),
  company_email: optionalValue(form.company_email),
  company_image: optionalValue(form.company_image),
  cover_image: optionalValue(form.cover_image),
  key_skills: optionalValue(form.key_skills),
  why_love_working_here: optionalValue(form.why_love_working_here)
})

const EmployerCompanyInfoPage = () => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { user } = useAuthStore()
  const companyId = user?.employee?.company?.company_id
  const [isEditing, setIsEditing] = useState(false)
  const [form, setForm] = useState<CompanyFormState>(emptyCompanyForm)
  const [message, setMessage] = useState<string | null>(null)
  const [uploadingField, setUploadingField] = useState<'company_image' | 'cover_image' | null>(null)

  const { data, isLoading, error } = useQuery({
    queryKey: ['company', companyId],
    queryFn: () => getCompanyByIdApi(companyId!),
    enabled: !!companyId
  })

  const company = data?.company

  useEffect(() => {
    if (company) {
      setForm(toCompanyForm(company))
    }
  }, [company])

  const updateMutation = useMutation({
    mutationFn: (payload: UpdateCompanyRequest) => updateCompanyApi(companyId!, payload),
    onSuccess: async () => {
      setIsEditing(false)
      setMessage('Cập nhật thông tin công ty thành công.')
      await queryClient.invalidateQueries({ queryKey: ['company', companyId] })
    },
    onError: (mutationError) => {
      const apiMessage =
        mutationError && typeof mutationError === 'object' && 'response' in mutationError
          ? (mutationError as { response?: { data?: { message?: string } } }).response?.data?.message
          : null
      setMessage(apiMessage || 'Không thể cập nhật thông tin công ty lúc này.')
    }
  })

  const updateFormValue = (key: keyof CompanyFormState, value: string) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const cancelEdit = () => {
    if (company) {
      setForm(toCompanyForm(company))
    }
    setMessage(null)
    setIsEditing(false)
  }

  const submitCompanyForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage(null)

    if (!form.company_name.trim()) {
      setMessage('Tên công ty không được để trống.')
      return
    }

    updateMutation.mutate(buildUpdatePayload(form))
  }

  const handleImageUpload = async (field: 'company_image' | 'cover_image', file?: File | null) => {
    if (!companyId || !file) return

    try {
      setUploadingField(field)
      setMessage(null)

      const response =
        field === 'company_image'
          ? await uploadCompanyLogoApi(companyId, file)
          : await uploadCompanyCoverApi(companyId, file)

      updateFormValue(field, response.imageUrl)
      setMessage(field === 'company_image' ? 'Tải logo công ty thành công.' : 'Tải ảnh bìa công ty thành công.')
      await queryClient.invalidateQueries({ queryKey: ['company', companyId] })
    } catch (uploadError) {
      const apiMessage =
        uploadError && typeof uploadError === 'object' && 'response' in uploadError
          ? (uploadError as { response?: { data?: { message?: string } } }).response?.data?.message
          : null
      setMessage(apiMessage || 'Không thể tải ảnh lên lúc này.')
    } finally {
      setUploadingField(null)
    }
  }

  if (isLoading) {
    return (
      <div className='min-w-0 space-y-6'>
        <EmployerPageHeader
          eyebrow={t('employer.company.eyebrow')}
          title={t('employer.company.title')}
          description={t('employer.company.noCompanyDescription')}
        />
        <div className='animate-pulse space-y-6'>
          <div className='h-48 rounded-3xl bg-slate-200 dark:bg-slate-800' />
          <div className='grid gap-6 lg:grid-cols-3'>
            {[1, 2, 3].map((item) => (
              <div key={item} className='h-32 rounded-2xl bg-slate-200 dark:bg-slate-800' />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error || !company) {
    return (
      <div className='min-w-0 space-y-6'>
        <EmployerPageHeader
          eyebrow={t('employer.company.eyebrow')}
          title={t('employer.company.title')}
          description={t('employer.company.noCompanyDescription')}
        />
        <div className='rounded-3xl border-2 border-dashed border-red-200 bg-red-50 p-12 text-center dark:border-red-900/30 dark:bg-red-950/20'>
          <div className='mx-auto mb-4 inline-flex h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/30'>
            <Building2 className='m-auto h-8 w-8 text-red-500 dark:text-red-400' />
          </div>
          <p className='text-lg font-semibold text-red-600 dark:text-red-400'>
            {error ? t('employer.overview.failedTitle') : t('employer.company.noCompany')}
          </p>
          <p className='mt-2 text-sm text-red-500 dark:text-red-300'>
            {error ? 'Please try refreshing the page' : 'No company data available'}
          </p>
        </div>
      </div>
    )
  }

  const infoItems = [
    { label: t('employer.company.industry'), value: company.company_industry, icon: Briefcase },
    { label: t('employer.company.size'), value: company.company_size, icon: Users },
    {
      label: t('employer.company.location'),
      value: [company.city, company.country].filter(Boolean).join(', '),
      icon: MapPin
    },
    { label: t('employer.company.email'), value: company.company_email, icon: Mail }
  ]

  return (
    <div className='min-w-0 space-y-8'>
      <EmployerPageHeader
        eyebrow={t('employer.company.eyebrow')}
        title={t('employer.company.title')}
        description='HR thuộc công ty này có thể cập nhật hồ sơ công ty hiển thị cho ứng viên.'
      />

      <section className='flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700/50 dark:bg-slate-900/30 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <p className='text-sm font-semibold uppercase tracking-[0.14em] text-violet-600'>Company profile</p>
          <h2 className='mt-1 text-xl font-bold text-slate-950 dark:text-white'>Quản lý thông tin công ty</h2>
          <p className='mt-1 text-sm text-slate-500 dark:text-slate-400'>
            Chỉnh sửa tên, mô tả, liên hệ, địa điểm và các thông tin tuyển dụng.
          </p>
        </div>
        <Button
          type='button'
          variant={isEditing ? 'outline' : 'default'}
          className='rounded-lg'
          onClick={() => {
            setMessage(null)
            setIsEditing((current) => !current)
          }}
        >
          {isEditing ? <X className='h-4 w-4' /> : <Edit3 className='h-4 w-4' />}
          {isEditing ? 'Đóng chỉnh sửa' : 'Chỉnh sửa'}
        </Button>
      </section>

      {isEditing ? (
        <form
          onSubmit={submitCompanyForm}
          className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700/50 dark:bg-slate-900/30'
        >
          <div className='grid gap-4 md:grid-cols-2'>
            <CompanyInput
              label='Tên công ty *'
              value={form.company_name}
              onChange={(value) => updateFormValue('company_name', value)}
            />
            <CompanyInput
              label='Email công ty'
              type='email'
              value={form.company_email}
              onChange={(value) => updateFormValue('company_email', value)}
            />
            <CompanyInput
              label='Ngành'
              value={form.company_industry}
              onChange={(value) => updateFormValue('company_industry', value)}
            />
            <CompanyInput
              label='Quy mô'
              value={form.company_size}
              onChange={(value) => updateFormValue('company_size', value)}
            />
            <CompanyInput
              label='Loại công ty'
              value={form.company_type}
              onChange={(value) => updateFormValue('company_type', value)}
            />
            <CompanyInput
              label='Website'
              value={form.company_website_url}
              onChange={(value) => updateFormValue('company_website_url', value)}
            />
            <CompanyInput label='Thành phố' value={form.city} onChange={(value) => updateFormValue('city', value)} />
            <CompanyInput
              label='Quốc gia'
              value={form.country}
              onChange={(value) => updateFormValue('country', value)}
            />
            <CompanyInput
              label='Ngày làm việc'
              value={form.working_days}
              onChange={(value) => updateFormValue('working_days', value)}
            />
            <CompanyInput
              label='Giờ làm việc'
              value={form.working_time}
              onChange={(value) => updateFormValue('working_time', value)}
            />
            <CompanyFileUpload
              label='Logo công ty'
              value={form.company_image}
              uploading={uploadingField === 'company_image'}
              onFileChange={(file) => void handleImageUpload('company_image', file)}
            />
            <CompanyFileUpload
              label='Ảnh bìa công ty'
              value={form.cover_image}
              uploading={uploadingField === 'cover_image'}
              onFileChange={(file) => void handleImageUpload('cover_image', file)}
            />
            <CompanyTextarea
              label='Mô tả công ty'
              value={form.profile_description}
              onChange={(value) => updateFormValue('profile_description', value)}
              rows={4}
            />
            <CompanyTextarea
              label='Kỹ năng chính'
              value={form.key_skills}
              onChange={(value) => updateFormValue('key_skills', value)}
              rows={3}
            />
            <CompanyTextarea
              label='Lý do yêu thích môi trường này'
              value={form.why_love_working_here}
              onChange={(value) => updateFormValue('why_love_working_here', value)}
              rows={3}
            />
            <CompanyTextarea
              label='Chính sách OT'
              value={form.overtime_policy}
              onChange={(value) => updateFormValue('overtime_policy', value)}
              rows={3}
            />
          </div>

          {message ? (
            <p className='mt-4 rounded-lg bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 dark:bg-white/5 dark:text-slate-200'>
              {message}
            </p>
          ) : null}

          <div className='mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end'>
            <Button type='button' variant='outline' className='rounded-lg' onClick={cancelEdit}>
              Hủy
            </Button>
            <Button type='submit' className='rounded-lg' disabled={updateMutation.isPending}>
              <Save className='h-4 w-4' />
              {updateMutation.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </div>
        </form>
      ) : null}

      {message && !isEditing ? (
        <p className='rounded-lg bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700'>{message}</p>
      ) : null}

      <section
        className='relative overflow-hidden rounded-3xl bg-slate-950 p-8 shadow-2xl lg:p-12'
        style={
          company.cover_image
            ? {
                backgroundImage: `linear-gradient(90deg, rgba(15, 23, 42, 0.88), rgba(88, 28, 135, 0.72)), url(${company.cover_image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }
            : undefined
        }
      >
        <div className='relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between'>
          <div className='flex min-w-0 gap-5'>
            {company.company_image ? (
              <img
                src={company.company_image}
                alt={company.company_name}
                className='h-20 w-20 rounded-2xl border border-white/20 object-cover'
              />
            ) : (
              <div className='flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 text-2xl font-bold text-white'>
                {company.company_name.charAt(0)}
              </div>
            )}
            <div className='min-w-0'>
              <h1 className='break-words text-4xl font-bold text-white lg:text-5xl'>{company.company_name}</h1>
              <p className='mt-3 max-w-3xl text-lg text-violet-100'>
                {company.profile_description || 'Welcome to our company'}
              </p>
              <div className='mt-6 flex flex-wrap gap-2'>
                {[company.company_industry, company.company_size, company.company_type].filter(Boolean).map((item) => (
                  <span
                    key={item}
                    className='rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm'
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        {infoItems.map((info) => {
          const Icon = info.icon
          return (
            <article
              key={info.label}
              className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700/50 dark:bg-slate-900/30'
            >
              <div className='mb-3 inline-flex rounded-xl bg-violet-100 p-3 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300'>
                <Icon className='h-5 w-5' />
              </div>
              <p className='text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400'>
                {info.label}
              </p>
              <p className='mt-2 break-words text-sm font-bold text-slate-900 dark:text-white'>
                {info.value || t('employer.company.notSpecified')}
              </p>
            </article>
          )
        })}
      </section>

      <section className='grid gap-8 lg:grid-cols-3'>
        <div className='space-y-6 lg:col-span-2'>
          <CompanyPanel title={t('employer.company.about')} icon={Briefcase}>
            <p className='whitespace-pre-wrap leading-relaxed text-slate-600 dark:text-slate-300'>
              {company.profile_description || t('employer.company.noDescription')}
            </p>
          </CompanyPanel>

          {(company.key_skills || company.why_love_working_here || company.overtime_policy) && (
            <CompanyPanel title='Thông tin tuyển dụng' icon={TrendingUp}>
              <div className='space-y-4 text-sm text-slate-600 dark:text-slate-300'>
                {company.key_skills ? <InfoBlock label='Kỹ năng chính' value={company.key_skills} /> : null}
                {company.why_love_working_here ? (
                  <InfoBlock label='Vì sao yêu thích môi trường này' value={company.why_love_working_here} />
                ) : null}
                {company.overtime_policy ? <InfoBlock label='Chính sách OT' value={company.overtime_policy} /> : null}
              </div>
            </CompanyPanel>
          )}
        </div>

        <aside className='space-y-6'>
          <CompanyStat
            icon={Users}
            label={t('employer.company.staffCount')}
            value={company.company_size || t('employer.company.notSpecified')}
          />
          <CompanyStat
            icon={TrendingUp}
            label={t('employer.company.industry')}
            value={company.company_industry || t('employer.company.notSpecified')}
          />
          {company.company_website_url ? (
            <CompanyStat
              icon={Globe}
              label={t('employer.company.website')}
              value={company.company_website_url}
              href={company.company_website_url}
            />
          ) : null}
        </aside>
      </section>

      {(company.company_email || company.city || company.country || company.working_days || company.working_time) && (
        <CompanyPanel title='Contact Information' icon={Mail}>
          <div className='grid gap-5 sm:grid-cols-2'>
            {company.company_email ? (
              <ContactItem
                icon={Mail}
                label='Email'
                value={company.company_email}
                href={`mailto:${company.company_email}`}
              />
            ) : null}
            {[company.city, company.country].filter(Boolean).length > 0 ? (
              <ContactItem
                icon={MapPin}
                label='Location'
                value={[company.city, company.country].filter(Boolean).join(', ')}
              />
            ) : null}
            {company.working_days ? (
              <ContactItem icon={Briefcase} label='Ngày làm việc' value={company.working_days} />
            ) : null}
            {company.working_time ? (
              <ContactItem icon={Users} label='Giờ làm việc' value={company.working_time} />
            ) : null}
          </div>
        </CompanyPanel>
      )}
    </div>
  )
}

type CompanyInputProps = {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
}

const CompanyInput = ({ label, value, onChange, type = 'text' }: CompanyInputProps) => (
  <label className='space-y-2'>
    <span className='text-sm font-semibold text-slate-700 dark:text-slate-200'>{label}</span>
    <Input type={type} value={value} onChange={(event) => onChange(event.target.value)} />
  </label>
)

type CompanyTextareaProps = {
  label: string
  value: string
  onChange: (value: string) => void
  rows: number
}

const CompanyTextarea = ({ label, value, onChange, rows }: CompanyTextareaProps) => (
  <label className='space-y-2 md:col-span-2'>
    <span className='text-sm font-semibold text-slate-700 dark:text-slate-200'>{label}</span>
    <textarea
      value={value}
      rows={rows}
      onChange={(event) => onChange(event.target.value)}
      className='w-full rounded-lg border border-slate-200 bg-transparent px-3 py-2 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-slate-700 dark:text-white'
    />
  </label>
)

type CompanyFileUploadProps = {
  label: string
  value: string
  uploading: boolean
  onFileChange: (file?: File | null) => void
}

const CompanyFileUpload = ({ label, value, uploading, onFileChange }: CompanyFileUploadProps) => (
  <label className='space-y-2 md:col-span-2'>
    <span className='text-sm font-semibold text-slate-700 dark:text-slate-200'>{label}</span>
    <div className='rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-4 dark:border-slate-700 dark:bg-slate-900/20'>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div className='min-w-0'>
          <p className='flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200'>
            <ImageUp className='h-4 w-4 text-violet-500' />
            Chọn ảnh từ máy tính
          </p>
          <p className='mt-1 break-all text-xs text-slate-500 dark:text-slate-400'>
            {value || 'Chưa có ảnh nào được tải lên.'}
          </p>
        </div>
        <label className='inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700'>
          <Upload className='h-4 w-4' />
          {uploading ? 'Đang tải...' : 'Tải ảnh lên'}
          <input
            type='file'
            accept='image/png,image/jpeg,image/jpg,image/webp'
            className='hidden'
            disabled={uploading}
            onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
          />
        </label>
      </div>
    </div>
  </label>
)

type IconComponent = ComponentType<{ className?: string }>

const CompanyPanel = ({ title, icon: Icon, children }: { title: string; icon: IconComponent; children: ReactNode }) => (
  <section className='overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700/50 dark:bg-slate-900/30'>
    <div className='border-b border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-700/50 dark:bg-white/5'>
      <div className='flex items-center gap-3'>
        <div className='rounded-lg bg-violet-100 p-2 dark:bg-violet-900/30'>
          <Icon className='h-5 w-5 text-violet-600 dark:text-violet-400' />
        </div>
        <h2 className='text-lg font-bold text-slate-900 dark:text-white'>{title}</h2>
      </div>
    </div>
    <div className='px-6 py-5'>{children}</div>
  </section>
)

const CompanyStat = ({
  icon: Icon,
  label,
  value,
  href
}: {
  icon: IconComponent
  label: string
  value: string
  href?: string
}) => (
  <article className='overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700/50 dark:bg-slate-900/30'>
    <div className='bg-violet-600 px-6 py-4'>
      <div className='flex items-center gap-2'>
        <Icon className='h-5 w-5 text-white' />
        <p className='text-sm font-semibold uppercase tracking-widest text-white/80'>{label}</p>
      </div>
    </div>
    <div className='px-6 py-5'>
      {href ? (
        <a
          href={href}
          target='_blank'
          rel='noopener noreferrer'
          className='break-all text-sm font-semibold text-violet-700 hover:text-violet-800 dark:text-violet-300'
        >
          {value}
        </a>
      ) : (
        <p className='break-words text-lg font-bold text-slate-900 dark:text-white'>{value}</p>
      )}
    </div>
  </article>
)

const InfoBlock = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className='font-semibold text-slate-900 dark:text-white'>{label}</p>
    <p className='mt-1 whitespace-pre-wrap'>{value}</p>
  </div>
)

const ContactItem = ({
  icon: Icon,
  label,
  value,
  href
}: {
  icon: IconComponent
  label: string
  value: string
  href?: string
}) => (
  <div className='flex gap-4'>
    <div className='rounded-lg bg-violet-100 p-3 dark:bg-violet-900/30'>
      <Icon className='h-5 w-5 text-violet-600 dark:text-violet-400' />
    </div>
    <div className='min-w-0'>
      <p className='text-xs font-semibold uppercase text-slate-500 dark:text-slate-400'>{label}</p>
      {href ? (
        <a
          href={href}
          className='mt-1 block break-all text-sm font-medium text-violet-700 hover:text-violet-800 dark:text-violet-300'
        >
          {value}
        </a>
      ) : (
        <p className='mt-1 break-words text-sm font-medium text-slate-900 dark:text-white'>{value}</p>
      )}
    </div>
  </div>
)

export default EmployerCompanyInfoPage
