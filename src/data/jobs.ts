import type { HeroTag, Job } from '@/types'

export const popularTags: HeroTag[] = [
  { label: 'React' },
  { label: 'Node.js' },
  { label: 'Python AI' },
  { label: 'Golang' },
  { label: 'DevOps' },
  { label: 'Flutter' },
  { label: 'AWS' }
]

export const featuredJobs: Job[] = [
  {
    id: 'senior-java-developer',
    title: 'Senior Java Developer (Core Banking)',
    company: 'VNPay',
    location: 'Ho Chi Minh City',
    badge: 'New',
    badgeTone: 'new',
    salary: '$2,500 - $4,200',
    skills: ['Java', 'Spring Boot', 'Kafka', 'Microservices'],
    logoText: 'VNP',
    logoTone: 'from-blue-600 to-indigo-700'
  },
  {
    id: 'fullstack-engineer-react-node',
    title: 'Fullstack Engineer (React / Node)',
    company: 'FPT Software',
    location: 'Hanoi',
    badge: 'Featured',
    badgeTone: 'featured',
    salary: '$2,000 - $3,500',
    skills: ['React', 'TypeScript', 'Node.js', 'Next.js'],
    logoText: 'FPT',
    logoTone: 'from-orange-500 to-amber-600'
  },
  {
    id: 'ai-research-scientist',
    title: 'AI Research & LLM Scientist',
    company: 'VNG Corporation',
    location: 'Ho Chi Minh City',
    badge: 'Urgent',
    badgeTone: 'featured',
    salary: '$3,200 - $5,800',
    skills: ['Python', 'PyTorch', 'LLMs', 'Vector DB'],
    logoText: 'VNG',
    logoTone: 'from-amber-500 to-orange-600'
  },
  {
    id: 'senior-golang-engineer',
    title: 'Senior Backend Engineer (Golang)',
    company: 'MoMo',
    location: 'Ho Chi Minh City',
    badge: 'Featured',
    badgeTone: 'featured',
    salary: '$2,800 - $4,500',
    skills: ['Golang', 'gRPC', 'Redis', 'PostgreSQL'],
    logoText: 'MOMO',
    logoTone: 'from-pink-600 to-rose-600'
  },
  {
    id: 'lead-devops-cloud-architect',
    title: 'Lead DevOps & Cloud Architect',
    company: 'Viettel Digital',
    location: 'Hanoi',
    badge: 'Hot Salary',
    badgeTone: 'new',
    salary: '$3,000 - $5,000',
    skills: ['Kubernetes', 'AWS', 'Terraform', 'CI/CD'],
    logoText: 'VTL',
    logoTone: 'from-red-600 to-rose-700'
  },
  {
    id: 'lead-frontend-engineer',
    title: 'Lead Frontend Architect (Design Systems)',
    company: 'VinAI Research',
    location: 'Da Nang / Remote',
    badge: 'Remote',
    badgeTone: 'new',
    salary: '$2,600 - $4,200',
    skills: ['React 19', 'Tailwind', 'Web Vitals', 'TypeScript'],
    logoText: 'VIN',
    logoTone: 'from-violet-600 to-indigo-700'
  }
]

