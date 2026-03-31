import type { ButtonHTMLAttributes, PropsWithChildren } from 'react'
import { cn } from '../../shared/cn'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-ink text-white hover:bg-slate-900 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ink',
  secondary:
    'bg-white text-ink border border-line hover:bg-paper-soft focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ink',
  ghost: 'text-slate hover:text-ink hover:bg-slate-100',
  danger:
    'bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-rose-300',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
}

export const Button = ({
  children,
  className,
  variant = 'secondary',
  size = 'md',
  type = 'button',
  ...props
}: PropsWithChildren<ButtonProps>) => (
  <button
    type={type}
    className={cn(
      'inline-flex items-center justify-center rounded-lg font-medium transition disabled:cursor-not-allowed disabled:opacity-50',
      sizeClasses[size],
      variantClasses[variant],
      className,
    )}
    {...props}
  >
    {children}
  </button>
)
