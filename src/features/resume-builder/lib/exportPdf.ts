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
