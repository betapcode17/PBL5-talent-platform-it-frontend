import type { ReactNode } from 'react'
import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ExternalLink, FileBadge2, Github, GraduationCap, BriefcaseBusiness, Link as LinkIcon, Linkedin, Mail, Phone, Sparkles, UserRound } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

import { getCvDetailApi } from '@/api/cv'
import { getEmployerCandidatesApi } from '@/api/employer'

const skillCategoryOptions = [
  { value: 'programming_language', label: 'Ngôn ngữ lập trình / Programming Languages' },
  { value: 'framework', label: 'Framework / Frameworks' },
  { value: 'os', label: 'Hệ điều hành / Operating Systems' },
  { value: 'database', label: 'Cơ sở dữ liệu / Databases' },
  { value: 'version_control', label: 'Hệ thống quản lý phiên bản / Version Control' },
  { value: 'development_tool', label: 'Công cụ quản lý phát triển / Development Tools' },
  { value: 'platform', label: 'Nền tảng / Platforms' }
]

const CandidateCvProfilePage = () => {
  const { seekerId } = useParams()
  const numericSeekerId = Number(seekerId)

  const { data: cvDetail, isLoading: isLoadingCv } = useQuery({
    queryKey: ['employer', 'candidate-cv', numericSeekerId],
    queryFn: () => getCvDetailApi(numericSeekerId),
    enabled: Number.isFinite(numericSeekerId) && numericSeekerId > 0
  })

  const { data: candidatesResponse, isLoading: isLoadingCandidate } = useQuery({
    queryKey: ['employer', 'candidates', 'lookup', numericSeekerId],
    queryFn: () => getEmployerCandidatesApi(1, 100),
    enabled: Number.isFinite(numericSeekerId) && numericSeekerId > 0
  })

  const candidate = useMemo(
    () => candidatesResponse?.candidates.find((item) => item.seeker.id === numericSeekerId) ?? null,
    [candidatesResponse?.candidates, numericSeekerId]
  )

  const candidateName = candidate?.seeker.fullName || cvDetail?.seeker.fullName || 'Ứng viên'
  const candidateEmail = candidate?.seeker.email || cvDetail?.seeker.email || 'Chưa cập nhật email'
  const candidatePhone = candidate?.seeker.phone || 'Chưa cập nhật số điện thoại'
  const candidateCvUrl = candidate?.seeker.cvUrl || cvDetail?.cvUrl || null
  const candidateLinks = [
    { label: 'GitHub', value: candidate?.seeker.githubUrl || cvDetail?.seeker.githubUrl || null, icon: Github },
    { label: 'LinkedIn', value: candidate?.seeker.linkedinUrl || cvDetail?.seeker.linkedinUrl || null, icon: Linkedin },
    { label: 'Portfolio', value: candidate?.seeker.portfolioUrl || cvDetail?.seeker.portfolioUrl || null, icon: LinkIcon }
  ]

  if (!Number.isFinite(numericSeekerId) || numericSeekerId <= 0) {
    return (
      <div className='rounded-3xl border border-amber-200 bg-amber-50 px-6 py-5 text-sm text-amber-700'>
        Không tìm thấy ứng viên hợp lệ để hiển thị hồ sơ.
      </div>
    )
  }

  if (isLoadingCv || isLoadingCandidate) {
    return (
      <div className='space-y-6'>
        <div className='h-28 animate-pulse rounded-3xl bg-slate-100' />
        <div className='grid gap-6 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)]'>
          <div className='h-80 animate-pulse rounded-3xl bg-slate-100' />
          <div className='h-[28rem] animate-pulse rounded-3xl bg-slate-100' />
        </div>
      </div>
    )
  }

  if (!cvDetail) {
    return (
      <div className='rounded-3xl border border-slate-200 bg-white px-6 py-5 text-sm text-slate-600'>
        Không thể tải hồ sơ CV của ứng viên này.
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <section className='rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_18px_56px_rgba(15,23,42,0.06)] sm:p-8'>
        <div className='flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between'>
          <div className='flex min-w-0 items-center gap-4'>
            {candidate?.seeker.avatar ? (
              <img src={candidate.seeker.avatar} alt={candidateName} className='h-20 w-20 rounded-3xl border border-slate-200 object-cover' />
            ) : (
              <div className='flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-100 text-slate-500'>
                <UserRound className='h-10 w-10' />
              </div>
            )}
            <div className='min-w-0'>
              <p className='text-sm font-semibold uppercase tracking-[0.18em] text-sky-600'>Hồ sơ CV ứng viên</p>
              <h1 className='truncate text-3xl font-bold tracking-[-0.04em] text-slate-950'>{candidateName}</h1>
              <p className='mt-2 text-sm leading-6 text-slate-600'>
                Trang này chỉ hỗ trợ xem thông tin do backend quản lý. Employer không thể chỉnh sửa dữ liệu CV của seeker.
              </p>
            </div>
          </div>

          <div className='flex flex-wrap gap-3'>
            <Link
              to='/employer/candidates'
              className='inline-flex h-11 items-center rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900'
            >
              Quay lại danh sách
            </Link>
            {candidateCvUrl ? (
              <a
                href={candidateCvUrl}
                target='_blank'
                rel='noreferrer'
                className='inline-flex h-11 items-center gap-2 rounded-2xl bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-800'
              >
                <ExternalLink className='h-4 w-4' />
                Mở CV hiện tại
              </a>
            ) : null}
          </div>
        </div>
      </section>

      <div className='grid gap-6 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)]'>
        <aside className='space-y-6'>
          <section className='rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_56px_rgba(15,23,42,0.06)]'>
            <h2 className='text-lg font-semibold text-slate-950'>Thông tin liên hệ</h2>
            <div className='mt-4 space-y-3'>
              <InfoItem icon={<Mail className='h-4 w-4' />} label='Email' value={candidateEmail} />
              <InfoItem icon={<Phone className='h-4 w-4' />} label='Số điện thoại' value={candidatePhone} />
            </div>
          </section>

          <section className='rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_56px_rgba(15,23,42,0.06)]'>
            <h2 className='text-lg font-semibold text-slate-950'>Liên kết cá nhân</h2>
            <div className='mt-4 space-y-3'>
              {candidateLinks.map((item) => (
                <InfoLink key={item.label} icon={<item.icon className='h-4 w-4' />} label={item.label} value={item.value} />
              ))}
            </div>
          </section>

          <section className='rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_56px_rgba(15,23,42,0.06)]'>
            <h2 className='text-lg font-semibold text-slate-950'>CV hiện tại</h2>
            <div className='mt-4'>
              {candidateCvUrl ? (
                <a
                  href={candidateCvUrl}
                  target='_blank'
                  rel='noreferrer'
                  className='flex aspect-square max-w-[190px] items-center justify-center rounded-[28px] border border-slate-200 bg-slate-50 text-slate-700 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700'
                >
                  <div className='text-center'>
                    <FileBadge2 className='mx-auto h-14 w-14' />
                    <p className='mt-3 text-sm font-semibold'>Xem file CV</p>
                  </div>
                </a>
              ) : (
                <div className='rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-500'>
                  Ứng viên chưa có file CV mặc định.
                </div>
              )}
            </div>
          </section>
        </aside>

        <div className='space-y-6'>
          <ReadonlySection title='Học vấn' icon={<GraduationCap className='h-5 w-5' />}>
            {cvDetail.educations.length > 0 ? (
              cvDetail.educations.map((item) => (
                <EntryCard
                  key={item.id}
                  title={item.school}
                  subtitle={[item.degree, item.major].filter(Boolean).join(' | ')}
                  meta={formatRange(item.startDate, item.endDate)}
                  description={item.description}
                />
              ))
            ) : (
              <EmptyText text='Chưa có dữ liệu học vấn.' />
            )}
          </ReadonlySection>

          <ReadonlySection title='Kinh nghiệm làm việc' icon={<BriefcaseBusiness className='h-5 w-5' />}>
            {cvDetail.experiences.length > 0 ? (
              cvDetail.experiences.map((item) => (
                <EntryCard
                  key={item.id}
                  title={item.position}
                  subtitle={item.company}
                  meta={formatRange(item.startDate, item.endDate)}
                  description={item.description}
                />
              ))
            ) : (
              <EmptyText text='Chưa có dữ liệu kinh nghiệm.' />
            )}
          </ReadonlySection>

          <ReadonlySection title='Kỹ năng chuyên môn' icon={<Sparkles className='h-5 w-5' />}>
            {cvDetail.skills.length > 0 ? (
              <SkillSummaryTable
                skills={cvDetail.skills.map((skill) => ({
                  id: skill.id,
                  name: skill.name,
                  category: skill.category ?? 'programming_language',
                  experienceMonths: skill.experienceMonths ?? 0,
                  isStrong: skill.isStrong ?? false
                }))}
              />
            ) : (
              <EmptyText text='Chưa có dữ liệu kỹ năng.' />
            )}
          </ReadonlySection>

          <ReadonlySection title='Chứng chỉ' icon={<FileBadge2 className='h-5 w-5' />}>
            {cvDetail.certificates.length > 0 ? (
              cvDetail.certificates.map((item) => (
                <EntryCard key={item.id} title={item.title} subtitle={item.issuer} meta={item.issuedDate ? formatDate(item.issuedDate) : undefined} />
              ))
            ) : (
              <EmptyText text='Chưa có dữ liệu chứng chỉ.' />
            )}
          </ReadonlySection>

          <ReadonlySection title='Dự án nổi bật' icon={<BriefcaseBusiness className='h-5 w-5' />}>
            {cvDetail.projects.length > 0 ? (
              cvDetail.projects.map((item) => (
                <EntryCard
                  key={item.id}
                  title={item.name}
                  subtitle={item.role || undefined}
                  meta={formatRange(item.startDate, item.endDate)}
                  description={item.description}
                  link={item.link || undefined}
                />
              ))
            ) : (
              <EmptyText text='Chưa có dữ liệu dự án.' />
            )}
          </ReadonlySection>

          <ReadonlySection title='CvPersonality' icon={<Sparkles className='h-5 w-5' />}>
            {cvDetail.personalities.length > 0 ? (
              cvDetail.personalities.map((item) => (
                <EntryCard key={item.id} title={item.type} description={item.description} />
              ))
            ) : (
              <EmptyText text='Chưa có dữ liệu CvPersonality.' />
            )}
          </ReadonlySection>
        </div>
      </div>
    </div>
  )
}

const ReadonlySection = ({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) => (
  <section className='rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_56px_rgba(15,23,42,0.06)]'>
    <div className='flex items-center gap-2 text-slate-950'>
      {icon}
      <h2 className='text-lg font-semibold'>{title}</h2>
    </div>
    <div className='mt-4 space-y-3'>{children}</div>
  </section>
)

const InfoItem = ({ icon, label, value }: { icon: ReactNode; label: string; value: string }) => (
  <div className='flex items-start gap-3 rounded-2xl bg-slate-50 px-4 py-3'>
    <div className='mt-0.5 text-sky-700'>{icon}</div>
    <div className='min-w-0'>
      <p className='text-xs font-semibold uppercase tracking-[0.12em] text-slate-400'>{label}</p>
      <p className='mt-1 break-all text-sm font-medium text-slate-800'>{value}</p>
    </div>
  </div>
)

const InfoLink = ({ icon, label, value }: { icon: ReactNode; label: string; value?: string | null }) => {
  const isLink = Boolean(value && /^https?:\/\//i.test(value))

  return (
    <div className='flex items-start gap-3 rounded-2xl bg-slate-50 px-4 py-3'>
      <div className='mt-0.5 text-sky-700'>{icon}</div>
      <div className='min-w-0'>
        <p className='text-xs font-semibold uppercase tracking-[0.12em] text-slate-400'>{label}</p>
        {isLink ? (
          <a href={value!} target='_blank' rel='noreferrer' className='mt-1 block break-all text-sm font-medium text-sky-700 hover:text-sky-800'>
            {value}
          </a>
        ) : (
          <p className='mt-1 break-all text-sm font-medium text-slate-500'>{value || 'Chưa cập nhật'}</p>
        )}
      </div>
    </div>
  )
}

const EntryCard = ({
  title,
  subtitle,
  meta,
  description,
  link
}: {
  title: string
  subtitle?: string
  meta?: string
  description?: string | null
  link?: string
}) => (
  <article className='rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4'>
    <div className='flex flex-wrap items-start justify-between gap-3'>
      <div>
        <h3 className='text-base font-semibold text-slate-900'>{title}</h3>
        {subtitle ? <p className='mt-1 text-sm font-medium text-slate-700'>{subtitle}</p> : null}
      </div>
      {meta ? <span className='rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500'>{meta}</span> : null}
    </div>
    {description ? <p className='mt-3 whitespace-pre-line text-sm leading-6 text-slate-600'>{description}</p> : null}
    {link ? (
      <a href={link} target='_blank' rel='noreferrer' className='mt-3 inline-flex items-center gap-2 text-sm font-semibold text-sky-700 hover:text-sky-800'>
        <ExternalLink className='h-4 w-4' />
        Mở liên kết dự án
      </a>
    ) : null}
  </article>
)

const EmptyText = ({ text }: { text: string }) => <p className='text-sm leading-6 text-slate-500'>{text}</p>

const SkillSummaryTable = ({
  skills
}: {
  skills: Array<{
    id: string
    name: string
    category: string
    experienceMonths: number
    isStrong: boolean
  }>
}) => {
  const groupedSkills = skillCategoryOptions
    .map((category) => ({
      ...category,
      skills: skills.filter((skill) => (skill.category ?? 'programming_language') === category.value)
    }))
    .filter((category) => category.skills.length > 0)

  if (groupedSkills.length === 0) {
    return <div className='rounded-[22px] border border-dashed border-slate-300 bg-slate-50/70 px-4 py-5 text-sm text-slate-500'>Chưa có kỹ năng.</div>
  }

  return (
    <div className='overflow-hidden rounded-[22px] border border-indigo-200 bg-white'>
      <div className='flex flex-wrap gap-2 border-b border-indigo-100 bg-white px-5 py-4'>
        <span className='rounded-md bg-sky-50 px-2.5 py-1 text-sm font-semibold text-sky-600'>Kỹ năng thành thạo</span>
        <span className='rounded-md bg-indigo-50 px-2.5 py-1 text-sm font-semibold text-indigo-950'>Kỹ năng có kinh nghiệm</span>
      </div>
      <div className='grid grid-cols-[minmax(140px,0.34fr)_minmax(0,1fr)] border-b border-indigo-200 bg-indigo-50/50 text-sm font-semibold text-indigo-950'>
        <div className='border-r border-indigo-200 px-5 py-4 text-center'>Loại</div>
        <div className='px-5 py-4 text-center'>Kỹ năng</div>
      </div>
      {groupedSkills.map((category) => (
        <div key={category.value} className='grid grid-cols-[minmax(140px,0.34fr)_minmax(0,1fr)] border-b border-indigo-100 last:border-b-0'>
          <div className='border-r border-indigo-100 px-5 py-4 text-sm font-medium text-indigo-950'>{category.label}</div>
          <div className='flex flex-wrap gap-2 px-5 py-4'>
            {category.skills.map((skill) => (
              <span key={skill.id} className='inline-flex items-center gap-2 rounded-md bg-slate-100 px-2.5 py-1.5 text-sm font-semibold text-indigo-950'>
                <span className={skill.isStrong ? 'text-sky-600' : undefined}>{skill.name}</span>
                <span className='rounded bg-white px-1.5 py-0.5 text-xs font-medium text-indigo-900'>{skill.experienceMonths ?? 0} tháng</span>
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

const formatDate = (value?: string | null) => {
  if (!value) return ''

  return new Date(value).toLocaleDateString('vi-VN')
}

const formatRange = (start?: string | null, end?: string | null) => {
  if (!start && !end) return ''

  const startText = start ? formatDate(start) : 'Chưa cập nhật'
  const endText = end ? formatDate(end) : 'Hiện tại'

  return `${startText} - ${endText}`
}

export default CandidateCvProfilePage
