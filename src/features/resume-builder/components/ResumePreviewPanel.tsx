import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, RefObject } from 'react'
import { Button } from '../../../components/ui/Button'
import { parseResumeJson } from '../lib/storage'
import type { ResumeActions } from '../types/actions'
import type { ResumeData } from '../types/resume'
import { defaultTemplateId, templateRegistry } from '../templates/templateRegistry'

const PREVIEW_PAGE_HEIGHT = 1122

interface ResumePreviewPanelProps {
  data: ResumeData
  actions: ResumeActions
  previewRef: RefObject<HTMLDivElement | null>
  isExporting: boolean
  isPreviewingPdf: boolean
  onExport: () => void
  onPreviewPdf: () => void
}

export const ResumePreviewPanel = ({
  data,
  actions,
  previewRef,
  isExporting,
  isPreviewingPdf,
  onExport,
  onPreviewPdf,
}: ResumePreviewPanelProps) => {
  const [importMessage, setImportMessage] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [density, setDensity] = useState(1.06)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const previewContentRef = useRef<HTMLDivElement>(null)

  const currentTemplate =
    templateRegistry.find((item) => item.id === data.templateId) ||
    templateRegistry.find((item) => item.id === defaultTemplateId)!

  const CurrentTemplate = currentTemplate.component

  useEffect(() => {
    setCurrentPage(0)
  }, [currentTemplate.id])

  useEffect(() => {
    const node = previewContentRef.current
    if (!node) return

    const updatePages = () => {
      const pageCount = Math.max(1, Math.ceil(node.scrollHeight / PREVIEW_PAGE_HEIGHT))
      setTotalPages(pageCount)
    }

    updatePages()

    const observer = new ResizeObserver(updatePages)
    observer.observe(node)

    return () => observer.disconnect()
  }, [data, currentTemplate.id, density])

  useEffect(() => {
    if (currentPage > totalPages - 1) {
      setCurrentPage(totalPages - 1)
    }
  }, [currentPage, totalPages])

  const handleExportJson = () => {
    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    const fileNameSeed = data.basic.fullName.trim().replace(/\s+/g, '-') || 'resume'
    link.href = url
    link.download = `${fileNameSeed}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const triggerImport = () => {
    fileInputRef.current?.click()
  }

  const handleImportJson = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const nextData = parseResumeJson(text)
      actions.replaceData(nextData)
      setImportMessage('JSON 导入成功，已覆盖当前简历数据。')
    } catch {
      setImportMessage('导入失败：请确认 JSON 格式正确。')
    } finally {
      event.target.value = ''
    }
  }

  const goPrevPage = () => setCurrentPage((prev) => Math.max(0, prev - 1))
  const goNextPage = () =>
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))

  return (
    <section className="relative">
      <div className="space-y-2">
        <div className="z-20 bg-transparent py-0.5 lg:absolute lg:right-[15px] top-[-106px]">
          <div className="flex w-full justify-center lg:w-auto">
            <div className="flex w-fit flex-col items-end gap-2">
              <div className="flex flex-wrap items-center justify-end gap-2">
              <div className="w-[170px]">
                <label className="sr-only">模板</label>
                <select
                  className="h-9 w-full rounded-lg border border-line bg-white px-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                  value={currentTemplate.id}
                  onChange={(event) => actions.setTemplate(event.target.value)}
                >
                  {templateRegistry.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <Button size="sm" onClick={goPrevPage} disabled={currentPage === 0}>
                  上一页
                </Button>
                <span className="min-w-[74px] text-center font-mono text-xs text-slate">
                  {currentPage + 1} / {totalPages}
                </span>
                <Button
                  size="sm"
                  onClick={goNextPage}
                  disabled={currentPage >= totalPages - 1}
                >
                  下一页
                </Button>
              </div>

              <div className="ml-1 flex items-center gap-1 rounded-lg border border-line bg-white px-2 py-1">
                <span className="text-[11px] text-slate">高度</span>
                <input
                  type="range"
                  min={0.9}
                  max={1.14}
                  step={0.01}
                  value={density}
                  onChange={(event) => setDensity(Number(event.target.value))}
                  className="h-4 w-20 accent-slate-700"
                />
              </div>
              </div>
              <div className="flex flex-wrap items-center justify-end gap-2">
              <Button size="sm" onClick={handleExportJson}>
                导出 JSON
              </Button>
              <Button size="sm" onClick={triggerImport}>
                导入 JSON
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                className="hidden"
                onChange={handleImportJson}
              />
              <Button
                size="sm"
                onClick={onPreviewPdf}
                disabled={isPreviewingPdf || isExporting}
              >
                {isPreviewingPdf ? '预览中...' : '预览'}
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={onExport}
                disabled={isExporting || isPreviewingPdf}
              >
                {isExporting ? '导出中...' : '导出 PDF'}
              </Button>
              </div>
            </div>
          </div>

          {importMessage ? <p className="mt-2 text-xs text-slate">{importMessage}</p> : null}
        </div>

        <div className="rounded-xl bg-paper-soft p-1.5 sm:p-2">
          <div
            className="mx-auto w-full max-w-[980px] overflow-hidden rounded-xl border border-line bg-white shadow-panel"
            style={{ height: PREVIEW_PAGE_HEIGHT }}
          >
            <div
              ref={previewContentRef}
              className="will-change-transform"
              style={{
                transform: `translateY(-${currentPage * PREVIEW_PAGE_HEIGHT}px)`,
                transition: 'transform 240ms ease',
              }}
            >
              <CurrentTemplate data={data} density={density} />
            </div>
          </div>
        </div>

        <p className="px-1 text-xs text-slate">
          当前为分页预览模式，支持翻页查看完整简历。
        </p>
      </div>

      <div
        style={{
          position: 'fixed',
          left: '-200vw',
          top: 0,
          width: '980px',
        }}
      >
        <div ref={previewRef}>
          <CurrentTemplate data={data} density={density} />
        </div>
      </div>
    </section>
  )
}
