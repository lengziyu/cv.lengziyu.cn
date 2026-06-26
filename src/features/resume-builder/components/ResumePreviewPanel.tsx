import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'
import type { ResumeData } from '../types/resume'
import { defaultTemplateId, templateRegistry } from '../templates/templateRegistry'
import { getVisibleCustomSections } from '../lib/sections'

const PREVIEW_PAGE_HEIGHT = 1122
const TIGHT_FREE_SPACE_THRESHOLD = 24 * 3
const MIN_VISIBLE_LAST_PAGE_HEIGHT = 56

export interface ResumePreviewInsight {
  status: 'fit' | 'tight' | 'overflow'
  title: string
  detail: string
  suggestions: string[]
}

interface ResumePreviewPanelProps {
  data: ResumeData
  previewRef: RefObject<HTMLDivElement | null>
  currentPage: number
  density: number
  onTotalPagesChange: (count: number) => void
  onInsightChange: (insight: ResumePreviewInsight) => void
}

export const ResumePreviewPanel = ({
  data,
  previewRef,
  currentPage,
  density,
  onTotalPagesChange,
  onInsightChange,
}: ResumePreviewPanelProps) => {
  const previewContentRef = useRef<HTMLDivElement>(null)

  const currentTemplate =
    templateRegistry.find((item) => item.id === data.templateId) ||
    templateRegistry.find((item) => item.id === defaultTemplateId)!

  const CurrentTemplate = currentTemplate.component

  useEffect(() => {
    const node = previewContentRef.current
    if (!node) return

    const updatePages = () => {
      const allBlocks = Array.from(node.querySelectorAll<HTMLElement>('.pdf-page-block'))
      const rootBlocks = allBlocks.filter(
        (block) => !block.parentElement?.closest('.pdf-page-block'),
      )

      for (const block of rootBlocks) {
        const cachedBaseMargin = block.dataset.previewBaseMarginTop
        if (cachedBaseMargin) {
          block.style.marginTop = cachedBaseMargin
          continue
        }

        const baseMarginTop = block.style.marginTop || getComputedStyle(block).marginTop
        block.dataset.previewBaseMarginTop = baseMarginTop
        block.style.marginTop = baseMarginTop
      }

      let currentPageBottom = PREVIEW_PAGE_HEIGHT

      for (const block of rootBlocks) {
        const blockHeight = block.offsetHeight
        const top = block.offsetTop
        const bottom = top + blockHeight

        if (bottom <= currentPageBottom) {
          currentPageBottom = Math.max(
            currentPageBottom,
            Math.ceil(bottom / PREVIEW_PAGE_HEIGHT) * PREVIEW_PAGE_HEIGHT,
          )
          continue
        }

        if (blockHeight < PREVIEW_PAGE_HEIGHT) {
          const pushDown = currentPageBottom - top
          if (pushDown > 0) {
            const baseMarginTop = Number.parseFloat(
              block.dataset.previewBaseMarginTop ?? '0',
            )
            block.style.marginTop = `${baseMarginTop + pushDown}px`
          }
        }

        const adjustedBottom = block.offsetTop + block.offsetHeight
        currentPageBottom = Math.max(
          PREVIEW_PAGE_HEIGHT,
          Math.ceil(adjustedBottom / PREVIEW_PAGE_HEIGHT) * PREVIEW_PAGE_HEIGHT,
        )
      }

      const blockSummaries = rootBlocks.map((block) => {
        const title =
          block.dataset.pageLabel?.trim() ||
          block.querySelector('h2, h3')?.textContent?.trim() ||
          '模块'

        return {
          label: title,
          top: block.offsetTop,
          bottom: block.offsetTop + block.offsetHeight,
          page: Math.floor(block.offsetTop / PREVIEW_PAGE_HEIGHT) + 1,
        }
      })

      const rawPageCount = Math.max(1, Math.ceil(node.scrollHeight / PREVIEW_PAGE_HEIGHT))
      const lastContentBottom = blockSummaries.reduce(
        (max, item) => Math.max(max, item.bottom),
        0,
      )
      const lastPageUsedHeight =
        lastContentBottom - (rawPageCount - 1) * PREVIEW_PAGE_HEIGHT

      const pageCount =
        rawPageCount > 1 && lastPageUsedHeight > 0 && lastPageUsedHeight < MIN_VISIBLE_LAST_PAGE_HEIGHT
          ? rawPageCount - 1
          : rawPageCount

      onTotalPagesChange(pageCount)

      const firstPageBottom = Math.max(
        blockSummaries
          .filter((item) => item.page === 1)
          .reduce((max, item) => Math.max(max, Math.min(item.bottom, PREVIEW_PAGE_HEIGHT)), 0),
        Math.min(node.scrollHeight, PREVIEW_PAGE_HEIGHT),
      )

      const firstPageFreeSpace = Math.max(0, PREVIEW_PAGE_HEIGHT - firstPageBottom)
      const approxLines = Math.max(1, Math.round(firstPageFreeSpace / 24))
      const movedBlocks = blockSummaries.filter((item) => item.page > 1)
      const movedLabels = [...new Set(movedBlocks.map((item) => item.label))]

      if (pageCount === 1) {
        if (firstPageFreeSpace <= TIGHT_FREE_SPACE_THRESHOLD) {
          onInsightChange({
            status: 'tight',
            title: '接近一页边界',
            detail: `当前还剩大约 ${approxLines} 行空间，再补内容很容易进到第二页。`,
            suggestions: ['可稍微提高密度，或压缩摘要和项目描述。'],
          })
          return
        }

        onInsightChange({
          status: 'fit',
          title: '当前可稳定控制在一页',
          detail: `第一页还有大约 ${approxLines} 行余量，可以继续补充少量信息。`,
          suggestions: ['如果继续加内容，优先补项目结果或技能关键词。'],
        })
        return
      }

      const firstMoved = movedBlocks[0]
      const suggestions: string[] = ['可以先把密度往右调一点，整体会更容易压回一页。']

      if (movedLabels.some((label) => label.includes('项目'))) {
        suggestions.push('优先精简项目经历，每段保留最关键的结果和技术点。')
      }
      if (movedLabels.some((label) => label.includes('工作'))) {
        suggestions.push('工作经历每段尽量保留 3 到 4 条成果，减少长段落。')
      }
      if (movedLabels.some((label) => label.includes('教育'))) {
        suggestions.push('教育经历可只保留学校、专业和一行补充说明。')
      }
      if (
        getVisibleCustomSections(data).some((section) =>
          movedLabels.some((label) => label === section.title),
        )
      ) {
        suggestions.push('自定义模块可以先压缩到 1 到 2 段核心内容。')
      }

      onInsightChange({
        status: 'overflow',
        title: `当前已扩展到 ${pageCount} 页`,
        detail: firstMoved
          ? `“${firstMoved.label}” 已经被推到第 ${firstMoved.page} 页。`
          : '当前内容已经超出一页。',
        suggestions: suggestions.slice(0, 3),
      })
    }

    updatePages()

    const observer = new ResizeObserver(updatePages)
    observer.observe(node)

    return () => observer.disconnect()
  }, [data, currentTemplate.id, density, onInsightChange, onTotalPagesChange])

  return (
    <section className="relative">
      <div className="space-y-2">
        <div className="rounded-xl border border-line bg-paper-soft p-1.5 sm:p-2">
          <div
            className="mx-auto w-full max-w-[980px] overflow-hidden rounded-xl"
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

        <p className="px-1 text-xs text-slate">当前为分页预览模式，支持翻页查看完整简历。</p>
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
          <div className="pdf-render-scope">
            <CurrentTemplate data={data} density={density} />
          </div>
        </div>
      </div>
    </section>
  )
}
