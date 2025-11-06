import type { TLLineShape, TLShape } from 'tldraw'
import type { AnnotMetaBase, EditorShapePartial } from '../base'

export type SegmentShapeMeta = AnnotMetaBase & {
  annot: 'segment'
}

export type SegmentShapeMetaPartial = Omit<SegmentShapeMeta, 'annot' | 'type'>

export type SegmentShape = TLLineShape & { meta: SegmentShapeMeta }

export type SegmentShapePartial = EditorShapePartial<TLLineShape, SegmentShapeMeta>

export function isSegmentShape(shape: TLShape): shape is SegmentShape {
  return shape.meta.annot === 'segment'
}
