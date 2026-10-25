import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  FileText,
  HelpCircle,
  Lightbulb,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  WandSparkles
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Container from '@/components/ui/Container'

const getResources = (isEn: boolean) => [
  {
    title: isEn ? 'CV Tips' : 'Mẹo viết CV',
    description: isEn
      ? 'Shape a concise technical profile that recruiters can scan quickly.'
      : 'Tạo hồ sơ kỹ thuật ngắn gọn, chuyên nghiệp giúp nhà tuyển dụng quét nhanh.',
    icon: FileText,
    tips: isEn
      ? [
          'Write a concise 3-5 line introduction highlighting your target role.',
          'Place primary skills and core tech stack at the top of your resume.',
          'Describe projects with: role, tech stack, responsibilities, and results.',
          'Highlight concrete metrics and impact (e.g. reduced latency by 35%).',
          'Keep your CV clean and concise within 1-2 pages.'
        ]
      : [
          'Viết phần giới thiệu ngắn 3–5 dòng, nêu rõ vị trí mong muốn.',
          'Đưa kỹ năng quan trọng lên đầu CV.',
          'Mô tả dự án theo: vai trò, công nghệ, chức năng, kết quả.',
          'Ưu tiên số liệu cụ thể nếu có.',
          'Giữ CV gọn trong 1–2 trang.'
        ]
  },
  {
    title: isEn ? 'Interview Prep' : 'Chuẩn bị phỏng vấn',
    description: isEn
      ? 'Practice the questions and signals that matter in modern tech interviews.'
      : 'Rèn luyện các câu hỏi và kỹ năng cốt lõi trong các buổi phỏng vấn công nghệ.',
    icon: ShieldCheck,
    tips: isEn
      ? [
          'Prepare a compelling 60-90 second self-introduction.',
          'Review fundamental computer science and role-specific concepts.',
          'Practice explaining your architectural and coding decisions.',
          'Prepare thoughtful questions to ask the interviewer.',
          'Test camera, microphone, and internet connection before the interview.'
        ]
      : [
          'Chuẩn bị phần giới thiệu bản thân 60–90 giây.',
          'Ôn kiến thức theo vị trí ứng tuyển.',
          'Tập giải thích dự án đã làm.',
          'Chuẩn bị câu hỏi để hỏi nhà tuyển dụng.',
          'Kiểm tra camera, mic và internet trước buổi phỏng vấn.'
        ]
  },
  {
    title: isEn ? 'Salary Guide' : 'Cẩm nang mức lương',
    description: isEn
      ? 'Use market ranges to set better expectations before applying.'
      : 'Tham khảo mặt bằng thị trường để đặt kỳ vọng đãi ngộ phù hợp.',
    icon: Lightbulb,
    tips: isEn
      ? [
          'Determine your target salary range and bottom line.',
          'Research market benchmarks for your tech stack and seniority level.',
          'Evaluate the full package: bonuses, stock options, and flexibility.',
          'Negotiate based on demonstrated impact and skill set.',
          'Avoid committing to a single number before understanding scope.'
        ]
      : [
          'Xác định mức lương mong muốn và mức tối thiểu.',
          'Tìm hiểu mặt bằng lương theo vị trí.',
          'Đánh giá thêm benefit, thưởng và cơ hội học hỏi.',
          'Deal lương dựa trên kỹ năng và giá trị đóng góp.',
          'Không nên đưa con số quá sớm nếu chưa rõ công việc.'
        ]
  }
]

const getChecklist = (isEn: boolean) =>
  isEn
    ? [
        'Resume updated with latest project achievements',
        'Portfolio / GitHub showcases top technical work',
        'Carefully reviewed the target job requirements',
        'Prepared answers for common technical questions'
      ]
    : [
        'CV đã cập nhật thông tin mới nhất',
        'Portfolio/GitHub có dự án nổi bật',
        'Đã đọc kỹ mô tả công việc',
        'Chuẩn bị câu trả lời cho câu hỏi thường gặp'
      ]

