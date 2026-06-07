import type { ReactNode } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { toPng } from 'html-to-image'
import jsPDF from 'jspdf'
import { CalendarDays, Download, Mail, MapPin, Phone, Printer, UserRound } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'

import { getCvDetailApi } from '@/api/cv'
import { useAuthStore } from '@/store/authStore'

const CvPdfExportPage = () => {
  const user = useAuthStore((state) => state.user)
  const [searchParams] = useSearchParams()
  const shouldAutoPrint = searchParams.get('print') === '1'
  const didPrint = useRef(false)
  const exportContentRef = useRef<HTMLDivElement | null>(null)
  const [isExportingPdf, setIsExportingPdf] = useState(false)

  const { data: cvDetail, isLoading } = useQuery({
    queryKey: ['seeker', 'cv', 'styled-export', user?.id],
    queryFn: () => getCvDetailApi(user!.id),
    enabled: Boolean(user?.id)
  })

  const defaultSubtitle = useMemo(() => inferHeadline(cvDetail?.experiences?.[0]?.position), [cvDetail])
  const [customSubtitle, setCustomSubtitle] = useState('')

  useEffect(() => {
    if (!defaultSubtitle || customSubtitle.trim()) return

    setCustomSubtitle(defaultSubtitle)
  }, [defaultSubtitle, customSubtitle])

  useEffect(() => {
    if (!cvDetail || !shouldAutoPrint || didPrint.current) return

    didPrint.current = true
    const timer = window.setTimeout(() => {
      void handleExportPdf()
    }, 300)

    return () => window.clearTimeout(timer)
  }, [cvDetail, shouldAutoPrint])

  const handleExportPdf = async () => {
    if (!exportContentRef.current || isExportingPdf) return

    setIsExportingPdf(true)

    try {
      const node = exportContentRef.current
      const imageData = await toPng(node, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#efefef',
        canvasWidth: node.scrollWidth * 2,
        canvasHeight: node.scrollHeight * 2,
        width: node.scrollWidth,
        height: node.scrollHeight
      })

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      })

      const pageWidth = 210
      const pageHeight = 297
      const imageWidth = pageWidth
      const imageHeight = (node.scrollHeight * imageWidth) / node.scrollWidth
      let heightLeft = imageHeight
      let position = 0

      pdf.addImage(imageData, 'PNG', 0, position, imageWidth, imageHeight, undefined, 'FAST')
      heightLeft -= pageHeight

      while (heightLeft > 0) {
        position = heightLeft - imageHeight
        pdf.addPage('a4', 'portrait')
        pdf.addImage(imageData, 'PNG', 0, position, imageWidth, imageHeight, undefined, 'FAST')
        heightLeft -= pageHeight
      }

      const safeName = (user!.full_name || cvDetail?.seeker.fullName || 'CV')
        .trim()
        .replace(/[<>:"/\\|?*\x00-\x1F]/g, '')
        .replace(/\s+/g, ' ')

      pdf.save(`${safeName || 'CV'} - IT JOB VN.pdf`)
    } catch (error) {
      console.error('Export PDF failed', error)
      window.alert('Khong the xuat PDF luc nay. Vui long thu lai.')
    } finally {
      setIsExportingPdf(false)
    }
  }

  if (!user) {
    return (
      <div className='min-h-screen bg-[#f5f5f5] px-4 py-10'>
        <div className='mx-auto max-w-3xl rounded-sm border border-slate-200 bg-white p-8 text-center'>
          <p className='text-lg font-semibold text-slate-900'>Khong tim thay thong tin seeker de xuat CV.</p>
          <Link to='/login' className='mt-4 inline-flex rounded-sm bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white'>
            Dang nhap lai
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-[#efefef] print:bg-white'>
      <style>{`
        @page {
          size: A4;
          margin: 0;
        }

        html,
        body {
          margin: 0;
          padding: 0;
        }

        @media print {
          body {
            background: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .print-hidden {
            display: none !important;
          }

          .cv-shell {
            max-width: none !important;
            padding: 0 !important;
            margin: 0 !important;
          }

          .cv-page {
            box-shadow: none !important;
            margin: 0 !important;
            width: auto !important;
            min-height: 0 !important;
            padding: 8mm !important;
            box-sizing: border-box !important;
            page-break-after: auto;
            break-after: auto;
            overflow: visible !important;
          }

          .avoid-break {
            break-inside: avoid;
            page-break-inside: avoid;
          }
        }
      `}</style>

      <div className='print-hidden border-b border-slate-200 bg-white'>
        <div className='mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4'>
          <div>
            <p className='text-xs font-semibold uppercase tracking-[0.2em] text-slate-500'>CV Export</p>
            <h1 className='mt-1 text-xl font-semibold text-slate-950'>Mau CV theo bo cuc ho so chuyen nghiep</h1>
          </div>
          <div className='flex flex-wrap gap-3'>
            <Link to='/seeker/profile' className='inline-flex h-11 items-center rounded-sm border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700'>
              Quay lai ho so
            </Link>
            <button
              type='button'
              onClick={() => void handleExportPdf()}
              disabled={isExportingPdf}
              className='inline-flex h-11 items-center gap-2 rounded-sm bg-slate-900 px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60'
            >
              <Download className='h-4 w-4' />
              {isExportingPdf ? 'Dang xuat PDF...' : 'Xuat PDF'}
            </button>
            <button type='button' onClick={() => window.print()} className='inline-flex h-11 items-center gap-2 rounded-sm border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700'>
              <Printer className='h-4 w-4' />
              In thu
            </button>
          </div>
        </div>
      </div>

      <main className='cv-shell mx-auto max-w-5xl px-4 py-8'>
        <div className='print-hidden mx-auto mb-6 w-full max-w-[210mm] rounded-sm border border-slate-200 bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.06)]'>
          <p className='text-sm font-semibold text-slate-900'>Kiem tra truoc khi xuat PDF</p>
          <p className='mt-1 text-sm leading-6 text-slate-600'>Ban co the nhap them 1 dong phu duoi ten, vi du: Software Engineer. Dong nay chi ap dung cho ban PDF dang xuat.</p>
          <label className='mt-4 block'>
            <span className='text-xs font-semibold uppercase tracking-[0.16em] text-slate-400'>Dong phu duoi ten</span>
            <input
              type='text'
              value={customSubtitle}
              onChange={(event) => setCustomSubtitle(event.target.value)}
              placeholder='Vi du: Software Engineer'
              className='mt-2 h-11 w-full rounded-sm border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-slate-500'
            />
          </label>
        </div>

        <div ref={exportContentRef} className='mx-auto w-full max-w-[210mm] space-y-3'>
          <section className='cv-page overflow-hidden bg-white p-[8mm] shadow-[0_24px_70px_rgba(15,23,42,0.08)]'>
            <header className='avoid-break'>
              <div className='grid gap-5 md:grid-cols-[150px_minmax(0,1fr)] md:items-center'>
                <div className='flex h-[170px] w-full items-center justify-center overflow-hidden border border-slate-200 bg-slate-100'>
                  {user.user_image ? (
                    <img src={user.user_image} alt={user.full_name} className='h-full w-full object-cover' />
                  ) : (
                    <div className='flex h-full w-full items-center justify-center bg-slate-200 text-slate-500'>
                      <UserRound className='h-16 w-16' />
                    </div>
                  )}
                </div>

                <div className='min-w-0 text-center'>
                  <h1 className='text-[38px] font-bold text-[#cf2e2e]'>{user.full_name || cvDetail?.seeker.fullName || 'Seeker'}</h1>
                  {customSubtitle.trim() ? <p className='mt-2 text-[22px] font-semibold text-slate-900'>{customSubtitle.trim()}</p> : null}
                  <div className='mx-auto mt-3 h-[2px] w-full max-w-[680px] bg-slate-800' />
                </div>
              </div>
            </header>

            <section className='avoid-break mt-5 grid gap-4 md:grid-cols-3'>
              <TopBox title='Thong tin ca nhan'>
                <InfoLine icon={<CalendarDays className='h-4 w-4' />} text={formatDate(user.registration_date) || 'Chua cap nhat ngay tham gia'} />
                <InfoLine icon={<Mail className='h-4 w-4' />} text={user.email || cvDetail?.seeker.email || 'Chua cap nhat email'} />
                <InfoLine icon={<Phone className='h-4 w-4' />} text={user.phone || 'Chua cap nhat so dien thoai'} />
                <InfoLine icon={<UserRound className='h-4 w-4' />} text={user.gender || 'Chua cap nhat gioi tinh'} />
                <InfoLine icon={<MapPin className='h-4 w-4' />} text={`Seeker ID: SEEKER-${user.id}`} />
              </TopBox>

              <TopBox title='Hoc van'>
                <CompactList
                  items={
                    cvDetail?.educations?.map((item) => ({
                      title: item.school,
                      subtitle: [item.degree, item.major].filter(Boolean).join(' | ') || undefined,
                      meta: formatRange(item.startDate, item.endDate),
                      detail: item.description || undefined
                    })) ?? []
                  }
                  emptyText='Chua co du lieu hoc van.'
                />
              </TopBox>

              <TopBox title='Chung chi'>
                <CompactList
                  items={
                    cvDetail?.certificates?.map((item) => ({
                      title: item.issuedDate ? formatDate(item.issuedDate) : 'Chua cap nhat ngay',
                      subtitle: item.title,
                      detail: item.issuer || undefined
                    })) ?? []
                  }
                  emptyText='Chua co du lieu chung chi.'
                />
              </TopBox>
            </section>

            <MainSection title='Kinh nghiem lam viec' className='mt-6'>
              <TimelineList
                items={
                  cvDetail?.experiences?.map((item) => ({
                    leftTop: formatRange(item.startDate, item.endDate),
                    leftBottom: item.company,
                    rightTitle: item.position,
                    rightDescription: item.description || 'Chua co mo ta kinh nghiem.'
                  })) ?? []
                }
                emptyText='Chua co du lieu kinh nghiem lam viec.'
              />
            </MainSection>
          </section>

          <section className='cv-page overflow-hidden bg-white p-[8mm] shadow-[0_24px_70px_rgba(15,23,42,0.08)]'>
            <section className='grid gap-5 md:grid-cols-2'>
              <MainSection title='Ky nang'>
                <SkillNarrativeList skills={cvDetail?.skills ?? []} />
              </MainSection>

              <div className='space-y-8'>
                <MainSection title='Du an'>
                  <CompactList
                    items={
                      cvDetail?.projects?.map((item) => ({
                        title: formatRange(item.startDate, item.endDate) || 'Du an',
                        subtitle: item.name,
                        meta: [item.role, item.link].filter(Boolean).join(' | ') || undefined,
                        detail: item.description || undefined
                      })) ?? []
                    }
                    emptyText='Chua co du lieu du an.'
                  />
                </MainSection>

                <MainSection title='Mo ta bo sung'>
                  <CompactList
                    items={
                      cvDetail?.personalities?.map((item) => ({
                        title: item.type,
                        detail: item.description || undefined
                      })) ?? []
                    }
                    emptyText='Chua co du lieu mo ta bo sung.'
                  />
                </MainSection>
              </div>
            </section>
          </section>
        </div>

        <div className='print-hidden mt-6 flex justify-center'>
          <button
            type='button'
            onClick={() => void handleExportPdf()}
            disabled={isExportingPdf}
            className='inline-flex h-11 items-center gap-2 rounded-sm bg-slate-900 px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60'
          >
            <Download className='h-4 w-4' />
            {isExportingPdf ? 'Dang xuat PDF...' : 'Tai PDF'}
          </button>
        </div>

        {isLoading ? (
          <div className='print-hidden mx-auto mt-4 max-w-[210mm] rounded-sm border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600'>
            Dang tai du lieu CV...
          </div>
        ) : null}
      </main>
    </div>
  )
}

const TopBox = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className='avoid-break'>
    <SectionTitle title={title} />
    <div className='mt-2.5 space-y-2.5'>{children}</div>
  </section>
)

