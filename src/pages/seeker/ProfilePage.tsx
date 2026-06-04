import type { ReactNode } from 'react'
import {
  Award,
  BriefcaseBusiness,
  CalendarDays,
  Camera,
  ExternalLink,
  FileBadge2,
  FileText,
  GraduationCap,
  Languages,
  Mail,
  Pencil,
  Phone,
  Sparkles,
  Star,
  UserRound
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { useAuthStore } from '@/store/authStore'

type ProfileTab = 'profile' | 'cv'

const profileSections = [
  { id: 'basic-info', label: 'Thông tin cơ bản' },
  { id: 'education', label: 'Học vấn' },
  { id: 'certifications', label: 'Chứng chỉ' },
  { id: 'awards', label: 'Thành tích' },
  { id: 'skills', label: 'Kỹ năng' },
  { id: 'projects', label: 'Dự án nổi bật' },
  { id: 'experience', label: 'Kinh nghiệm' },
  { id: 'about', label: 'Giới thiệu' }
]

const cvSections = [
  { id: 'cv-overview', label: 'Tổng quan CV' },
  { id: 'cv-library', label: 'Thư viện CV' },
  { id: 'cv-checklist', label: 'Checklist' }
]

const educationItems = [
  { label: 'Trường', value: 'Đại học Đà Nẵng - Đại học Bách khoa' },
  { label: 'Chuyên ngành', value: 'Công nghệ thông tin' },
  { label: 'Năm học', value: 'Năm 3' },
  { label: 'Tốt nghiệp dự kiến', value: '08/2027' },
  { label: 'GPA', value: '3.20 / 4.00' }
]

const certifications = [
  { name: 'JLPT N3', date: '07/2025', accent: 'amber' },
  { name: 'TOEIC Bridge', date: '10/2025', accent: 'sky' },
  { name: 'Aptis Speaking B2', date: '12/2025', accent: 'emerald' }
]

const awards = [
  { title: 'Top 5 cuộc thi Hackathon nội bộ', date: '05/2025' },
  { title: 'Sinh viên tiêu biểu học kỳ', date: '01/2025' }
]

const skillGroups = [
  {
    category: 'Ngôn ngữ lập trình',
    skills: ['Java', 'TypeScript', 'JavaScript', 'Python', 'C#']
  },
  {
    category: 'Framework',
    skills: ['Spring Boot', 'React', 'ASP.NET MVC']
  },
  {
    category: 'Database',
    skills: ['MySQL', 'SQL Server', 'PostgreSQL']
  },
  {
    category: 'Công cụ',
    skills: ['Git', 'Postman', 'Figma', 'Slack']
  }
]

const projects = [
  {
    title: 'Talent Platform for IT Recruitment',
    description: 'Xây dựng nền tảng tuyển dụng cho ứng viên IT với tính năng job browsing, profile công ty, chat và quản lý ứng tuyển.',
    stack: ['React', 'TypeScript', 'Tailwind', 'Node.js'],
    status: 'Đang phát triển'
  },
  {
    title: 'Student Equipment Management',
    description: 'Thiết kế giao diện và luồng quản lý thiết bị cho phòng lab trường học, tập trung vào trải nghiệm sử dụng và báo cáo thống kê.',
    stack: ['Java', 'Spring', 'MySQL'],
    status: 'Hoàn thành'
  }
]

const experienceItems = [
  {
    company: 'Sun* Internal Project',
    role: 'Frontend Developer Intern',
    period: '03/2026 - Hiện tại',
    summary: 'Phát triển UI cho các module công ty, công việc, profile seeker; phối hợp API integration và tinh chỉnh trải nghiệm người dùng.'
  }
]

const cvCards = [
  {
    title: 'CV Frontend Developer',
    format: 'PDF',
    language: 'Tiếng Anh',
    updatedAt: 'Cập nhật 2 ngày trước',
    status: 'Đang sử dụng'
  },
  {
    title: 'CV Full-stack Intern',
    format: 'DOCX',
    language: 'Tiếng Việt',
    updatedAt: 'Cập nhật 1 tuần trước',
    status: 'Bản nháp'
  }
]

const ProfilePage = () => {
  const user = useAuthStore((state) => state.user)
  const [activeTab, setActiveTab] = useState<ProfileTab>('profile')

  const heroBadges = useMemo(() => {
    const badges = ['Open to internship', 'Actively building CV']

    if (user?.gender) {
      badges.push(user.gender)
    }

    return badges
  }, [user?.gender])

  const sectionNav = activeTab === 'profile' ? profileSections : cvSections

  return (
    <div className='mx-auto max-w-7xl px-4 py-8'>
      <section className='rounded-[34px] border border-slate-200/80 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-8'>
        <div className='flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between'>
          <div className='flex min-w-0 flex-1 flex-col gap-6 sm:flex-row sm:items-start'>
            <div className='relative shrink-0'>
              <div className='flex h-28 w-28 items-center justify-center overflow-hidden rounded-[30px] border border-sky-100 bg-gradient-to-br from-sky-500 to-blue-700 text-3xl font-semibold text-white shadow-[0_18px_44px_rgba(37,99,235,0.24)] sm:h-32 sm:w-32'>
                {user?.user_image ? (
                  <img src={user.user_image} alt={user.full_name} className='h-full w-full object-cover' />
                ) : (
                  <span>{(user?.full_name || user?.email || 'U').charAt(0).toUpperCase()}</span>
                )}
              </div>
              <button
                type='button'
                className='absolute -bottom-2 -right-2 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-500 text-white shadow-[0_12px_24px_rgba(14,165,233,0.28)]'
              >
                <Camera className='h-4 w-4' />
              </button>
            </div>

            <div className='min-w-0 flex-1 space-y-5'>
              <div className='space-y-3'>
                <div className='flex flex-wrap gap-2'>
                  {heroBadges.map((badge) => (
                    <span
                      key={badge}
                      className='rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700'
                    >
                      {badge}
                    </span>
                  ))}
                </div>

                <div>
                  <h1 className='text-3xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-[3rem]'>
                    {user?.full_name || 'Job seeker profile'}
                  </h1>
                  <p className='mt-2 text-sm text-slate-500 sm:text-base'>
                    Hồ sơ cá nhân và thư viện CV dành cho ứng viên. Bạn có thể quản lý thông tin nổi bật, kỹ năng và nhiều phiên bản CV tại đây.
                  </p>
                </div>
              </div>

              <div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-4'>
                <HeroMetric icon={<UserRound className='h-4 w-4' />} label='Mã tài khoản' value={`SEEKER-${user?.id ?? '0001'}`} />
                <HeroMetric icon={<Mail className='h-4 w-4' />} label='Email' value={user?.email || 'Chưa cập nhật'} />
                <HeroMetric icon={<Phone className='h-4 w-4' />} label='Điện thoại' value={user?.phone || 'Chưa cập nhật'} />
                <HeroMetric icon={<CalendarDays className='h-4 w-4' />} label='Tham gia' value={formatDate(user?.registration_date)} />
              </div>
            </div>
          </div>

          <div className='w-full max-w-sm rounded-[28px] border border-slate-200 bg-slate-50/80 p-5'>
            <p className='text-xs font-semibold uppercase tracking-[0.22em] text-slate-400'>Quick Actions</p>
            <div className='mt-4 grid gap-3'>
              <ActionTile title='Chỉnh sửa hồ sơ' description='Cập nhật thông tin cá nhân, học vấn, kỹ năng.' icon={<Pencil className='h-4 w-4' />} />
              <ActionTile title='Tải CV mới' description='Thêm phiên bản CV theo vị trí ứng tuyển.' icon={<FileText className='h-4 w-4' />} />
              <ActionTile title='Kiểm tra hồ sơ' description='Rà soát nhanh các mục còn thiếu trước khi apply.' icon={<Sparkles className='h-4 w-4' />} />
            </div>
          </div>
        </div>

        <div className='mt-8 border-b border-slate-200'>
          <div className='flex flex-wrap gap-2'>
            <TabButton active={activeTab === 'profile'} onClick={() => setActiveTab('profile')}>
              Hồ sơ
            </TabButton>
            <TabButton active={activeTab === 'cv'} onClick={() => setActiveTab('cv')}>
              Quản lý CV
            </TabButton>
          </div>
        </div>
      </section>

      <div className='mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px]'>
        <div className='space-y-6'>
          {activeTab === 'profile' ? (
            <>
              <SectionCard id='basic-info' title='Thông tin cơ bản' icon={<UserRound className='h-5 w-5' />}>
                <div className='grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]'>
                  <dl className='space-y-3'>
                    <ProfileRow label='Họ và tên' value={user?.full_name || 'Chưa cập nhật'} />
                    <ProfileRow label='Email' value={user?.email || 'Chưa cập nhật'} />
                    <ProfileRow label='Số điện thoại' value={user?.phone || 'Chưa cập nhật'} />
                    <ProfileRow label='Giới tính' value={user?.gender || 'Chưa cập nhật'} />
                    <ProfileRow label='Quốc gia' value='Việt Nam' />
                  </dl>

                  <div className='rounded-[24px] border border-slate-200 bg-slate-50/70 p-5'>
                    <h3 className='text-sm font-semibold uppercase tracking-[0.18em] text-slate-400'>Liên kết cá nhân</h3>
                    <div className='mt-4 space-y-3'>
                      <LinkItem label='GitHub' value='https://github.com/BachTran111' />
                      <LinkItem label='LinkedIn' value='https://linkedin.com/in/tranxuanbach' />
                      <LinkItem label='Portfolio' value='https://portfolio.example.dev' />
                    </div>
                  </div>
                </div>
              </SectionCard>

              <SectionCard id='education' title='Học vấn' icon={<GraduationCap className='h-5 w-5' />}>
                <div className='grid gap-4 md:grid-cols-2'>
                  {educationItems.map((item) => (
                    <InfoCard key={item.label} label={item.label} value={item.value} />
                  ))}
                </div>
              </SectionCard>

              <SectionCard id='certifications' title='Chứng chỉ' icon={<FileBadge2 className='h-5 w-5' />}>
                <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
                  {certifications.map((item) => (
                    <BadgeCard key={item.name} title={item.name} meta={`Đạt được ${item.date}`} accent={item.accent} />
                  ))}
                </div>
              </SectionCard>

              <SectionCard id='awards' title='Thành tích' icon={<Award className='h-5 w-5' />}>
                <div className='space-y-3'>
                  {awards.map((item) => (
                    <TimelineRow key={item.title} title={item.title} meta={item.date} />
                  ))}
                </div>
              </SectionCard>

              <SectionCard id='skills' title='Kỹ năng chuyên môn' icon={<Languages className='h-5 w-5' />}>
                <div className='overflow-hidden rounded-[24px] border border-slate-200'>
                  {skillGroups.map((group, index) => (
                    <div
                      key={group.category}
                      className={`grid gap-4 border-slate-200 px-5 py-4 md:grid-cols-[220px_minmax(0,1fr)] ${
                        index !== skillGroups.length - 1 ? 'border-b' : ''
                      }`}
                    >
                      <div className='text-sm font-semibold text-slate-900'>{group.category}</div>
                      <div className='flex flex-wrap gap-2'>
                        {group.skills.map((skill) => (
                          <span
                            key={skill}
                            className='rounded-full border border-sky-200 bg-sky-50 px-3 py-2 text-sm font-medium text-sky-700'
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>

              <SectionCard id='projects' title='Dự án nổi bật' icon={<Star className='h-5 w-5' />}>
                <div className='grid gap-4 lg:grid-cols-2'>
                  {projects.map((project) => (
                    <article key={project.title} className='rounded-[24px] border border-slate-200 bg-slate-50/70 p-5'>
                      <div className='flex items-start justify-between gap-3'>
                        <div>
                          <h3 className='text-lg font-semibold text-slate-950'>{project.title}</h3>
                          <p className='mt-1 text-sm text-slate-500'>{project.status}</p>
                        </div>
                        <span className='rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500'>
                          Project
                        </span>
                      </div>
                      <p className='mt-4 text-sm leading-7 text-slate-600'>{project.description}</p>
                      <div className='mt-4 flex flex-wrap gap-2'>
                        {project.stack.map((item) => (
                          <span key={item} className='rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600'>
                            {item}
                          </span>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              </SectionCard>

              <SectionCard id='experience' title='Kinh nghiệm thực tập' icon={<BriefcaseBusiness className='h-5 w-5' />}>
                <div className='space-y-4'>
                  {experienceItems.map((item) => (
                    <article key={item.company} className='rounded-[24px] border border-slate-200 bg-slate-50/70 p-5'>
                      <div className='flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between'>
                        <div>
                          <h3 className='text-lg font-semibold text-slate-950'>{item.role}</h3>
                          <p className='mt-1 text-sm font-medium text-sky-700'>{item.company}</p>
                        </div>
                        <span className='rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500'>{item.period}</span>
                      </div>
                      <p className='mt-4 text-sm leading-7 text-slate-600'>{item.summary}</p>
                    </article>
                  ))}
                </div>
              </SectionCard>

              <SectionCard id='about' title='Giới thiệu & điểm mạnh' icon={<Sparkles className='h-5 w-5' />}>
                <div className='grid gap-4 lg:grid-cols-2'>
                  <div className='rounded-[24px] border border-slate-200 bg-slate-50/70 p-5'>
                    <h3 className='text-sm font-semibold uppercase tracking-[0.18em] text-slate-400'>Giới thiệu</h3>
                    <p className='mt-4 text-sm leading-7 text-slate-600'>
                      Mình là sinh viên IT định hướng Frontend và Full-stack, yêu thích xây dựng sản phẩm có trải nghiệm rõ ràng, hiện đại và hữu ích cho người dùng cuối.
                    </p>
                  </div>
                  <div className='rounded-[24px] border border-slate-200 bg-slate-50/70 p-5'>
                    <h3 className='text-sm font-semibold uppercase tracking-[0.18em] text-slate-400'>Điểm mạnh</h3>
                    <ul className='mt-4 space-y-3 text-sm leading-7 text-slate-600'>
                      <li>Chủ động hoàn thiện UI và phối hợp API integration.</li>
                      <li>Có tư duy sản phẩm, quan tâm đến trải nghiệm người dùng.</li>
                      <li>Thoải mái với codebase TypeScript, React, Tailwind và Java backend.</li>
                    </ul>
                  </div>
                </div>
              </SectionCard>
            </>
          ) : (
            <>
              <SectionCard id='cv-overview' title='Tổng quan CV' icon={<FileText className='h-5 w-5' />}>
                <div className='grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]'>
                  <div className='rounded-[24px] border border-slate-200 bg-[linear-gradient(135deg,rgba(239,246,255,1),rgba(250,245,255,1))] p-6'>
                    <p className='text-xs font-semibold uppercase tracking-[0.18em] text-sky-600'>Primary CV</p>
                    <h3 className='mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950'>CV Frontend Developer</h3>
                    <p className='mt-3 text-sm leading-7 text-slate-600'>
                      Đây là phiên bản CV đang được dùng mặc định khi ứng tuyển. Bạn có thể tải bản mới hoặc tạo nhiều phiên bản theo vị trí mong muốn.
                    </p>
                    <div className='mt-5 flex flex-wrap gap-3'>
                      <button type='button' className='rounded-2xl bg-sky-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(14,165,233,0.24)]'>
                        Tải CV mới
                      </button>
                      <button type='button' className='rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700'>
                        Tạo CV thủ công
                      </button>
                    </div>
                  </div>

                  <div className='grid gap-3'>
                    <MetricMini label='Số CV' value='2 phiên bản' />
                    <MetricMini label='CV mặc định' value='1 bản' />
                    <MetricMini label='Lần cập nhật gần nhất' value='2 ngày trước' />
                  </div>
                </div>
              </SectionCard>

              <SectionCard id='cv-library' title='Thư viện CV' icon={<FileBadge2 className='h-5 w-5' />}>
                <div className='grid gap-4 xl:grid-cols-2'>
                  {cvCards.map((cv) => (
                    <article key={cv.title} className='rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)]'>
                      <div className='flex items-start justify-between gap-3'>
                        <div>
                          <h3 className='text-lg font-semibold text-slate-950'>{cv.title}</h3>
                          <p className='mt-1 text-sm text-slate-500'>{cv.format} • {cv.language}</p>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${cv.status === 'Đang sử dụng' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                          {cv.status}
                        </span>
                      </div>
                      <p className='mt-4 text-sm text-slate-500'>{cv.updatedAt}</p>
                      <div className='mt-5 flex flex-wrap gap-3'>
                        <button type='button' className='rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white'>
                          Xem CV
                        </button>
                        <button type='button' className='rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700'>
                          Đổi tên
                        </button>
                        <button type='button' className='rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700'>
                          Đặt mặc định
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </SectionCard>

              <SectionCard id='cv-checklist' title='Checklist trước khi apply' icon={<Sparkles className='h-5 w-5' />}>
                <div className='grid gap-4 md:grid-cols-2'>
                  {[
                    'Tiêu đề CV bám sát vị trí ứng tuyển',
                    'Phần kỹ năng khớp JD và có mức độ ưu tiên',
                    'Thông tin liên hệ đầy đủ và chính xác',
                    'Project nổi bật có mô tả vai trò rõ ràng'
                  ].map((item) => (
                    <div key={item} className='flex items-start gap-3 rounded-[22px] border border-slate-200 bg-slate-50/70 px-4 py-4'>
                      <span className='mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700'>
                        ✓
                      </span>
                      <p className='text-sm font-medium leading-6 text-slate-700'>{item}</p>
                    </div>
                  ))}
                </div>
              </SectionCard>
            </>
          )}
        </div>

        <aside className='hidden xl:block'>
          <div className='sticky top-24 rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_18px_56px_rgba(15,23,42,0.06)]'>
            <div className='flex items-center gap-3 border-b border-slate-100 pb-4'>
              <div className='flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-sky-500 to-blue-700 text-lg font-semibold text-white'>
                {user?.user_image ? (
                  <img src={user.user_image} alt={user.full_name} className='h-full w-full object-cover' />
                ) : (
                  <span>{(user?.full_name || user?.email || 'U').charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div className='min-w-0'>
                <p className='truncate text-sm font-semibold text-slate-950'>{user?.full_name || 'Job seeker'}</p>
                <p className='mt-1 truncate text-xs text-slate-500'>{user?.email}</p>
              </div>
            </div>

            <div className='mt-5 space-y-5'>
              <div>
                <p className='text-xs font-semibold uppercase tracking-[0.22em] text-sky-600'>
                  {activeTab === 'profile' ? 'Profile' : 'CV Library'}
                </p>
                <nav className='mt-3 space-y-2'>
                  {sectionNav.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className='block rounded-2xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-950'
                    >
                      {section.label}
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

const TabButton = ({
  active,
  children,
  onClick
}: {
  active: boolean
  children: ReactNode
  onClick: () => void
}) => (
  <button
    type='button'
    onClick={onClick}
    className={`rounded-t-2xl border-b-2 px-5 py-3 text-sm font-semibold transition ${
      active ? 'border-sky-500 text-sky-600' : 'border-transparent text-slate-500 hover:text-slate-900'
    }`}
  >
    {children}
  </button>
)

const HeroMetric = ({ icon, label, value }: { icon: ReactNode; label: string; value: string }) => (
  <div className='rounded-[22px] border border-slate-200 bg-slate-50/70 px-4 py-4'>
    <div className='flex items-start gap-3'>
      <div className='mt-0.5 flex h-9 w-9 items-center justify-center rounded-2xl bg-white text-sky-600 shadow-sm'>{icon}</div>
      <div className='min-w-0'>
        <p className='text-xs font-semibold uppercase tracking-[0.18em] text-slate-400'>{label}</p>
        <p className='mt-1 truncate text-sm font-semibold text-slate-900'>{value}</p>
      </div>
    </div>
  </div>
)

const MetricMini = ({ label, value }: { label: string; value: string }) => (
  <div className='rounded-[22px] border border-slate-200 bg-slate-50/70 p-4'>
    <p className='text-xs font-semibold uppercase tracking-[0.18em] text-slate-400'>{label}</p>
    <p className='mt-2 text-sm font-semibold text-slate-900'>{value}</p>
  </div>
)

const ActionTile = ({ title, description, icon }: { title: string; description: string; icon: ReactNode }) => (
  <button type='button' className='flex items-start gap-3 rounded-[22px] border border-slate-200 bg-white p-4 text-left transition hover:border-sky-200 hover:bg-sky-50/50'>
    <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-600'>{icon}</div>
    <div>
      <p className='text-sm font-semibold text-slate-900'>{title}</p>
      <p className='mt-1 text-sm leading-6 text-slate-500'>{description}</p>
    </div>
  </button>
)

const SectionCard = ({ id, title, icon, children }: { id: string; title: string; icon: ReactNode; children: ReactNode }) => (
  <section id={id} className='rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_18px_56px_rgba(15,23,42,0.06)] sm:p-6'>
    <div className='mb-5 flex items-center justify-between gap-4'>
      <div className='flex items-center gap-3'>
        <div className='flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-600'>{icon}</div>
        <h2 className='text-xl font-semibold text-slate-950'>{title}</h2>
      </div>
      <button type='button' className='inline-flex items-center gap-2 rounded-2xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(14,165,233,0.24)]'>
        <Pencil className='h-4 w-4' />
        Chỉnh sửa
      </button>
    </div>
    {children}
  </section>
)

const ProfileRow = ({ label, value }: { label: string; value: string }) => (
  <div className='flex flex-col gap-1 rounded-[20px] border border-slate-200 bg-slate-50/70 px-4 py-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4'>
    <dt className='text-sm font-semibold text-slate-900'>{label}</dt>
    <dd className='text-sm text-slate-600 sm:text-right'>{value}</dd>
  </div>
)

const LinkItem = ({ label, value }: { label: string; value: string }) => (
  <div className='flex items-start justify-between gap-4 rounded-[18px] border border-slate-200 bg-white px-4 py-3'>
    <span className='text-sm font-semibold text-slate-900'>{label}</span>
    <a href={value} target='_blank' rel='noreferrer' className='inline-flex min-w-0 items-center gap-2 text-right text-sm text-sky-600 hover:text-sky-700'>
      <span className='truncate'>{value}</span>
      <ExternalLink className='h-4 w-4 shrink-0' />
    </a>
  </div>
)

const InfoCard = ({ label, value }: { label: string; value: string }) => (
  <div className='rounded-[22px] border border-slate-200 bg-slate-50/70 p-4'>
    <p className='text-xs font-semibold uppercase tracking-[0.18em] text-slate-400'>{label}</p>
    <p className='mt-2 text-sm font-semibold text-slate-900'>{value}</p>
  </div>
)

const BadgeCard = ({ title, meta, accent }: { title: string; meta: string; accent: string }) => {
  const accentClassName =
    accent === 'amber'
      ? 'bg-amber-50 text-amber-700 border-amber-200'
      : accent === 'emerald'
        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
        : 'bg-sky-50 text-sky-700 border-sky-200'

  return (
    <div className={`rounded-[22px] border p-5 ${accentClassName}`}>
      <p className='text-base font-semibold'>{title}</p>
      <p className='mt-2 text-sm'>{meta}</p>
    </div>
  )
}

const TimelineRow = ({ title, meta }: { title: string; meta: string }) => (
  <div className='flex items-start gap-4 rounded-[22px] border border-slate-200 bg-slate-50/70 px-4 py-4'>
    <div className='mt-1 h-3 w-3 shrink-0 rounded-full bg-sky-500' />
    <div className='min-w-0 flex-1'>
      <p className='text-sm font-semibold text-slate-900'>{title}</p>
      <p className='mt-1 text-sm text-slate-500'>{meta}</p>
    </div>
  </div>
)

const formatDate = (date?: string) => {
  if (!date) return 'Chưa cập nhật'

  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) return date

  return parsed.toLocaleDateString('vi-VN')
}

export default ProfilePage
