import { useMemo, useState } from 'react'
import { Card } from '../../../components/ui/Card'
import { STEP_ITEMS } from '../constants/resume'
import type {
  ResumeSectionId,
  ResumeSectionTitles,
  ResumeStepId,
} from '../types/resume'
import { cn } from '../../../shared/cn'

interface ResumeStepSidebarProps {
  activeStep: ResumeStepId
  sectionOrder: ResumeSectionId[]
  sectionTitles: ResumeSectionTitles
  onStepChange: (step: ResumeStepId) => void
  onSectionMove: (sourceId: ResumeSectionId, targetId: ResumeSectionId) => void
}

const itemBaseClass =
  'relative w-full rounded-lg border px-3 py-3 text-left transition lg:min-w-0'

const DragHandleIcon = ({ selected }: { selected: boolean }) => (
  <span
    className={cn(
      'absolute right-3 top-3 inline-flex h-5 w-5 items-center justify-center rounded-md border',
      selected
        ? 'border-white/15 bg-white/10 text-white/75'
        : 'border-slate-200 bg-slate-50 text-slate-400',
    )}
    aria-hidden="true"
  >
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-current">
      <circle cx="5" cy="4" r="1.1" />
      <circle cx="11" cy="4" r="1.1" />
      <circle cx="5" cy="8" r="1.1" />
      <circle cx="11" cy="8" r="1.1" />
      <circle cx="5" cy="12" r="1.1" />
      <circle cx="11" cy="12" r="1.1" />
    </svg>
  </span>
)

export const ResumeStepSidebar = ({
  activeStep,
  sectionOrder,
  sectionTitles,
  onStepChange,
  onSectionMove,
}: ResumeStepSidebarProps) => {
  const [draggingId, setDraggingId] = useState<ResumeSectionId | null>(null)

  const stepMetaMap = useMemo(
    () =>
      Object.fromEntries(STEP_ITEMS.map((item) => [item.id, item])) as Record<
        ResumeStepId,
        (typeof STEP_ITEMS)[number]
      >,
    [],
  )

  const orderedSteps: ResumeStepId[] = ['basic', ...sectionOrder]

  return (
    <aside className="lg:sticky lg:top-2 lg:h-fit">
      <Card className="p-3 sm:p-4">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-slate">
          编辑步骤
        </h2>
        <p className="mb-3 text-xs text-slate">拖拽调整模块顺序（基础信息固定）。</p>

        <div className="space-y-2">
          {orderedSteps.map((stepId, index) => {
            const item = stepMetaMap[stepId]
            const selected = stepId === activeStep
            const isDraggable = stepId !== 'basic'
            const displayTitle =
              stepId === 'basic' ? item.title : sectionTitles[stepId]

            return (
              <button
                key={stepId}
                draggable={isDraggable}
                onDragStart={() => {
                  if (isDraggable) setDraggingId(stepId)
                }}
                onDragEnd={() => setDraggingId(null)}
                onDragOver={(event) => {
                  if (!isDraggable || !draggingId || draggingId === stepId) return
                  event.preventDefault()
                }}
                onDrop={(event) => {
                  if (!isDraggable || !draggingId || draggingId === stepId) return
                  event.preventDefault()
                  onSectionMove(draggingId, stepId)
                  setDraggingId(null)
                }}
                className={cn(
                  itemBaseClass,
                  selected
                    ? 'border-ink bg-ink pr-12 text-white shadow-sm'
                    : 'border-line bg-white pr-12 text-ink hover:bg-paper-soft',
                  draggingId === stepId ? 'ring-2 ring-slate-300' : '',
                )}
                onClick={() => onStepChange(stepId)}
                title={isDraggable ? '可拖拽排序' : '基础信息固定在首位'}
              >
                {isDraggable ? <DragHandleIcon selected={selected} /> : null}
                <p
                  className={cn(
                    'text-[11px] font-semibold uppercase tracking-[0.12em]',
                    selected ? 'text-white/80' : 'text-slate',
                  )}
                >
                  Step {index + 1}
                </p>
                <p className="mt-1 text-sm font-semibold">{displayTitle}</p>
                <p
                  className={cn(
                    'mt-1 text-xs leading-5',
                    selected ? 'text-white/80' : 'text-slate',
                  )}
                >
                  {item.description}
                </p>
              </button>
            )
          })}
        </div>
      </Card>
    </aside>
  )
}
