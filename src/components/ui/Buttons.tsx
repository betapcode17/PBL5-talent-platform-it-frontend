import type { ButtonHTMLAttributes, PropsWithChildren } from 'react'
import { cn } from '@/lib/utils'

type ButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> & {
  className?: string
}

export const PrimaryButton = ({ children, className, type = 'button', ...props }: ButtonProps) => {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_25px_-5px_rgba(124,58,237,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_15px_30px_-5px_rgba(124,58,237,0.45)] hover:brightness-105 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export const OutlineButton = ({ children, className, type = 'button', ...props }: ButtonProps) => {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-violet-300 hover:bg-violet-50/60 hover:text-violet-700 hover:shadow-md active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 disabled:pointer-events-none disabled:opacity-60',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export const EmeraldButton = ({ children, className, type = 'button', ...props }: ButtonProps) => {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_25px_-5px_rgba(16,185,129,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-500 hover:shadow-[0_15px_30px_-5px_rgba(16,185,129,0.45)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
