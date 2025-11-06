import type { TLGeoShape, TLShape } from 'tldraw'
import type { AnnotMetaBase, EditorShapePartial } from '../base'

export type BoxShapeMeta = AnnotMetaBase & {
  annot: 'box'
}

export type BoxShapeMetaPartial = Omit<BoxShapeMeta, 'annot' | 'type'>

export type BoxShape = TLGeoShape & { meta: BoxShapeMeta }

export type BoxShapePartial = EditorShapePartial<TLGeoShape, BoxShapeMeta>

export function isBoxShape(shape: TLShape): shape is BoxShape {
  return shape.meta.annot === 'box'
}
