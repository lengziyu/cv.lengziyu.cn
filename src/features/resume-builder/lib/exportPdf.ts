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
          .pdf-page-block {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
          .pdf-pill {
            display: inline-block !important;
            vertical-align: middle !important;
            box-sizing: border-box !important;
            text-align: center !important;
          }
          .pdf-pill-contact {
            height: 28px !important;
            line-height: 28px !important;
          }
          .pdf-pill-tag {
            height: 26px !important;
            line-height: 26px !important;
          }
          .pdf-pill-tag-compact {
            height: 22px !important;
            line-height: 22px !important;
          }
          .pdf-pill-label {
            display: inline !important;
            line-height: inherit !important;
          }
          .pdf-pill-contact .pdf-pill-label {
            position: relative !important;
            top: -8px !important;
          }
          .pdf-pill-tag .pdf-pill-label {
            position: relative !important;
            top: -7px !important;
          }
          .pdf-pill-tag-compact .pdf-pill-label {
            position: relative !important;
            top: -9px !important;
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
