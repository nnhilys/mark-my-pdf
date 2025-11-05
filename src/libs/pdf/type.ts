import type { Box, TLAssetId, TLShapeId } from 'tldraw'

export interface PdfPage {
  id: string
  name: string
  canvas: HTMLCanvasElement
  src: string
  bounds: Box
  assetId: TLAssetId
  shapeId: TLShapeId
}
