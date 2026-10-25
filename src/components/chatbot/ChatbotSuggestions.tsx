import type { ChatMode } from '@/@types/chatbot'
import { Briefcase, TrendingUp, FileText, Compass, Sparkles, ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

type SuggestionCategory = {
  icon: typeof Briefcase
  color: string
  titleKey: string
  questionsEn: string[]
  questionsVi: string[]
}

const SUGGESTION_CATEGORIES: SuggestionCategory[] = [
  {
    icon: Briefcase,
    color: 'text-blue-600 bg-blue-50 border-blue-200/50',
    titleKey: 'chatbot.catJobSearch',
    questionsVi: [
      'Tìm việc làm ReactJS tại TP.HCM lương trên 20 triệu',
      'Tuyển dụng lập trình viên Backend (Node.js/Java) tại Hà Nội',
      'Có cơ hội việc làm IT Fresher / Intern nào mới nhất?',
      'Tìm kiếm công việc DevOps hoặc Cloud Engineer hỗ trợ Remote'
    ],
    questionsEn: [
      'Find ReactJS jobs in HCMC with salary over 20M VND',
      'Backend Developer (Node.js/Java) openings in Hanoi',
      'Any recent IT Fresher or Intern job openings?',
      'Search for DevOps or Cloud Engineer roles supporting Remote'
    ]
  },
  {
    icon: TrendingUp,
    color: 'text-emerald-600 bg-emerald-50 border-emerald-200/50',
    titleKey: 'chatbot.catMarketTrends',
    questionsVi: [
      'Mức lương trung bình của Frontend Developer hiện nay?',
      'Kỹ năng công nghệ nào đang được các công ty săn đón nhất?',
      'So sánh nhu cầu tuyển dụng giữa Golang và Java năm 2026',
      'Những chứng chỉ IT nào giúp tăng lợi thế khi xin việc?'
    ],
    questionsEn: [
      'What is the current average salary of a Frontend Developer?',
      'Which tech skills are most sought after by employers?',
      'Compare hiring demand between Golang and Java in 2026',
      'Which IT certifications give the best competitive edge?'
    ]
  },
  {
    icon: FileText,
    color: 'text-violet-600 bg-violet-50 border-violet-200/50',
    titleKey: 'chatbot.catCvOptimization',
    questionsVi: [
      'CV của tôi nên nhấn mạnh kỹ năng gì cho vị trí Fullstack?',
      'Làm thế nào để viết CV xin việc nổi bật cho sinh viên mới ra trường?',
      'Nên chọn CV tiếng Anh hay tiếng Việt khi ứng tuyển công ty IT?',
      'Cách trình bày dự án cá nhân trong CV thu hút nhà tuyển dụng'
    ],
    questionsEn: [
      'What key skills should I emphasize on my CV for Fullstack roles?',
      'How to write a standout resume for a fresh IT graduate?',
      'Should I use an English or Vietnamese CV for tech applications?',
      'How to effectively showcase personal projects on my CV'
    ]
  },
  {
    icon: Compass,
    color: 'text-amber-600 bg-amber-50 border-amber-200/50',
    titleKey: 'chatbot.catCareerPath',
    questionsVi: [
      'Lộ trình phát triển từ Junior lên Senior Fullstack Developer?',
      'Tôi đã thành thạo React & Node.js, nên học gì tiếp theo?',
      'Có nên chuyển hướng từ Manual Tester sang Automation/Dev?',
      'Kỹ sư phần mềm cần chuẩn bị gì để chuyển sang vị trí Tech Lead?'
    ],
    questionsEn: [
      'What is the growth roadmap from Junior to Senior Fullstack Developer?',
      "I've mastered React & Node.js, what should I learn next?",
      'Should I transition from Manual Tester to Automation / Dev?',
      'What should a software engineer prepare to become a Tech Lead?'
    ]
  }
]

interface ChatSuggestionsProps {
  userName?: string
  onSuggestionClick: (question: string) => void
  mode?: ChatMode
}

const ChatSuggestions = ({ userName, onSuggestionClick, mode = 'jobs' }: ChatSuggestionsProps) => {
  const { t, i18n } = useTranslation()
  const isEn = i18n.language.startsWith('en')
  const isCvMode = mode === 'cv'

  return (
    <div className='flex flex-1 flex-col items-center justify-center px-4 py-8 max-w-4xl mx-auto w-full'>
      {/* Hero Greeting */}
      <div className='mb-8 text-center max-w-lg'>
        <div className='inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/20 mb-3.5 ring-4 ring-violet-50'>
          {isCvMode ? <FileText className='h-7 w-7' /> : <Sparkles className='h-7 w-7' />}
        </div>
        <h2 className='text-xl sm:text-2xl font-bold text-slate-900'>
          {isCvMode ? (
            t('chatbot.heroCvTitle')
          ) : (
            <span>
              {t('chatbot.hello', { name: userName || t('chatbot.heroGreetingFallback') })}{' '}
              <span className='inline-block animate-wave'>👋</span>
            </span>
          )}
        </h2>
        <p className='mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed'>
          {isCvMode ? t('chatbot.heroCvSubtitle') : t('chatbot.heroJobsSubtitle')}
        </p>
      </div>

      {isCvMode ? (
        <div className='w-full max-w-2xl rounded-2xl border border-violet-200/80 bg-gradient-to-br from-violet-50/50 via-white to-indigo-50/40 p-6 shadow-xs'>
          <div className='grid gap-3 sm:grid-cols-3'>
            {[
              {
                title: t('chatbot.cvFeatureQuality'),
                desc: t('chatbot.cvFeatureQualityDesc'),
                badge: t('chatbot.cvFeatureQualityBadge')
              },
              {
                title: t('chatbot.cvFeatureGap'),
                desc: t('chatbot.cvFeatureGapDesc'),
                badge: t('chatbot.cvFeatureGapBadge')
              },
              {
                title: t('chatbot.cvFeatureMatch'),
                desc: t('chatbot.cvFeatureMatchDesc'),
                badge: t('chatbot.cvFeatureMatchBadge')
              }
            ].map((item, idx) => (
              <div key={idx} className='rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-xs'>
                <span className='inline-block rounded-md bg-violet-50 px-2 py-0.5 text-[10px] font-bold text-violet-700'>
                  {item.badge}
                </span>
                <p className='mt-2 text-xs font-bold text-slate-800'>{item.title}</p>
                <p className='mt-1 text-[11px] text-slate-500 leading-relaxed'>{item.desc}</p>
              </div>
            ))}
          </div>

          <div className='mt-5 flex items-center gap-2 rounded-xl border border-dashed border-violet-300 bg-white/90 p-3.5 text-xs text-slate-600'>
            <span className='flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-700 font-bold'>
              !
            </span>
            <span>{t('chatbot.cvBannerTip')}</span>
          </div>
        </div>
      ) : (
        <div className='grid w-full grid-cols-1 gap-4 sm:grid-cols-2'>
          {SUGGESTION_CATEGORIES.map((category) => {
            const Icon = category.icon
            const questions = isEn ? category.questionsEn : category.questionsVi

            return (
              <div
                key={category.titleKey}
                className='rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs transition-shadow hover:shadow-md'
              >
                <div className='mb-3 flex items-center gap-2'>
                  <span className={`flex h-7 w-7 items-center justify-center rounded-lg border ${category.color}`}>
                    <Icon className='h-4 w-4' />
                  </span>
                  <h3 className='text-xs font-bold text-slate-800'>{t(category.titleKey)}</h3>
                </div>

                <div className='space-y-1.5'>
                  {questions.map((question: string) => (
                    <button
                      key={question}
                      onClick={() => onSuggestionClick(question)}
                      type='button'
                      className='group flex w-full items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2 text-left text-xs text-slate-700 transition-all hover:border-violet-200 hover:bg-violet-50/70 hover:text-violet-900 active:scale-[0.99]'
                    >
                      <span className='line-clamp-1'>"{question}"</span>
                      <ArrowRight className='h-3 w-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-100 text-violet-600' />
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ChatSuggestions
export { SUGGESTION_CATEGORIES }

