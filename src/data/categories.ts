import { BrainCircuit, Code2, Database, Smartphone } from 'lucide-react'
import type { Category } from '@/types'

export const categories: Category[] = [
  {
    id: 'frontend',
    title: 'Frontend',
    openRolesCount: 120,
    icon: Code2
  },
  {
    id: 'backend',
    title: 'Backend',
    openRolesCount: 250,
    icon: Database
  },
  {
    id: 'ai-ml',
    title: 'AI & ML',
    openRolesCount: 85,
    icon: BrainCircuit
  },
  {
    id: 'mobile',
    title: 'Mobile Dev',
    openRolesCount: 110,
    icon: Smartphone
  }
]
