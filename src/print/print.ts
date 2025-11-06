import type { PageDetail } from '../page/type'
import type { AnnotShape } from '../shape/shape'
import type { PrintPage } from './type'
import { proxy } from 'comlink'
import { getPages } from '../page/get'
import { printWorker } from './worker/main'

export async function printPDF(props: {
  file: File | 'sample'
  shapes: AnnotShape[]
  onProgress: (current: number, total: number) => void
}): Promise<boolean> {
  const { file, shapes, onProgress } = props

  // Re-render pages with scale 2 for print PDF generation
  const pages: PageDetail[] = await getPages(file, 2)

  const printPages: PrintPage[] = pages.map(page => ({
    id: page.id,
    name: page.name,
    src: page.src,
    box: page.bounds,
    assetId: page.assetId,
    shapeId: page.shapeId,
  }))

  // Call the worker to generate PDF
  const pdfBlob = await printWorker.printPDF(printPages, shapes, proxy(onProgress))

  // Check if PDF was generated successfully
  if (pdfBlob.size > 0) {
    // Create download link and trigger download
    const url = URL.createObjectURL(pdfBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'export.pdf'
    link.click()
    URL.revokeObjectURL(url)
    return true
  }

  return false
}
