import {
  BarChart3,
  BrainCircuit,
  Cloud,
  Code2,
  Database,
  Layers,
  ShieldCheck,
  Smartphone
} from 'lucide-react'
import type { Category } from '@/types'

export const categories: Category[] = [
  {
    id: 'frontend',
    title: 'Frontend',
    openRoles: '140+ Open Positions',
    icon: Code2
  },
  {
    id: 'backend',
    title: 'Backend',
    openRoles: '260+ Open Positions',
    icon: Database
  },
  {
    id: 'fullstack',
    title: 'Fullstack',
    openRoles: '190+ Open Positions',
    icon: Layers
  },
  {
    id: 'ai-ml',
    title: 'AI & Machine Learning',
    openRoles: '95+ Open Positions',
    icon: BrainCircuit
  },
  {
    id: 'mobile',
    title: 'Mobile (iOS & Android)',
    openRoles: '110+ Open Positions',
    icon: Smartphone
  },
  {
    id: 'devops-cloud',
    title: 'DevOps & Cloud',
    openRoles: '135+ Open Positions',
    icon: Cloud
  },
  {
    id: 'data-engineering',
    title: 'Data & Analytics',
    openRoles: '80+ Open Positions',
    icon: BarChart3
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity',
    openRoles: '45+ Open Positions',
    icon: ShieldCheck
  }
]

