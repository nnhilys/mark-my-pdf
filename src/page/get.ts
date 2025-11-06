import type { PageDetail } from './type'
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs'
import { AssetRecordType, Box, createShapeId } from 'tldraw'
import samplePdf from '/sample.pdf'

/**
 * PDF is rendered on a canvas, which most browsers limit to 16k pixels in either dimension.
 * Most PDFs have the original size of around 1k to 2k pixels, so 8x is a safe scale.
 * See: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas#maximum_canvas_size
 */
export const PAGE_PDF_SCALE = 8

// Spacing between pages
export const PAGE_PDF_SPACING = 32

export async function getPages(): Promise<PageDetail[]> {
  const result = await fetch(samplePdf)
  const data = await result.arrayBuffer()

  const pdf = await getDocument({
    data,
    cMapUrl: '/public/cmaps/',
    cMapPacked: true,
  }).promise

  const pages: PageDetail[] = []

  for (let i = 0; i < pdf.numPages; i++) {
    const page = await pdf.getPage(i + 1)

    const viewport = page.getViewport({ scale: PAGE_PDF_SCALE })

    // Render pdf page on the canvas
    const canvas = document.createElement('canvas')
    canvas.width = viewport.width
    canvas.height = viewport.height

    const context = canvas.getContext('2d')
    if (!context)
      throw new Error('PDF: Cannot get 2D context')

    await page.render({ canvasContext: context, viewport }).promise
    page.cleanup()

    const width = viewport.width / PAGE_PDF_SCALE
    const height = viewport.height / PAGE_PDF_SCALE
    const top = i * (height + PAGE_PDF_SPACING)

    pages.push({
      id: `sample-${i + 1}`,
      name: `Sample PDF - ${i + 1}`,
      canvas,
      src: canvas.toDataURL(),
      bounds: new Box(0, top, width, height),
      assetId: AssetRecordType.createId(),
      shapeId: createShapeId(),
    })
  }

  await pdf.cleanup()
  await pdf.destroy()

  return pages
}
