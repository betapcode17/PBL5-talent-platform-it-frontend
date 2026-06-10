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

import Container from '@/components/ui/Container'

const resources = [
  {
    title: 'CV tips',
    description: 'Shape a concise technical profile that recruiters can scan quickly.',
    icon: FileText,
    tips: [
      'Viết phần giới thiệu ngắn 3–5 dòng, nêu rõ vị trí mong muốn.',
      'Đưa kỹ năng quan trọng lên đầu CV.',
      'Mô tả dự án theo: vai trò, công nghệ, chức năng, kết quả.',
      'Ưu tiên số liệu cụ thể nếu có.',
      'Giữ CV gọn trong 1–2 trang.'
    ]
  },
  {
    title: 'Interview prep',
    description: 'Practice the questions and signals that matter in modern tech interviews.',
    icon: ShieldCheck,
    tips: [
      'Chuẩn bị phần giới thiệu bản thân 60–90 giây.',
      'Ôn kiến thức theo vị trí ứng tuyển.',
      'Tập giải thích dự án đã làm.',
      'Chuẩn bị câu hỏi để hỏi nhà tuyển dụng.',
      'Kiểm tra camera, mic và internet trước buổi phỏng vấn.'
    ]
  },
  {
    title: 'Salary guide',
    description: 'Use market ranges to set better expectations before applying.',
    icon: Lightbulb,
    tips: [
      'Xác định mức lương mong muốn và mức tối thiểu.',
      'Tìm hiểu mặt bằng lương theo vị trí.',
      'Đánh giá thêm benefit, thưởng và cơ hội học hỏi.',
      'Deal lương dựa trên kỹ năng và giá trị đóng góp.',
      'Không nên đưa con số quá sớm nếu chưa rõ công việc.'
    ]
  }
]

const checklist = [
  'CV đã cập nhật thông tin mới nhất',
  'Portfolio/GitHub có dự án nổi bật',
  'Đã đọc kỹ mô tả công việc',
  'Chuẩn bị câu trả lời cho câu hỏi thường gặp'
]

const timeline = [
  {
    day: 'Day 1',
    title: 'Review profile',
    description: 'Kiểm tra CV, thông tin cá nhân, kỹ năng và kinh nghiệm liên quan.'
  },
  {
    day: 'Day 2',
    title: 'Practice interview',
    description: 'Luyện giới thiệu bản thân, trình bày dự án và trả lời câu hỏi kỹ thuật.'
  },
  {
    day: 'Day 3',
    title: 'Apply & follow up',
    description: 'Ứng tuyển các vị trí phù hợp và chuẩn bị nội dung follow-up lịch sự.'
  }
]

const cvTemplate = [
  'Thông tin cá nhân',
  'Mục tiêu nghề nghiệp',
  'Kỹ năng chính',
  'Dự án nổi bật',
  'Kinh nghiệm làm việc',
  'Học vấn & chứng chỉ'
]

const faqs = [
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
                Resources
              </span>

              <h1 className='mt-5 max-w-3xl text-4xl font-black tracking-[-0.05em] text-slate-950 sm:text-6xl'>
                Career resources for a better job search
              </h1>

              <p className='mt-5 max-w-2xl text-base leading-7 text-slate-600'>
                Tổng hợp hướng dẫn viết CV, chuẩn bị phỏng vấn, deal lương và xây dựng hồ sơ ứng tuyển chuyên nghiệp
                hơn.
              </p>

              <div className='mt-7 flex flex-col gap-3 sm:flex-row'>
                <a
                  href='#career-guides'
                  className='inline-flex items-center justify-center gap-2 rounded-2xl bg-violet-700 px-5 py-3 text-sm font-bold text-white shadow-[0_18px_36px_rgba(124,58,237,0.28)] transition hover:bg-violet-800'
                >
                  Read guides
                  <ArrowRight className='h-4 w-4' />
                </a>

                <Link
                  to='/jobs'
                  className='inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-violet-200 hover:text-violet-700'
                >
                  Find jobs
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
                    <p className='text-sm font-bold text-slate-500'>Job search readiness</p>
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
            <p className='mt-1 text-sm font-semibold text-slate-500'>Job search lessons</p>
          </div>

          <div className='rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_16px_42px_rgba(15,23,42,0.05)]'>
            <Target className='h-6 w-6 text-violet-700' />
            <p className='mt-4 text-2xl font-black text-slate-950'>3 steps</p>
            <p className='mt-1 text-sm font-semibold text-slate-500'>Prepare, apply, follow up</p>
          </div>

          <div className='rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_16px_42px_rgba(15,23,42,0.05)]'>
            <Star className='h-6 w-6 text-violet-700' />
            <p className='mt-4 text-2xl font-black text-slate-950'>Better profile</p>
            <p className='mt-1 text-sm font-semibold text-slate-500'>Improve CV and interview confidence</p>
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
                  Apply this guide
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
              <h2 className='text-2xl font-black text-slate-950'>3-day preparation plan</h2>
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
              <h2 className='text-2xl font-black'>CV structure template</h2>
            </div>

            <p className='mt-3 text-sm leading-6 text-slate-300'>
              Bạn có thể dùng bố cục này để viết CV rõ ràng, dễ scan và phù hợp với các vị trí công nghệ.
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
            <h2 className='text-2xl font-black text-slate-950'>Frequently asked questions</h2>
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
              <p className='text-sm font-bold uppercase tracking-[0.24em] text-violet-200'>Ready to apply?</p>
              <h2 className='mt-3 text-3xl font-black'>Use these guides and find your next opportunity.</h2>
            </div>

            <Link
              to='/jobs'
              className='inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-black text-violet-700 transition hover:bg-violet-50'
            >
              Browse jobs
              <ArrowRight className='h-4 w-4' />
            </Link>
          </div>
        </section>
      </Container>
    </div>
  )
}

export default ResourcesPage
