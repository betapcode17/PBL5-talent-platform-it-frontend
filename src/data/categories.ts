import { BrainCircuit, Code2, Database, Smartphone } from 'lucide-react'
import type { Category } from '@/types'

export const categories: Category[] = [
  {
    id: 'frontend',
    title: 'Frontend',
    openRoles: '120+ Open Positions',
    icon: Code2
  },
  {
    id: 'backend',
    title: 'Backend',
    openRoles: '250+ Open Positions',
    icon: Database
  },
  {
    id: 'ai-ml',
    title: 'AI & ML',
    openRoles: '85+ Open Positions',
    icon: BrainCircuit
  },
  {
    id: 'mobile',
    title: 'Mobile Dev',
    openRoles: '110+ Open Positions',
    icon: Smartphone
  }
]
