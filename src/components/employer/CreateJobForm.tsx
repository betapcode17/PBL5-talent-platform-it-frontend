import { useEffect, useMemo, useState } from 'react'
import { Plus, Save, BriefcaseBusiness } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import {
  createEmployerJobApi,
  getEmployerCategoryOptionsApi,
  getEmployerJobTypeOptionsApi,
  getEmployerProfileApi,
  updateEmployerJobApi
} from '@/api/employer'
import type { EmployerJobItem } from '@/@types/employer'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

interface CreateJobFormProps {
  onClose?: () => void
  mode?: 'create' | 'edit'
  initialJob?: EmployerJobItem | null
}

type Option = {
  id: number
  name: string
}

const getApiErrorMessage = (error: unknown) => {
  if (!error || typeof error !== 'object' || !('response' in error)) {
    return null
  }

  const data = (error as { response?: { data?: { message?: string | string[] } } }).response?.data
  const message = data?.message

  if (Array.isArray(message)) {
    return message.join(', ')
  }

  return typeof message === 'string' ? message : null
}

const parseSalary = (value: string) => {
  const numbers = value.match(/\d+/g)?.map(Number) ?? []
  const min = numbers[0] ?? 0
  const max = numbers[1] ?? min

  return {
    min: Math.min(min, max),
    max: Math.max(min, max)
  }
}

const extractDescriptionContent = (value: string | null | undefined) =>
  (value ?? '')
    .split('\n')
    .filter((line) => !/^\s*(địa điểm|location)\s*:/i.test(line.trim()))
    .join('\n')
    .trim()

const extractLocationFromDescription = (value: string | null | undefined) => {
  const locationLine = (value ?? '')
    .split('\n')
    .find((line) => /^\s*(địa điểm|location)\s*:/i.test(line.trim()))

  return locationLine ? locationLine.replace(/^\s*(địa điểm|location)\s*:/i, '').trim() : ''
}

