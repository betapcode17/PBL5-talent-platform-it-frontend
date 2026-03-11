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
}

const ChatSuggestions = ({ userName, onSuggestionClick }: ChatSuggestionsProps) => {
  return (
    <div className='flex flex-1 flex-col items-center justify-center px-4 py-8'>
      {/* Greeting */}
      <div className='mb-8 text-center'>
        <div className='mb-4 text-5xl'>👋</div>
        <h2 className='text-2xl font-bold text-slate-800'>
          Hi {userName || 'there'}! <span className='text-3xl'>👋</span>
        </h2>
        <p className='mt-2 text-slate-500'>
          I'm your AI Assistant. How can I help you today with your IT career journey?
        </p>
      </div>

      {/* Suggestions Grid */}
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
    </div>
  )
}

export default ChatSuggestions
export { SUGGESTION_CATEGORIES }