const MainSection = ({ title, children, className = '' }: { title: string; children: ReactNode; className?: string }) => (
  <section className={`avoid-break ${className}`}>
    <SectionTitle title={title} />
    <div className='mt-3'>{children}</div>
  </section>
)

const SectionTitle = ({ title }: { title: string }) => (
  <div>
    <div className='h-[2px] bg-[#cf2e2e]' />
    <h2 className='mt-2 text-[14px] font-bold uppercase tracking-[0.04em] text-slate-950'>{title}</h2>
    <div className='mt-2 h-[1px] bg-[#cf2e2e]' />
  </div>
)

const InfoLine = ({ icon, text }: { icon: ReactNode; text: string }) => (
  <div className='flex items-start gap-3 text-[14px] leading-6 text-slate-800'>
    <div className='mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#cf2e2e] text-white'>{icon}</div>
    <span>{text}</span>
  </div>
)

const CompactList = ({
  items,
  emptyText
}: {
  items: Array<{
    title: string
    subtitle?: string
    meta?: string
    detail?: string
  }>
  emptyText: string
}) => {
  if (items.length === 0) {
    return <p className='text-[14px] leading-6 text-slate-500'>{emptyText}</p>
  }

  return (
    <div className='space-y-3'>
      {items.map((item, index) => (
        <article key={`${item.title}-${index}`} className='avoid-break text-[14px] leading-6 text-slate-800'>
          <p className='font-bold text-slate-950'>{item.title}</p>
          {item.subtitle ? <p className='mt-1 font-semibold'>{item.subtitle}</p> : null}
          {item.meta ? <p className='mt-1'>{item.meta}</p> : null}
          {item.detail ? <p className='mt-1 whitespace-pre-wrap'>{item.detail}</p> : null}
        </article>
      ))}
    </div>
  )
}

