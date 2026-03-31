import { useId } from 'react'
import type { TextareaHTMLAttributes } from 'react'
import { cn } from '../../shared/cn'

interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  hint?: string
}

export const TextAreaField = ({
  label,
  hint,
  className,
  rows = 4,
  ...props
}: TextAreaFieldProps) => {
  const id = useId()

  return (
    <label htmlFor={id} className="flex w-full flex-col gap-2">
      <span className="text-xs font-semibold uppercase tracking-[0.08em] text-slate">
        {label}
      </span>
      <textarea
        id={id}
        rows={rows}
        className={cn(
          'w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none transition placeholder:text-slate/70 focus:border-slate-400 focus:ring-2 focus:ring-slate-100',
          className,
        )}
        {...props}
      />
      {hint ? <span className="text-xs text-slate">{hint}</span> : null}
    </label>
  )
}
