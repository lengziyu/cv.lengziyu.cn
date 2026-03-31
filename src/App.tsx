import { useRef, useState } from 'react'
import { ThreePanelLayout } from './components/layout/ThreePanelLayout'
import { useResumeBuilder } from './features/resume-builder/hooks/useResumeBuilder'
import { exportResumePdf } from './features/resume-builder/lib/exportPdf'
import { ResumeEditorPanel } from './features/resume-builder/components/ResumeEditorPanel'
import { ResumePreviewPanel } from './features/resume-builder/components/ResumePreviewPanel'
import { ResumeStepSidebar } from './features/resume-builder/components/ResumeStepSidebar'
import type { ResumeStepId } from './features/resume-builder/types/resume'

function App() {
  const [activeStep, setActiveStep] = useState<ResumeStepId>('basic')
  const [isExporting, setIsExporting] = useState(false)
  const [isPreviewingPdf, setIsPreviewingPdf] = useState(false)

  const { data, actions } = useResumeBuilder()
  const previewRef = useRef<HTMLDivElement>(null)

  const handleExport = async () => {
    if (!previewRef.current || isExporting) {
      return
    }

    setIsExporting(true)
    try {
      const sanitize = (value: string) =>
        value
          .trim()
          .replace(/\s+/g, '-')
          .replace(/[\\/:*?"<>|]/g, '')

      const namePart = sanitize(data.basic.fullName) || 'resume'
      const rolePart = sanitize(data.basic.role)
      const fileNameSeed = rolePart ? `${namePart}-${rolePart}` : namePart
      await exportResumePdf(previewRef.current, `${fileNameSeed}.pdf`, 'save')
    } finally {
      setIsExporting(false)
    }
  }

  const handlePreviewPdf = async () => {
    if (!previewRef.current || isPreviewingPdf) {
      return
    }

    setIsPreviewingPdf(true)
    try {
      const sanitize = (value: string) =>
        value
          .trim()
          .replace(/\s+/g, '-')
          .replace(/[\\/:*?"<>|]/g, '')

      const namePart = sanitize(data.basic.fullName) || 'resume'
      const rolePart = sanitize(data.basic.role)
      const fileNameSeed = rolePart ? `${namePart}-${rolePart}` : namePart
      await exportResumePdf(previewRef.current, `${fileNameSeed}.pdf`, 'preview')
    } finally {
      setIsPreviewingPdf(false)
    }
  }

  return (
    <div className="min-h-screen pb-8">
      <header className="mx-auto w-full max-w-[1880px] px-1.5 pt-1.5 sm:px-2 lg:px-3">
        <div className="rounded-xl border border-line bg-white/90 px-3 py-[17px] backdrop-blur">
          <div className="flex items-center gap-3">
            <img src="/brand-logo.svg" alt="Resume Builder Logo" className="h-11 w-11 shrink-0" />
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
            左侧可拖拽调整模块顺序（基础信息固定），中间编辑，右侧实时分页预览。
            支持本地保存、JSON 导入导出与 PDF。
          </p>
        </div>
      </header>

      <ThreePanelLayout
        left={
          <ResumeStepSidebar
            activeStep={activeStep}
            sectionOrder={data.sectionOrder}
            sectionTitles={data.sectionTitles}
            onStepChange={(step) => setActiveStep(step)}
            onSectionMove={actions.moveSection}
          />
        }
        center={
          <ResumeEditorPanel activeStep={activeStep} data={data} actions={actions} />
        }
        right={
          <div>
            <ResumePreviewPanel
              data={data}
              actions={actions}
              previewRef={previewRef}
              isExporting={isExporting}
              isPreviewingPdf={isPreviewingPdf}
              onExport={handleExport}
              onPreviewPdf={handlePreviewPdf}
            />
          </div>
        }
      />
    </div>
  )
}

export default App
