import { useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { Button } from '../../../components/ui/Button'
import { parseResumeJson } from '../lib/storage'
import type {
  ResumeActions,
  ResumeVersionActions,
  ResumeVersionSummary,
} from '../types/actions'
import type { ResumeData } from '../types/resume'
import { defaultTemplateId, templateRegistry } from '../templates/templateRegistry'

interface ResumePreviewToolbarProps {
  data: ResumeData
  actions: ResumeActions
  versions: ResumeVersionSummary[]
  activeVersionId: string
  versionActions: ResumeVersionActions
  currentPage: number
  totalPages: number
  density: number
  isExporting: boolean
  isExportingWord: boolean
  isPreviewingPdf: boolean
  onDensityChange: (next: number) => void
  onPrevPage: () => void
  onNextPage: () => void
  onExport: () => void
  onExportWord: () => void
  onPreviewPdf: () => void
}

export const ResumePreviewToolbar = ({
  data,
  actions,
  versions,
  activeVersionId,
  versionActions,
  currentPage,
  totalPages,
  density,
  isExporting,
  isExportingWord,
  isPreviewingPdf,
  onDensityChange,
  onPrevPage,
  onNextPage,
  onExport,
  onExportWord,
  onPreviewPdf,
}: ResumePreviewToolbarProps) => {
  const [importMessage, setImportMessage] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const currentTemplate =
    templateRegistry.find((item) => item.id === data.templateId) ||
    templateRegistry.find((item) => item.id === defaultTemplateId)!

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
      setImportMessage('JSON 导入成功，已覆盖当前版本内容。')
    } catch {
      setImportMessage('导入失败：请确认 JSON 格式正确。')
    } finally {
      event.target.value = ''
    }
  }

  return (
    <div className="w-full lg:w-auto">
      <div className="flex flex-col gap-1 lg:items-end">
        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
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
            <Button size="sm" onClick={onPrevPage} disabled={currentPage === 0}>
              上一页
            </Button>
            <span className="min-w-[74px] text-center font-mono text-xs text-slate">
              {currentPage + 1} / {totalPages}
            </span>
            <Button size="sm" onClick={onNextPage} disabled={currentPage >= totalPages - 1}>
              下一页
            </Button>
          </div>

          <div className="ml-1 flex items-center gap-1 rounded-lg border border-line bg-white px-2 py-1">
            <span className="text-[11px] text-slate">密度</span>
            <input
              type="range"
              min={0.9}
              max={1.14}
              step={0.01}
              value={density}
              onChange={(event) => onDensityChange(Number(event.target.value))}
              className="h-4 w-20 accent-slate-700"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
          <div className="flex items-center gap-2 rounded-lg border border-line bg-white px-2 py-1">
            <select
              className="h-7 w-[112px] bg-transparent text-xs text-ink outline-none"
              value={activeVersionId}
              onChange={(event) => versionActions.switchVersion(event.target.value)}
            >
              {versions.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            <Button size="sm" className="h-7 px-2" onClick={versionActions.createVersion}>
              新建
            </Button>
            <Button size="sm" className="h-7 px-2" onClick={versionActions.duplicateVersion}>
              复制
            </Button>
            <Button
              size="sm"
              variant="danger"
              className="h-7 px-2"
              disabled={versions.length <= 1}
              onClick={() => {
                if (versions.length <= 1) return
                if (window.confirm('确定删除当前版本吗？')) {
                  versionActions.deleteVersion()
                }
              }}
            >
              删除
            </Button>
          </div>

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
            onClick={onExportWord}
            disabled={isExportingWord || isPreviewingPdf || isExporting}
          >
            {isExportingWord ? '导出中...' : '导出 Word'}
          </Button>
          <Button
            size="sm"
            onClick={onPreviewPdf}
            disabled={isPreviewingPdf || isExporting || isExportingWord}
          >
            {isPreviewingPdf ? '预览中...' : '预览 PDF'}
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onExport}
            disabled={isExporting || isPreviewingPdf || isExportingWord}
          >
            {isExporting ? '导出中...' : '导出 PDF'}
          </Button>
        </div>

        {importMessage ? <p className="text-xs text-slate lg:text-right">{importMessage}</p> : null}
      </div>
    </div>
  )
}