const TimelineList = ({
  items,
  emptyText
}: {
  items: Array<{
    leftTop: string
    leftBottom?: string
    rightTitle: string
    rightDescription?: string
  }>
  emptyText: string
}) => {
  if (items.length === 0) {
    return <p className='text-[14px] leading-6 text-slate-500'>{emptyText}</p>
  }

  return (
    <div className='space-y-4'>
      {items.map((item, index) => (
        <article key={`${item.rightTitle}-${index}`} className='avoid-break grid gap-4 md:grid-cols-[180px_16px_minmax(0,1fr)]'>
          <div className='text-[14px] leading-6 text-slate-900'>
            <p className='font-semibold'>{item.leftTop}</p>
            {item.leftBottom ? <p className='mt-1 font-bold'>{item.leftBottom}</p> : null}
          </div>
          <div className='relative hidden md:block'>
            <div className='absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-slate-400' />
            <div className='absolute left-1/2 top-1.5 h-3 w-3 -translate-x-1/2 rounded-full bg-[#cf2e2e]' />
          </div>
          <div>
            <p className='text-[15px] font-bold text-slate-950'>{item.rightTitle}</p>
            {item.rightDescription ? <p className='mt-2 whitespace-pre-wrap text-[14px] leading-7 text-slate-800'>{item.rightDescription}</p> : null}
          </div>
        </article>
      ))}
    </div>
  )
}

