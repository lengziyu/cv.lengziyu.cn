export const exportResumePdf = async (
  target: HTMLElement,
  fileName: string,
  mode: 'save' | 'preview' = 'save',
) => {
  const { default: html2pdf } = await import('html2pdf.js')

  if ('fonts' in document) {
    try {
      await (document as Document & { fonts?: { ready: Promise<unknown> } }).fonts?.ready
    } catch {
      // Ignore font readiness failures and continue export.
    }
  }

  const options = {
    margin: [5, 5] as [number, number],
    filename: fileName,
    pagebreak: {
      mode: ['css', 'legacy'] as ('css' | 'legacy')[],
      avoid: '.pdf-page-block',
    },
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      onclone: (doc: Document) => {
        const style = doc.createElement('style')
        style.textContent = `
          .pdf-pill {
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            vertical-align: middle !important;
            white-space: nowrap !important;
            box-sizing: border-box !important;
            position: relative !important;
            top: 1px !important;
          }
          .pdf-pill-contact {
            min-height: 28px !important;
            padding: 0 22px !important;
          }
          .pdf-pill-tag {
            min-height: 26px !important;
            padding: 0 10px !important;
            font-weight: 500 !important;
          }
          .pdf-pill-tag-compact {
            min-height: 22px !important;
            padding: 0 10px !important;
          }
          .pdf-pill-label {
            display: block !important;
            font-size: 12px !important;
            line-height: 12px !important;
            transform: translateY(-2.5px) !important;
          }
          .pdf-render-scope .pdf-pill {
            top: -1px !important;
          }
          .pdf-render-scope .pdf-pill-label {
            line-height: 12px !important;
            transform: translateY(-4px) !important;
          }
          .pdf-page-block {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
        `
        doc.head.appendChild(style)
      },
    },
    jsPDF: {
      unit: 'mm' as const,
      format: 'a4' as const,
      orientation: 'portrait' as const,
    },
  }

  const worker = html2pdf().set(options).from(target).toPdf()

  if (mode === 'preview') {
    const blob = (await worker.output('blob')) as Blob
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank', 'noopener,noreferrer')
    setTimeout(() => URL.revokeObjectURL(url), 60_000)
    return
  }

  await worker.save()
}
