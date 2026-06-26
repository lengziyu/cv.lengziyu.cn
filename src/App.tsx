import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ThreePanelLayout } from './components/layout/ThreePanelLayout'
import { ResumeEditorPanel } from './features/resume-builder/components/ResumeEditorPanel'
import {
  ResumePreviewPanel,
  type ResumePreviewInsight,
} from './features/resume-builder/components/ResumePreviewPanel'
import { ResumePreviewToolbar } from './features/resume-builder/components/ResumePreviewToolbar'
import { ResumeStepSidebar } from './features/resume-builder/components/ResumeStepSidebar'
import { useResumeBuilder } from './features/resume-builder/hooks/useResumeBuilder'
import { exportResumePdf } from './features/resume-builder/lib/exportPdf'
import { exportResumeWord } from './features/resume-builder/lib/exportWord'
import type { ResumeStepId } from './features/resume-builder/types/resume'

const DEFAULT_PREVIEW_INSIGHT: ResumePreviewInsight = {
  status: 'fit',
  title: '正在分析分页情况',
  detail: '稍等片刻，系统会根据当前内容给出一页优化建议。',
  suggestions: [],
}

const getResumeFileNameSeed = (fullName: string, role: string) => {
  const sanitize = (value: string) =>
    value
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[\\/:*?"<>|]/g, '')

  const namePart = sanitize(fullName) || 'resume'
  const rolePart = sanitize(role)
  return rolePart ? `${namePart}-${rolePart}` : namePart
}

function App() {
  const [activeStep, setActiveStep] = useState<ResumeStepId>('basic')
  const [isExporting, setIsExporting] = useState(false)
  const [isExportingWord, setIsExportingWord] = useState(false)
  const [isPreviewingPdf, setIsPreviewingPdf] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [density, setDensity] = useState(1.06)
  const [previewInsight, setPreviewInsight] = useState(DEFAULT_PREVIEW_INSIGHT)
  const [isInsightVisible, setIsInsightVisible] = useState(true)

  const { data, actions, versions, activeVersionId, versionActions } = useResumeBuilder()
  const previewRef = useRef<HTMLDivElement>(null)

  const insightSignature = useMemo(
    () =>
      `${previewInsight.status}|${previewInsight.title}|${previewInsight.detail}|${previewInsight.suggestions.join('||')}`,
    [previewInsight],
  )

  useEffect(() => {
    setCurrentPage(0)
  }, [data.templateId, activeVersionId])

  useEffect(() => {
    setCurrentPage((prev) => Math.min(prev, Math.max(totalPages - 1, 0)))
  }, [totalPages])

  useEffect(() => {
    setIsInsightVisible(previewInsight.status !== 'fit')
  }, [insightSignature, previewInsight.status])

  const handleExport = async () => {
    if (!previewRef.current || isExporting) return

    setIsExporting(true)
    try {
      const fileNameSeed = getResumeFileNameSeed(data.basic.fullName, data.basic.role)
      await exportResumePdf(previewRef.current, `${fileNameSeed}.pdf`, 'save')
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportWord = async () => {
    if (isExportingWord) return

    setIsExportingWord(true)
    try {
      const fileNameSeed = getResumeFileNameSeed(data.basic.fullName, data.basic.role)
      await exportResumeWord(data, `${fileNameSeed}.docx`)
    } finally {
      setIsExportingWord(false)
    }
  }

  const handlePreviewPdf = async () => {
    if (!previewRef.current || isPreviewingPdf) return

    setIsPreviewingPdf(true)
    try {
      const fileNameSeed = getResumeFileNameSeed(data.basic.fullName, data.basic.role)
      await exportResumePdf(previewRef.current, `${fileNameSeed}.pdf`, 'preview')
    } finally {
      setIsPreviewingPdf(false)
    }
  }

  const goPrevPage = () => setCurrentPage((prev) => Math.max(0, prev - 1))
  const goNextPage = () =>
    setCurrentPage((prev) => Math.min(Math.max(totalPages - 1, 0), prev + 1))

  const insightBorderClass =
    previewInsight.status === 'overflow'
      ? 'border-amber-200'
      : previewInsight.status === 'tight'
        ? 'border-sky-200'
        : 'border-emerald-200'

  const insightToast =
    isInsightVisible && typeof document !== 'undefined'
      ? createPortal(
          <div
            className="pointer-events-none"
            style={{
              position: 'fixed',
              right: 16,
              bottom: 16,
              zIndex: 80,
              width: 'min(360px, calc(100vw - 32px))',
            }}
          >
            <div
              className={`pointer-events-auto rounded-xl border bg-white/96 p-4 shadow-panel backdrop-blur ${insightBorderClass}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-ink">{previewInsight.title}</p>
                  <p className="mt-1 text-xs leading-5 text-slate">{previewInsight.detail}</p>
                </div>
                <button
                  type="button"
                  className="shrink-0 whitespace-nowrap rounded-md px-2 py-1 text-xs text-slate transition hover:bg-paper-soft hover:text-ink"
                  onClick={() => setIsInsightVisible(false)}
                >
                  关闭
                </button>
              </div>

              {previewInsight.suggestions.length ? (
                <p className="mt-2 text-xs leading-5 text-slate">
                  {previewInsight.suggestions.join(' ')}
                </p>
              ) : null}
            </div>
          </div>,
          document.body,
        )
      : null

  return (
    <>
      <div className="min-h-screen pb-8 lg:flex lg:h-screen lg:flex-col lg:overflow-hidden lg:pb-0">
        <header className="mx-auto w-full max-w-[1960px] px-1.5 sm:px-2 lg:shrink-0 lg:px-3">
          <div className="rounded-md border border-line bg-white/90 px-3 py-2 backdrop-blur">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <img src="/brand-logo.svg" alt="在线简历生成器" className="h-11 w-11 shrink-0" />
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate">
                      Resume Builder
                    </p>
                    <h1 className="text-base font-semibold tracking-[-0.02em] text-ink">
                      在线简历生成器
                    </h1>
                  </div>
                </div>
                <p className="mt-1 text-xs text-slate">
                  左侧拖拽排序，中间高效编辑，右侧实时分页预览。支持多版本简历管理与一页优化提示。
                </p>
              </div>

              <ResumePreviewToolbar
                data={data}
                actions={actions}
                versions={versions}
                activeVersionId={activeVersionId}
                versionActions={versionActions}
                currentPage={currentPage}
                totalPages={totalPages}
                density={density}
                isExporting={isExporting}
                isExportingWord={isExportingWord}
                isPreviewingPdf={isPreviewingPdf}
                onDensityChange={setDensity}
                onPrevPage={goPrevPage}
                onNextPage={goNextPage}
                onExport={handleExport}
                onExportWord={handleExportWord}
                onPreviewPdf={handlePreviewPdf}
              />
            </div>
          </div>
        </header>

        <div className="lg:min-h-0 lg:flex-1">
          <ThreePanelLayout
            left={
              <ResumeStepSidebar
                activeStep={activeStep}
                sectionOrder={data.sectionOrder}
                hiddenSections={data.hiddenSections}
                sectionTitles={data.sectionTitles}
                onStepChange={(step) => setActiveStep(step)}
                onSectionMove={actions.moveSection}
              />
            }
            center={<ResumeEditorPanel activeStep={activeStep} data={data} actions={actions} />}
            right={
              <ResumePreviewPanel
                data={data}
                previewRef={previewRef}
                currentPage={currentPage}
                density={density}
                onTotalPagesChange={setTotalPages}
                onInsightChange={setPreviewInsight}
              />
            }
          />
        </div>
      </div>

      {insightToast}
    </>
  )
}

export default App
