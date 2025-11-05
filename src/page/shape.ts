import type { TLAsset, TLImageShape, TLShape, TLShapePartial } from 'tldraw'
import type { PdfPage } from '../libs/pdf/type'

interface PageShapeMeta {
  type: 'page'
}

export type PageShape = TLImageShape & { meta: PageShapeMeta }

export type PageShapePartial = TLShapePartial<PageShape>

export function isPageShape(shape: TLShape): shape is PageShape {
  return shape.meta.type === 'page'
}

export function createPageShape(page: PdfPage): PageShapePartial {
  return {
    id: page.shapeId,
    type: 'image',
    x: page.bounds.x,
    y: page.bounds.y,
    isLocked: true,
    props: {
      assetId: page.assetId,
      w: page.bounds.w,
      h: page.bounds.h,
    },
    meta: {
      type: 'page',
    },
  }
}

export function createPageAssets(page: PdfPage): TLAsset {
  return {
    id: page.assetId,
    typeName: 'asset',
    type: 'image',
    meta: {},
    props: {
      w: page.bounds.w,
      h: page.bounds.h,
      mimeType: 'image/png',
      src: page.src,
      name: page.name,
      isAnimated: false,
    },
  }
}
