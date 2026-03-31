import type { PropsWithChildren } from 'react'
import { cn } from '../../shared/cn'

interface CardProps {
  className?: string
}

export const Card = ({ children, className }: PropsWithChildren<CardProps>) => (
  <section
    className={cn(
      'rounded-xl border border-line bg-paper p-4 shadow-panel sm:p-5',
      className,
    )}
  >
    {children}
  </section>
)