const CreateJobForm = ({ onClose, mode = 'create', initialJob = null }: CreateJobFormProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [companyId, setCompanyId] = useState<number | null>(null)
  const [categories, setCategories] = useState<Option[]>([])
  const [jobTypes, setJobTypes] = useState<Option[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    title: '',
    description: '',
    categoryId: '',
    jobTypeId: '',
    workLocation: '',
    salary: '',
    requirements: ''
  })
  const isEditMode = mode === 'edit'
  const [isActive, setIsActive] = useState<boolean>(initialJob?.isActive ?? true)
  const initialCategoryId = useMemo(() => String(initialJob?.category?.category_id ?? ''), [initialJob?.category?.category_id])
  const initialJobTypeId = useMemo(() => String(initialJob?.jobType?.job_type_id ?? ''), [initialJob?.jobType?.job_type_id])

  useEffect(() => {
    let isMounted = true

    const loadOptions = async () => {
      try {
        const [profile, categoryOptions, jobTypeOptions] = await Promise.all([
          getEmployerProfileApi(),
          getEmployerCategoryOptionsApi(),
          getEmployerJobTypeOptionsApi()
        ])

        if (!isMounted) return

        setCompanyId(profile.company.company_id)
        setCategories(categoryOptions)
        setJobTypes(jobTypeOptions)
        setForm((current) => ({
          ...current,
          title: current.title || initialJob?.title || '',
          description: current.description || extractDescriptionContent(initialJob?.description) || '',
          workLocation: current.workLocation || initialJob?.workLocation || extractLocationFromDescription(initialJob?.description) || '',
          salary: current.salary || initialJob?.salary || '',
          requirements:
            current.requirements ||
            (Array.isArray(initialJob?.requirements) ? initialJob.requirements.join('\n') : initialJob?.requirements) ||
            '',
          categoryId: current.categoryId || initialCategoryId || String(categoryOptions[0]?.id ?? ''),
          jobTypeId: current.jobTypeId || initialJobTypeId || String(jobTypeOptions[0]?.id ?? ''),
        }))
      } catch {
        if (isMounted) {
          setError(t('employer.jobs.create.loadError'))
        }
      }
    }

    void loadOptions()

    return () => {
      isMounted = false
    }
  }, [initialCategoryId, initialJob?.description, initialJob?.requirements, initialJob?.salary, initialJob?.title, initialJob?.workLocation, initialJobTypeId, t])

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    if (!companyId || !form.title || !form.description || !form.categoryId || !form.jobTypeId || !form.salary) {
      setError(t('employer.jobs.create.requiredError'))
      return
    }

    const salaryRange = parseSalary(form.salary)
    const requirements = form.requirements
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean)

    setIsSubmitting(true)

    try {
      const payload = {
        title: form.title,
        description: [form.description, form.workLocation ? `${t('employer.jobs.table.location')}: ${form.workLocation}` : null].filter(Boolean).join('\n\n'),
        categoryId: Number(form.categoryId),
        jobTypeId: Number(form.jobTypeId),
        salaryRange,
        requirements: requirements.length > 0 ? requirements : [t('employer.jobs.create.fallbackRequirement')]
      }

      if (isEditMode && initialJob) {
        await updateEmployerJobApi(initialJob.id, { ...payload, isActive })
      } else {
        await createEmployerJobApi({
          ...payload,
          companyId
        })
      }

      onClose?.()
      navigate('/employer/jobs')
    } catch (submitError) {
      const message = getApiErrorMessage(submitError)
      setError(message || t('employer.jobs.create.submitError'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className='min-w-0 space-y-4'>
      <FieldGroup className='gap-4'>
        {error ? <p className='break-words rounded-lg border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-400/20 dark:bg-rose-500/10 dark:text-rose-200'>{error}</p> : null}

        <Field>
          <FieldLabel>{t('employer.jobs.create.labels.positionTitle')}</FieldLabel>
          <Input
            value={form.title}
            onChange={(event) => handleChange('title', event.target.value)}
            placeholder={t('employer.jobs.create.placeholders.positionTitle')}
            required
          />
        </Field>

        <Field>
          <FieldLabel>{t('employer.jobs.create.labels.description')}</FieldLabel>
          <textarea
            value={form.description}
            onChange={(event) => handleChange('description', event.target.value)}
            rows={4}
            className='border-input min-h-28 w-full min-w-0 rounded-md border bg-white px-3 py-2 text-sm outline-none transition-colors dark:bg-white/5 dark:text-slate-100 dark:placeholder:text-slate-500'
            placeholder={t('employer.jobs.create.placeholders.description')}
            required
          />
        </Field>

        <div className='grid min-w-0 gap-4 md:grid-cols-2'>
          <Field>
            <FieldLabel>{t('employer.jobs.create.labels.category')}</FieldLabel>
            <select
              value={form.categoryId}
              onChange={(event) => handleChange('categoryId', event.target.value)}
              className='border-input h-10 w-full min-w-0 rounded-md border bg-white px-3 text-sm outline-none transition-colors dark:bg-white/5 dark:text-slate-100'
              required
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </Field>
          <Field>
            <FieldLabel>{t('employer.jobs.create.labels.jobType')}</FieldLabel>
            <select
              value={form.jobTypeId}
              onChange={(event) => handleChange('jobTypeId', event.target.value)}
              className='border-input h-10 w-full min-w-0 rounded-md border bg-white px-3 text-sm outline-none transition-colors dark:bg-white/5 dark:text-slate-100'
              required
            >
              {jobTypes.map((jobType) => (
                <option key={jobType.id} value={jobType.id}>
                  {jobType.name}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className='grid min-w-0 gap-4 md:grid-cols-2'>
          <Field>
            <FieldLabel>{t('employer.jobs.create.labels.location')}</FieldLabel>
            <Input
              value={form.workLocation}
              onChange={(event) => handleChange('workLocation', event.target.value)}
              placeholder={t('employer.jobs.create.placeholders.location')}
            />
          </Field>
          <Field>
            <FieldLabel>{t('employer.jobs.create.labels.salary')}</FieldLabel>
            <Input
              value={form.salary}
              onChange={(event) => handleChange('salary', event.target.value)}
              placeholder={t('employer.jobs.create.placeholders.salary')}
              required
            />
          </Field>
        </div>

        <Field>
          <FieldLabel>{t('employer.jobs.create.labels.requirements')}</FieldLabel>
          <textarea
            value={form.requirements}
            onChange={(event) => handleChange('requirements', event.target.value)}
            rows={4}
            className='border-input min-h-28 w-full min-w-0 rounded-md border bg-white px-3 py-2 text-sm outline-none transition-colors dark:bg-white/5 dark:text-slate-100 dark:placeholder:text-slate-500'
            placeholder={t('employer.jobs.create.placeholders.requirements')}
          />
        </Field>

        {isEditMode && (
          <div className='rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50'>
            <div className='flex items-center justify-between gap-4'>
              <div className='flex items-center gap-3'>
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${isActive ? 'bg-emerald-100 dark:bg-emerald-500/20' : 'bg-rose-100 dark:bg-rose-500/20'}`}>
                  <BriefcaseBusiness className={`h-4 w-4 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'}`} />
                </div>
                <div>
                  <p className='text-sm font-medium text-slate-900 dark:text-slate-100'>
                    {t('employer.jobs.edit.statusLabel', { defaultValue: 'Trạng thái tuyển dụng' })}
                  </p>
                  <p className={`text-xs font-medium ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'}`}>
                    {isActive
                      ? t('employer.jobs.edit.statusActive', { defaultValue: '✓ Đang tuyển dụng' })
                      : t('employer.jobs.edit.statusInactive', { defaultValue: '✕ Đã ngừng tuyển' })}
                  </p>
                </div>
              </div>
              <button
                type='button'
                role='switch'
                aria-checked={isActive}
                onClick={() => setIsActive((prev) => !prev)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isActive
                    ? 'bg-emerald-500 focus:ring-emerald-500'
                    : 'bg-rose-400 focus:ring-rose-400'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition-transform duration-200 ease-in-out ${
                    isActive ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            {!isActive && (
              <p className='mt-3 rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-xs text-rose-600 dark:border-rose-400/20 dark:bg-rose-500/10 dark:text-rose-300'>
                {t('employer.jobs.edit.statusWarning', {
                  defaultValue: '⚠️ Khi ngừng tuyển, ứng viên sẽ không thể tìm thấy bài đăng này trên hệ thống.'
                })}
              </p>
            )}
          </div>
        )}

        <div className='flex flex-col gap-3 pt-4 sm:flex-row'>
          <Button type='submit' disabled={isSubmitting} className='w-full flex-1 rounded-xl'>
            {isEditMode ? <Save className='h-4 w-4' /> : <Plus className='h-4 w-4' />}
            {isSubmitting
              ? t('employer.actions.creating')
              : isEditMode
                ? t('employer.jobs.edit.submit', { defaultValue: 'Lưu thay đổi' })
                : t('employer.jobs.create.submit')}
          </Button>
          {onClose && (
            <Button type='button' variant='outline' className='w-full flex-1 rounded-xl' onClick={onClose}>
              {t('employer.actions.cancel')}
            </Button>
          )}
        </div>
      </FieldGroup>
    </form>
  )
}

export default CreateJobForm