const getTimeline = (isEn: boolean) => [
  {
    day: isEn ? 'Day 1' : 'Ngày 1',
    title: isEn ? 'Review Profile' : 'Rà soát hồ sơ',
    description: isEn
      ? 'Audit CV, technical skills, and past engineering accomplishments.'
      : 'Kiểm tra CV, thông tin cá nhân, kỹ năng và kinh nghiệm liên quan.'
  },
  {
    day: isEn ? 'Day 2' : 'Ngày 2',
    title: isEn ? 'Practice Interview' : 'Luyện phỏng vấn',
    description: isEn
      ? 'Rehearse self-intro, system design concepts, and behavioral stories.'
      : 'Luyện giới thiệu bản thân, trình bày dự án và trả lời câu hỏi kỹ thuật.'
  },
  {
    day: isEn ? 'Day 3' : 'Ngày 3',
    title: isEn ? 'Apply & Follow Up' : 'Ứng tuyển & Theo dõi',
    description: isEn
      ? 'Submit applications to vetted positions and prepare polite follow-up messages.'
      : 'Ứng tuyển các vị trí phù hợp và chuẩn bị nội dung follow-up lịch sự.'
  }
]

const getCvTemplate = (isEn: boolean) =>
  isEn
    ? [
        'Contact & Summary',
        'Career Objective',
        'Core Tech Stack',
        'Featured Projects',
        'Work Experience',
        'Education & Certs'
      ]
    : [
        'Thông tin cá nhân',
        'Mục tiêu nghề nghiệp',
        'Kỹ năng chính',
        'Dự án nổi bật',
        'Kinh nghiệm làm việc',
        'Học vấn & chứng chỉ'
      ]

const getFaqs = (isEn: boolean) =>
  isEn
    ? [
        {
          question: 'How long should an engineering CV be?',
          answer: 'For juniors and mid-levels, 1 page is ideal. For senior or staff engineers with 5+ years, 2 pages is standard.'
        },
        {
          question: 'Should I include all past projects on my CV?',
          answer: 'Focus on 2-4 key projects directly relevant to the role you are targeting to maximize readability.'
        },
        {
          question: 'How should I answer questions about weaknesses?',
          answer: 'Choose a genuine growth area that does not compromise core job expectations, and explain steps you took to improve.'
        }
      ]
    : [
        {
          question: 'CV nên dài bao nhiêu?',
          answer: 'Với fresher hoặc junior, CV nên gọn trong 1 trang. Nếu có nhiều kinh nghiệm, có thể dùng 2 trang.'
        },
        {
          question: 'Có nên đưa tất cả dự án vào CV không?',
          answer: 'Không nên. Hãy chọn 2–4 dự án nổi bật, liên quan trực tiếp đến vị trí ứng tuyển.'
        },
        {
          question: 'Khi phỏng vấn nên nói gì về điểm yếu?',
          answer: 'Nên chọn điểm yếu thật nhưng không quá ảnh hưởng đến công việc, kèm cách bạn đang cải thiện.'
        }
      ]

