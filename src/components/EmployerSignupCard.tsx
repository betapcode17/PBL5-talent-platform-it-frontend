import React, { useCallback, useEffect, useState } from 'react'
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  Globe,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  UserRound
} from 'lucide-react'
import type { AxiosError } from 'axios'
import { useTranslation } from 'react-i18next'

import { registerEmployerApi } from '@/api/employees'
import { cn } from '@/lib/utils'

type FormState = {
  full_name: string
  email: string
  phone: string
  role: string
  joined_date: string
  company_name: string
  company_address: string
  company_website_url: string
  company_id?: string
}

const initialState: FormState = {
  full_name: '',
  email: '',
  phone: '',
  role: 'HR',
  joined_date: '',
  company_name: '',
  company_address: '',
  company_website_url: '',
  company_id: ''
}

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phoneRe = /^[0-9()+\-\s]{7,20}$/

export default function EmployerSignupCard() {
  const { t } = useTranslation()
  const [form, setForm] = useState<FormState>(initialState)
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitSuccess, setSubmitSuccess] = useState('')
  const formSections = [
    {
      id: 'representative',
      title: t('employerSignup.sections.representative.title'),
      subtitle: t('employerSignup.sections.representative.subtitle')
    },
    {
      id: 'company',
      title: t('employerSignup.sections.company.title'),
      subtitle: t('employerSignup.sections.company.subtitle')
    }
  ] as const
  const roleOptions = [
    { value: 'HR', label: t('employerSignup.roleOptions.hr') },
    { value: 'Admin', label: t('employerSignup.roleOptions.admin') },
    { value: 'Recruiter', label: t('employerSignup.roleOptions.recruiter') },
    { value: 'Hiring Manager', label: t('employerSignup.roleOptions.hiringManager') }
  ]

  const validate = useCallback(() => {
    const e: Record<string, string> = {}
    if (!form.full_name.trim()) e.full_name = t('employerSignup.errors.fullNameRequired')
    if (!emailRe.test(form.email)) e.email = t('employerSignup.errors.invalidEmail')
    if (form.phone && !phoneRe.test(form.phone)) e.phone = t('employerSignup.errors.invalidPhone')
    if (!form.company_name.trim()) e.company_name = t('employerSignup.errors.companyNameRequired')
    if (!form.company_address.trim()) e.company_address = t('employerSignup.errors.companyAddressRequired')
    if (form.company_website_url && !/^https?:\/\//.test(form.company_website_url)) {
      e.company_website_url = t('employerSignup.errors.websiteProtocolRequired')
    }
    setErrors(e)
    return e
  }, [form, t])

  useEffect(() => {
    validate()
  }, [validate])

  function onChange<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function onBlur(field: string) {
    setTouched((current) => ({ ...current, [field]: true }))
    validate()
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setSubmitError('')
    setSubmitSuccess('')

    const validationErrors = validate()
    if (Object.keys(validationErrors).length) {
      const allTouched: Record<string, boolean> = {}
      Object.keys(initialState).forEach((key) => {
        allTouched[key] = true
      })
      setTouched(allTouched)
      return
    }

    setSubmitting(true)
    try {
      const response = await registerEmployerApi({
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        role: form.role.trim(),
        joined_date: form.joined_date ? new Date(form.joined_date).toISOString() : undefined,
        company_name: form.company_name.trim(),
        company_address: form.company_address.trim(),
        company_website_url: form.company_website_url.trim() || undefined,
        company_id: form.company_id ? Number(form.company_id) : undefined
      })

      setForm(initialState)
      setTouched({})
      setSubmitSuccess(t('employerSignup.success', { companyName: response.company_name }))
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string | string[] }>
      const message = axiosError.response?.data?.message
      setSubmitError(
        Array.isArray(message) ? message.join(', ') : message || t('employerSignup.errors.unableToRegister')
      )
    } finally {
      setSubmitting(false)
    }
  }

  const inputClassName = (name: string) =>
    cn(
      'h-13 w-full rounded-2xl border bg-white/80 pl-12 pr-4 text-[15px] text-slate-900 shadow-sm outline-none transition-all duration-200 placeholder:text-slate-400',
      'focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-200/70',
      errors[name] && touched[name] ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-200/70' : 'border-white/60'
    )

  const renderError = (field: string) =>
    errors[field] && touched[field] ? <p className='mt-2 text-sm font-medium text-rose-500'>{errors[field]}</p> : null

  return (
    <section className='relative overflow-hidden bg-white'>
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.20),transparent_30%),radial-gradient(circle_at_top_right,rgba(124,58,237,0.15),transparent_28%),linear-gradient(180deg,#faf7ff_0%,#ffffff_52%,#f8f8fc_100%)]' />
      <div className='absolute -left-30 top-16 h-64 w-64 rounded-full bg-violet-200/30 blur-3xl' />
      <div className='absolute -bottom-30 -right-20 h-72 w-72 rounded-full bg-fuchsia-200/30 blur-3xl' />

      <div className='relative mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 py-10 sm:px-6 lg:px-8'>
        <div className='grid w-full overflow-hidden rounded-4xl border border-white/70 bg-white/80 shadow-[0_30px_90px_rgba(124,58,237,0.12)] backdrop-blur-xl lg:grid-cols-[0.98fr_1.1fr]'>
          <aside className='relative flex flex-col justify-between overflow-hidden bg-[linear-gradient(160deg,#7c3aed_0%,#8b5cf6_45%,#c084fc_100%)] p-8 text-white md:p-10'>
            <div className='absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.28),transparent_22%),radial-gradient(circle_at_80%_18%,rgba(255,255,255,0.18),transparent_18%),radial-gradient(circle_at_70%_72%,rgba(255,255,255,0.14),transparent_26%)]' />
            <div className='relative'>
              <div className='inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/12 px-4 py-2 backdrop-blur-md'>
                <div className='flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-violet-600 shadow-sm'>
                  <BriefcaseBusiness className='h-5 w-5' />
                </div>
                <div>
                  <p className='text-sm font-semibold tracking-[0.18em] text-white/80 uppercase'>TalentPlatformIT</p>
                  <p className='text-sm text-white/72'>{t('employerSignup.badge')}</p>
                </div>
              </div>

              <div className='mt-10 max-w-md'>
                <div className='inline-flex items-center gap-2 rounded-full bg-white/14 px-3 py-1 text-sm font-medium text-white/90'>
                  <Sparkles className='h-4 w-4' />
                  {t('employerSignup.badgeSecondary')}
                </div>
                <h1 className='mt-5 text-4xl font-semibold leading-tight md:text-5xl'>
                  {t('employerSignup.heroTitle')}
                </h1>
                <p className='mt-5 max-w-xl text-base leading-7 text-white/78'>{t('employerSignup.heroDescription')}</p>
              </div>
            </div>

            <div className='relative mt-10 space-y-4'>
              <div className='grid gap-3 sm:grid-cols-3'>
                <div className='rounded-3xl border border-white/18 bg-white/12 p-4 backdrop-blur-md'>
                  <p className='text-2xl font-semibold'>5K+</p>
                  <p className='mt-1 text-sm text-white/72'>{t('employerSignup.stats.techCandidates')}</p>
                </div>
                <div className='rounded-3xl border border-white/18 bg-white/12 p-4 backdrop-blur-md'>
                  <p className='text-2xl font-semibold'>24h</p>
                  <p className='mt-1 text-sm text-white/72'>{t('employerSignup.stats.accountSetup')}</p>
                </div>
                <div className='rounded-3xl border border-white/18 bg-white/12 p-4 backdrop-blur-md'>
                  <p className='text-2xl font-semibold'>Live</p>
                  <p className='mt-1 text-sm text-white/72'>{t('employerSignup.stats.companyProfile')}</p>
                </div>
              </div>

              <div className='rounded-[28px] border border-white/18 bg-white/12 p-5 backdrop-blur-md'>
                <div className='flex items-start gap-3'>
                  <div className='flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-violet-600'>
                    <ShieldCheck className='h-5 w-5' />
                  </div>
                  <div>
                    <p className='text-base font-semibold'>{t('employerSignup.whatHappens.title')}</p>
                    <ul className='mt-3 space-y-2 text-sm text-white/78'>
                      <li className='flex items-center gap-2'>
                        <CheckCircle2 className='h-4 w-4 text-emerald-300' />
                        {t('employerSignup.whatHappens.items.accountCreated')}
                      </li>
                      <li className='flex items-center gap-2'>
                        <CheckCircle2 className='h-4 w-4 text-emerald-300' />
                        {t('employerSignup.whatHappens.items.credentialsSent')}
                      </li>
                      <li className='flex items-center gap-2'>
                        <CheckCircle2 className='h-4 w-4 text-emerald-300' />
                        {t('employerSignup.whatHappens.items.companyLinked')}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <div className='relative p-6 md:p-8 lg:p-10'>
            <div className='mx-auto max-w-3xl'>
              <div className='flex flex-col gap-3 border-b border-slate-100 pb-6 sm:flex-row sm:items-end sm:justify-between'>
                <div>
                  <p className='text-sm font-semibold uppercase tracking-[0.22em] text-violet-500'>
                    {t('employerSignup.page.eyebrow')}
                  </p>
                  <h2 className='mt-2 text-3xl font-semibold text-slate-950 md:text-[2rem]'>
                    {t('employerSignup.page.title')}
                  </h2>
                  <p className='mt-2 max-w-2xl text-sm leading-6 text-slate-500'>
                    {t('employerSignup.page.description')}
                  </p>
                </div>

                <div className='inline-flex items-center gap-2 rounded-full bg-violet-50 px-4 py-2 text-sm font-medium text-violet-700'>
                  <Building2 className='h-4 w-4' />
                  {t('employerSignup.badge')}
                </div>
              </div>

              {submitSuccess ? (
                <div className='mt-6 rounded-3xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700 shadow-sm'>
                  {submitSuccess}
                </div>
              ) : null}

              {submitError ? (
                <div className='mt-6 rounded-3xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-600 shadow-sm'>
                  {submitError}
                </div>
              ) : null}

              <form onSubmit={onSubmit} className='mt-8 space-y-7'>
                <div className='grid gap-5 md:grid-cols-2'>
                  {formSections.map((section) => (
                    <div
                      key={section.id}
                      className='rounded-[28px] border border-slate-100 bg-[linear-gradient(180deg,#ffffff_0%,#faf7ff_100%)] p-5 shadow-sm'
                    >
                      <p className='text-base font-semibold text-slate-950'>{section.title}</p>
                      <p className='mt-1 text-sm text-slate-500'>{section.subtitle}</p>

                      {section.id === 'representative' ? (
                        <div className='mt-5 space-y-4'>
                          <div>
                            <label className='mb-2 block text-sm font-medium text-slate-700'>
                              {t('employerSignup.labels.fullName')}
                            </label>
                            <div className='relative'>
                              <UserRound className='pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-violet-400' />
                              <input
                                className={inputClassName('full_name')}
                                value={form.full_name}
                                onChange={(event) => onChange('full_name', event.target.value)}
                                onBlur={() => onBlur('full_name')}
                                placeholder={t('employerSignup.placeholders.fullName')}
                              />
                            </div>
                            {renderError('full_name')}
                          </div>

                          <div>
                            <label className='mb-2 block text-sm font-medium text-slate-700'>
                              {t('employerSignup.labels.email')}
                            </label>
                            <div className='relative'>
                              <Mail className='pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-violet-400' />
                              <input
                                className={inputClassName('email')}
                                value={form.email}
                                onChange={(event) => onChange('email', event.target.value)}
                                onBlur={() => onBlur('email')}
                                placeholder={t('employerSignup.placeholders.email')}
                              />
                            </div>
                            {renderError('email')}
                          </div>

                          <div>
                            <label className='mb-2 block text-sm font-medium text-slate-700'>
                              {t('employerSignup.labels.phone')}
                            </label>
                            <div className='relative'>
                              <Phone className='pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-violet-400' />
                              <input
                                className={inputClassName('phone')}
                                value={form.phone}
                                onChange={(event) => onChange('phone', event.target.value)}
                                onBlur={() => onBlur('phone')}
                                placeholder={t('employerSignup.placeholders.phone')}
                              />
                            </div>
                            {renderError('phone')}
                          </div>

                          <div className='grid gap-4 sm:grid-cols-2'>
                            <div>
                              <label className='mb-2 block text-sm font-medium text-slate-700'>
                                {t('employerSignup.labels.role')}
                              </label>
                              <div className='relative'>
                                <BriefcaseBusiness className='pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-violet-400' />
                                <select
                                  className={cn(inputClassName('role'), 'appearance-none')}
                                  value={form.role}
                                  onChange={(event) => onChange('role', event.target.value)}
                                  onBlur={() => onBlur('role')}
                                >
                                  {roleOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                      {option.label}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            <div>
                              <label className='mb-2 block text-sm font-medium text-slate-700'>
                                {t('employerSignup.labels.joinedDate')}
                              </label>
                              <div className='relative'>
                                <CalendarDays className='pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-violet-400' />
                                <input
                                  type='date'
                                  className={inputClassName('joined_date')}
                                  value={form.joined_date}
                                  onChange={(event) => onChange('joined_date', event.target.value)}
                                  onBlur={() => onBlur('joined_date')}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className='mt-5 space-y-4'>
                          <div>
                            <label className='mb-2 block text-sm font-medium text-slate-700'>
                              {t('employerSignup.labels.companyName')}
                            </label>
                            <div className='relative'>
                              <Building2 className='pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-violet-400' />
                              <input
                                className={inputClassName('company_name')}
                                value={form.company_name}
                                onChange={(event) => onChange('company_name', event.target.value)}
                                onBlur={() => onBlur('company_name')}
                                placeholder={t('employerSignup.placeholders.companyName')}
                              />
                            </div>
                            {renderError('company_name')}
                          </div>

                          <div>
                            <label className='mb-2 block text-sm font-medium text-slate-700'>
                              {t('employerSignup.labels.companyAddress')}
                            </label>
                            <div className='relative'>
                              <MapPin className='pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-violet-400' />
                              <input
                                className={inputClassName('company_address')}
                                value={form.company_address}
                                onChange={(event) => onChange('company_address', event.target.value)}
                                onBlur={() => onBlur('company_address')}
                                placeholder={t('employerSignup.placeholders.companyAddress')}
                              />
                            </div>
                            {renderError('company_address')}
                          </div>

                          <div>
                            <label className='mb-2 block text-sm font-medium text-slate-700'>
                              {t('employerSignup.labels.companyWebsite')}
                            </label>
                            <div className='relative'>
                              <Globe className='pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-violet-400' />
                              <input
                                className={inputClassName('company_website_url')}
                                value={form.company_website_url}
                                onChange={(event) => onChange('company_website_url', event.target.value)}
                                onBlur={() => onBlur('company_website_url')}
                                placeholder={t('employerSignup.placeholders.companyWebsite')}
                              />
                            </div>
                            {renderError('company_website_url')}
                          </div>

                          <div className='rounded-3xl border border-violet-100 bg-violet-50/80 p-4'>
                            <p className='text-sm font-semibold text-violet-700'>
                              {t('employerSignup.companyMatching.title')}
                            </p>
                            <p className='mt-1 text-sm leading-6 text-violet-600'>
                              {t('employerSignup.companyMatching.description')}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <input type='hidden' value={form.company_id} />

                <div className='flex flex-col gap-4 rounded-[28px] border border-slate-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between'>
                  <div>
                    <p className='text-base font-semibold text-slate-950'>{t('employerSignup.activation.title')}</p>
                    <p className='mt-1 text-sm text-slate-500'>{t('employerSignup.activation.description')}</p>
                  </div>

                  <div className='flex flex-col gap-3 sm:flex-row'>
                    <button
                      type='button'
                      className='inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-5 text-sm font-medium text-slate-600 transition hover:bg-slate-100'
                      onClick={() => {
                        setForm(initialState)
                        setTouched({})
                        setErrors({})
                        setSubmitError('')
                        setSubmitSuccess('')
                      }}
                    >
                      {t('employerSignup.actions.reset')}
                    </button>
                    <button
                      type='submit'
                      disabled={submitting}
                      className='inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#7c3aed_0%,#8b5cf6_50%,#a855f7_100%)] px-6 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(124,58,237,0.28)] transition hover:-translate-y-px hover:shadow-[0_22px_48px_rgba(124,58,237,0.32)] disabled:cursor-not-allowed disabled:opacity-60'
                    >
                      {submitting ? t('employerSignup.actions.creating') : t('employerSignup.actions.register')}
                      <ArrowRight className='h-4 w-4' />
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
