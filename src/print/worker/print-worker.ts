import type { AnnotShape } from '../../shape/shape'
import type { PrintPage } from '../type'
import { jsPDF as JSPDF } from 'jspdf'
import { Box } from 'tldraw'
import { isBoxShape } from '../../shape/box/shape'
import { isPolygonShape } from '../../shape/polygon/shape'
import { isSegmentShape } from '../../shape/segment/shape'
import { loadJapaneseFont } from '../font'
import { renderPrintShapes } from '../render'

interface PaperSize {
  width: number
  height: number
}

type PaperName = 'A0' | 'A1' | 'A2' | 'A3' | 'A4'

/**
 * PaperSize is in pixels. Sizes are defined in portrait, so width is always
 * smaller than height. Note that PDF pages may be in landscape mode.
 */
const PAPER_DETAILS: Record<PaperName, PaperSize> = {
  A0: { width: 2383, height: 3370 },
  A1: { width: 1683, height: 2383 },
  A2: { width: 1190, height: 1683 },
  A3: { width: 841, height: 1190 },
  A4: { width: 595, height: 841 },
}

export async function printPDF(
  pages: PrintPage[],
  shapes: AnnotShape[],
  onProgress: (current: number, total: number) => void,
): Promise<Blob> {
  /** Create new pdf */
  const pdf = new JSPDF({
    format: 'a4',
    compress: true,
    unit: 'pt',
  })

  // Load Japanese font for legend rendering
  await loadJapaneseFont(pdf)

  // Calculate total pages for progress tracking
  const pagesWithSrc = pages.filter(page => page.src !== '')
  const totalPages = pagesWithSrc.length
  let currentPage = 0

  // Initialize progress only if we have pages to process
  if (totalPages > 0) {
    onProgress(currentPage, totalPages)
  }

  const mapShapeToPage = new Map()
  shapes.forEach((shape) => {
    let page: PrintPage | undefined

    if (isBoxShape(shape)) {
      const box = new Box(shape.x, shape.y, shape.props.w, shape.props.h)
      page = pages.find((page) => {
        const pageBox = new Box(page.box.x, page.box.y, page.box.w, page.box.h)
        return pageBox.contains(box)
      })
    }

    if (isSegmentShape(shape) || isPolygonShape(shape)) {
      page = pages.find((page) => {
        const pageBox = new Box(page.box.x, page.box.y, page.box.w, page.box.h)
        return pageBox.containsPoint({ x: shape.x, y: shape.y })
      })
    }

    if (!page)
      return

    const currentShapes = mapShapeToPage.get(page.id) ?? []
    mapShapeToPage.set(page.id, [...currentShapes, shape])
  })

  for (const page of pages) {
    if (page.src === '')
      continue

    const imgProps = pdf.getImageProperties(page.src)
    const width = PAPER_DETAILS.A4.height
    const height = (imgProps.height * width) / imgProps.width

    // Calculate scale factor between original page bounds and rendered PDF dimensions
    const scaleX = width / page.box.w
    const scaleY = height / page.box.h

    // Add empty page
    pdf.addPage('a4', 'landscape')

    // Draw pdf to page
    pdf.addImage({
      imageData: page.src,
      format: 'JPG',
      compression: 'MEDIUM',
      x: 0,
      y: 0,
      width,
      height,
    })

    const pageShapes = mapShapeToPage.get(page.id)
    if (pageShapes) {
      renderPrintShapes(pdf, page, pageShapes, scaleX, scaleY)
    }

    // Report progress via postMessage
    currentPage++
    onProgress(currentPage, totalPages)
  }

  if (pdf.getNumberOfPages() > 1) {
    /** Remove first blank page */
    pdf.deletePage(1)
    /** Return PDF as Blob */
    return pdf.output('blob')
  }

  // Return empty blob if no pages were added
  return new Blob([], { type: 'application/pdf' })
}