const ResourcesPage = () => {
  const { t, i18n } = useTranslation()
  const isEn = i18n.language === 'en'

  const resources = getResources(isEn)
  const checklist = getChecklist(isEn)
  const timeline = getTimeline(isEn)
  const cvTemplate = getCvTemplate(isEn)
  const faqs = getFaqs(isEn)

  return (
    <div className='min-h-screen bg-[linear-gradient(180deg,#f8f5ff_0%,#ffffff_42%,#f8fafc_100%)] text-slate-950'>
      <Container className='py-12 sm:py-16'>
        <section className='relative overflow-hidden rounded-[38px] border border-violet-100 bg-white/90 p-6 shadow-[0_28px_90px_rgba(124,58,237,0.12)] backdrop-blur sm:p-10'>
          <div className='absolute -right-24 -top-24 h-80 w-80 rounded-full bg-violet-200/50 blur-3xl' />
          <div className='absolute -bottom-24 left-16 h-72 w-72 rounded-full bg-fuchsia-100/80 blur-3xl' />

          <div className='relative grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-center'>
            <div>
              <span className='inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-violet-700'>
                <Sparkles className='h-3.5 w-3.5' />
                {t('resourcesPage.badge')}
              </span>

              <h1 className='mt-5 max-w-3xl text-4xl font-black tracking-[-0.05em] text-slate-950 sm:text-6xl'>
                {t('resourcesPage.title')}
              </h1>

              <p className='mt-5 max-w-2xl text-base leading-7 text-slate-600'>
                {t('resourcesPage.subtitle')}
              </p>

              <div className='mt-7 flex flex-col gap-3 sm:flex-row'>
                <a
                  href='#career-guides'
                  className='inline-flex items-center justify-center gap-2 rounded-2xl bg-violet-700 px-5 py-3 text-sm font-bold text-white shadow-[0_18px_36px_rgba(124,58,237,0.28)] transition hover:bg-violet-800'
                >
                  {isEn ? 'Read Guides' : 'Xem cẩm nang'}
                  <ArrowRight className='h-4 w-4' />
                </a>

                <Link
                  to='/jobs'
                  className='inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-violet-200 hover:text-violet-700'
                >
                  {t('resourcesPage.exploreJobs')}
                </Link>
              </div>
            </div>

            <div className='rounded-[32px] border border-slate-200 bg-slate-50/80 p-5'>
              <div className='rounded-3xl bg-white p-5 shadow-sm'>
                <div className='flex items-center gap-3'>
                  <span className='flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-700'>
                    <WandSparkles className='h-5 w-5' />
                  </span>
                  <div>
                    <p className='text-sm font-bold text-slate-500'>{t('resourcesPage.checklistTitle')}</p>
                    <p className='text-3xl font-black text-slate-950'>86%</p>
                  </div>
                </div>

                <div className='mt-5 h-3 overflow-hidden rounded-full bg-slate-100'>
                  <div className='h-full w-[86%] rounded-full bg-violet-600' />
                </div>

                <div className='mt-5 space-y-3'>
                  {checklist.map((item) => (
                    <div key={item} className='flex items-center gap-3 text-sm font-semibold text-slate-600'>
                      <CheckCircle2 className='h-4 w-4 text-violet-600' />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className='mt-8 grid gap-4 md:grid-cols-3'>
          <div className='rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_16px_42px_rgba(15,23,42,0.05)]'>
            <BriefcaseBusiness className='h-6 w-6 text-violet-700' />
            <p className='mt-4 text-2xl font-black text-slate-950'>120+</p>
            <p className='mt-1 text-sm font-semibold text-slate-500'>{isEn ? 'Job search lessons' : 'Bài học ứng tuyển'}</p>
          </div>

          <div className='rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_16px_42px_rgba(15,23,42,0.05)]'>
            <Target className='h-6 w-6 text-violet-700' />
            <p className='mt-4 text-2xl font-black text-slate-950'>3 {isEn ? 'steps' : 'bước'}</p>
            <p className='mt-1 text-sm font-semibold text-slate-500'>{isEn ? 'Prepare, apply, follow up' : 'Chuẩn bị, ứng tuyển, phản hồi'}</p>
          </div>

          <div className='rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_16px_42px_rgba(15,23,42,0.05)]'>
            <Star className='h-6 w-6 text-violet-700' />
            <p className='mt-4 text-2xl font-black text-slate-950'>{isEn ? 'Better profile' : 'Tối ưu hồ sơ'}</p>
            <p className='mt-1 text-sm font-semibold text-slate-500'>{isEn ? 'Improve CV and interview confidence' : 'Nâng cấp CV và tự tin phỏng vấn'}</p>
          </div>
        </section>

        <section id='career-guides' className='mt-10 grid gap-5 lg:grid-cols-3'>
          {resources.map((resource) => {
            const Icon = resource.icon

            return (
              <article
                key={resource.title}
                className='group rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_16px_42px_rgba(15,23,42,0.05)] transition duration-200 hover:-translate-y-1 hover:border-violet-200 hover:shadow-[0_24px_58px_rgba(124,58,237,0.13)]'
              >
                <span className='flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-700 ring-1 ring-violet-100'>
                  <Icon className='h-5 w-5' />
                </span>

                <h2 className='mt-5 text-xl font-black text-slate-950'>{resource.title}</h2>
                <p className='mt-2 text-sm leading-6 text-slate-500'>{resource.description}</p>

                <div className='mt-5 space-y-3'>
                  {resource.tips.map((tip) => (
                    <div key={tip} className='flex gap-3 rounded-2xl bg-slate-50 p-3'>
                      <CheckCircle2 className='mt-0.5 h-4 w-4 shrink-0 text-violet-600' />
                      <p className='text-sm font-medium leading-6 text-slate-600'>{tip}</p>
                    </div>
                  ))}
                </div>

                <Link to='/jobs' className='mt-6 inline-flex items-center gap-2 text-sm font-bold text-violet-700'>
                  {isEn ? 'Apply this guide' : 'Áp dụng ngay'}
                  <ArrowRight className='h-4 w-4 transition group-hover:translate-x-1' />
                </Link>
              </article>
            )
          })}
        </section>

        <section className='mt-10 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]'>
          <div className='rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]'>
            <div className='flex items-center gap-3'>
              <Clock3 className='h-6 w-6 text-violet-700' />
              <h2 className='text-2xl font-black text-slate-950'>{isEn ? '3-day preparation plan' : 'Kế hoạch 3 ngày chuẩn bị'}</h2>
            </div>

            <div className='mt-6 space-y-4'>
              {timeline.map((item) => (
                <div key={item.day} className='rounded-3xl bg-slate-50 p-4'>
                  <p className='text-xs font-black uppercase tracking-[0.2em] text-violet-600'>{item.day}</p>
                  <h3 className='mt-2 text-base font-black text-slate-950'>{item.title}</h3>
                  <p className='mt-1 text-sm leading-6 text-slate-500'>{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className='rounded-[32px] border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_24px_70px_rgba(15,23,42,0.18)]'>
            <div className='flex items-center gap-3'>
              <MessageSquareText className='h-6 w-6 text-violet-300' />
              <h2 className='text-2xl font-black'>{isEn ? 'CV structure template' : 'Cấu trúc mẫu chuẩn cho CV'}</h2>
            </div>

            <p className='mt-3 text-sm leading-6 text-slate-300'>
              {isEn
                ? 'Use this structured layout to produce a clean, scannable resume tailored for high-growth tech openings.'
                : 'Bạn có thể dùng bố cục này để viết CV rõ ràng, dễ scan và phù hợp với các vị trí công nghệ.'}
            </p>

            <div className='mt-6 grid gap-3 sm:grid-cols-2'>
              {cvTemplate.map((item, index) => (
                <div key={item} className='rounded-2xl border border-white/10 bg-white/5 p-4'>
                  <p className='text-sm font-black text-violet-300'>0{index + 1}</p>
                  <p className='mt-2 text-sm font-bold text-white'>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className='mt-10 rounded-[34px] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]'>
          <div className='flex items-center gap-3'>
            <HelpCircle className='h-6 w-6 text-violet-700' />
            <h2 className='text-2xl font-black text-slate-950'>{isEn ? 'Frequently asked questions' : 'Câu hỏi thường gặp'}</h2>
          </div>

          <div className='mt-6 grid gap-4 md:grid-cols-3'>
            {faqs.map((faq) => (
              <div key={faq.question} className='rounded-3xl bg-slate-50 p-5'>
                <h3 className='text-base font-black text-slate-950'>{faq.question}</h3>
                <p className='mt-2 text-sm leading-6 text-slate-500'>{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section className='mt-10 overflow-hidden rounded-[34px] bg-violet-700 p-6 text-white shadow-[0_24px_70px_rgba(124,58,237,0.28)] sm:p-8'>
          <div className='flex flex-col gap-5 md:flex-row md:items-center md:justify-between'>
            <div>
              <p className='text-sm font-bold uppercase tracking-[0.24em] text-violet-200'>{isEn ? 'Ready to apply?' : 'Sẵn sàng ứng tuyển?'}</p>
              <h2 className='mt-3 text-3xl font-black'>{isEn ? 'Use these guides and find your next opportunity.' : 'Áp dụng cẩm nang và tìm cơ hội việc làm tiếp theo.'}</h2>
            </div>

            <Link
              to='/jobs'
              className='inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-black text-violet-700 transition hover:bg-violet-50'
            >
              {t('home.featured.viewAllJobs')}
              <ArrowRight className='h-4 w-4' />
            </Link>
          </div>
        </section>
      </Container>
    </div>
  )
}

export default ResourcesPage
