import { useId } from 'react'
import type { InputHTMLAttributes } from 'react'
import { cn } from '../../shared/cn'

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  hint?: string
}

export const InputField = ({ label, hint, className, ...props }: InputFieldProps) => {
  const id = useId()

  return (
    <label htmlFor={id} className="flex w-full flex-col gap-2">
      <span className="text-xs font-semibold uppercase tracking-[0.08em] text-slate">
        {label}
      </span>
      <input
        id={id}
        className={cn(
          'h-10 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink outline-none transition placeholder:text-slate/70 focus:border-slate-400 focus:ring-2 focus:ring-slate-100',
          className,
        )}
        {...props}
      />
      {hint ? <span className="text-xs text-slate">{hint}</span> : null}
    </label>
  )
}
