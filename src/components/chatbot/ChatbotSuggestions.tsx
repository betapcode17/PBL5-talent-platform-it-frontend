import type { ChatMode } from '@/@types/chatbot'

type SuggestionCategory = {
  icon: string
  title: string
  questions: string[]
}

const SUGGESTION_CATEGORIES: SuggestionCategory[] = [
  {
    icon: '🔍',
    title: 'Job Search',
    questions: [
      'Find Java jobs in Ho Chi Minh City',
      'Any remote positions for DevOps?',
      'Jobs with salary over 30 million in Da Nang?',
      'Where are Senior Python Developer openings?'
    ]
  },
  {
    icon: '📊',
    title: 'Market Analysis',
    questions: [
      'What programming languages are hottest right now?',
      'Average salary for Frontend Developer?',
      'Compare Java vs Python in the VN market?',
      'IT recruitment trends in 2026?'
    ]
  },
  {
    icon: '📄',
    title: 'CV Advice',
    questions: [
      'What is my CV missing for a Backend role?',
      'How to write a CV for IT freshers?',
      'Which skills should I highlight in my CV?',
      'English or Vietnamese CV — which is better?'
    ]
  },
  {
    icon: '🎯',
    title: 'Career Advice',
    questions: [
      'I know Python, what should I learn next?',
      'Roadmap from Junior to Senior Developer?',
      'Fullstack or specialized Backend?',
      'Should I switch from Tester to Dev?'
    ]
  }
]

interface ChatSuggestionsProps {
  userName?: string
  onSuggestionClick: (question: string) => void
  mode?: ChatMode
}

const ChatSuggestions = ({ userName, onSuggestionClick, mode = 'jobs' }: ChatSuggestionsProps) => {
  const isCvMode = mode === 'cv'

  return (
    <div className='flex flex-1 flex-col items-center justify-center px-4 py-8'>
      {/* Greeting */}
      <div className='mb-8 text-center'>
        <div className='mb-4 text-5xl'>{isCvMode ? '📄' : '👋'}</div>
        <h2 className='text-2xl font-bold text-slate-800'>
          {isCvMode ? 'Upload your CV to get instant analysis' : `Hi ${userName || 'there'}!`}{' '}
          <span className='text-3xl'>{isCvMode ? '✨' : '👋'}</span>
        </h2>
        <p className='mt-2 text-slate-500'>
          {isCvMode
            ? 'Switch to CV analysis, upload a PDF, and see strengths, gaps, and what to learn next.'
            : "I'm your AI Assistant. How can I help you today with your IT career journey?"}
        </p>
      </div>

      {isCvMode ? (
        <div className='w-full max-w-2xl rounded-2xl border border-purple-100 bg-gradient-to-br from-white to-purple-50 p-6 shadow-sm'>
          <div className='grid gap-4 md:grid-cols-3'>
            {[
              ['Điểm mạnh', 'Tự động tóm tắt thế mạnh của CV'],
              ['Điểm yếu', 'Chỉ ra phần nên cải thiện rõ ràng'],
              ['Nên học gì', 'Gợi ý skill dựa trên job data']
            ].map(([title, desc]) => (
              <div key={title} className='rounded-xl border border-slate-200 bg-white p-4'>
                <p className='text-sm font-semibold text-slate-800'>{title}</p>
                <p className='mt-1 text-sm text-slate-500'>{desc}</p>
              </div>
            ))}
          </div>
          <div className='mt-6 rounded-xl border border-dashed border-purple-200 bg-white/80 p-4 text-sm text-slate-600'>
            Nhấn nút <span className='font-semibold text-purple-700'>Phân tích CV</span> ở khung nhập phía dưới để tải
            file PDF.
          </div>
        </div>
      ) : (
        <div className='grid w-full max-w-3xl grid-cols-1 gap-6 md:grid-cols-2'>
          {SUGGESTION_CATEGORIES.map((category) => (
            <div key={category.title}>
              <h3 className='mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700'>
                <span>{category.icon}</span>
                {category.title}
              </h3>
              <div className='space-y-2'>
                {category.questions.map((question: string) => (
                  <button
                    key={question}
                    onClick={() => onSuggestionClick(question)}
                    className='w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-left text-sm text-slate-600 transition-all hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700'
                  >
                    "{question}"
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ChatSuggestions
export { SUGGESTION_CATEGORIES }