const SkillNarrativeList = ({
  skills
}: {
  skills: Array<{
    name: string
    category?: string | null
    experienceMonths?: number | null
    isStrong?: boolean
  }>
}) => {
  if (skills.length === 0) {
    return <p className='text-[14px] leading-6 text-slate-500'>Chua co du lieu ky nang.</p>
  }

  const grouped = groupSkillsByCategory(skills)

  return (
    <div className='space-y-4'>
      {grouped.map((group) => (
        <article key={group.category} className='avoid-break'>
          <h3 className='text-[16px] font-bold uppercase text-slate-950'>{group.category}</h3>
          <div className='mt-2 space-y-2'>
            {group.skills.map((skill) => (
              <div key={`${group.category}-${skill.name}`} className='text-[14px] leading-7 text-slate-800'>
                <p className='font-semibold'>{skill.name}</p>
                <p>
                  {[skill.experienceMonths !== null && skill.experienceMonths !== undefined ? `${skill.experienceMonths} thang kinh nghiem` : undefined, skill.isStrong ? 'Ky nang manh' : undefined]
                    .filter(Boolean)
                    .join(' | ') || 'Da duoc them vao ho so ky nang.'}
                </p>
              </div>
            ))}
          </div>
        </article>
      ))}
    </div>
  )
}

const inferHeadline = (position?: string | null) => position || 'Ung vien cong nghe thong tin'

const formatDate = (date?: string | null) => {
  if (!date) return ''

  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) return date

  return parsed.toLocaleDateString('vi-VN')
}

const formatRange = (start?: string | null, end?: string | null) => {
  if (!start && !end) return ''

  return `${formatDate(start) || 'Chua cap nhat'} - ${formatDate(end) || 'Hien tai'}`
}

const groupSkillsByCategory = (skills: Array<{ name: string; category?: string | null; experienceMonths?: number | null; isStrong?: boolean }>) => {
  const labels: Record<string, string> = {
    programming_language: 'Ngon ngu lap trinh',
    framework: 'Framework',
    os: 'He dieu hanh',
    database: 'Co so du lieu',
    version_control: 'Quan ly phien ban',
    development_tool: 'Cong cu phat trien',
    platform: 'Nen tang'
  }

  const grouped = new Map<string, typeof skills>()

  skills.forEach((skill) => {
    const key = labels[skill.category ?? ''] ?? 'Ky nang khac'
    grouped.set(key, [...(grouped.get(key) ?? []), skill])
  })

  return Array.from(grouped.entries()).map(([category, groupedSkills]) => ({
    category,
    skills: groupedSkills
  }))
}

export default CvPdfExportPage
