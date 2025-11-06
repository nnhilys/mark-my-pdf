import type { TLShape } from 'tldraw'
import type { PolygonShapeBase } from '../../editor/tool/polygon/shape'
import type { AnnotMetaBase, EditorShapePartial } from '../base'

export type PolygonShapeMeta = AnnotMetaBase & {
  annot: 'polygon'
  isClosed: boolean
}

export type PolygonShapeMetaPartial = Omit<PolygonShapeMeta, 'annot' | 'type'>

export type PolygonShape = PolygonShapeBase & { meta: PolygonShapeMeta }

export type PolygonShapePartial = EditorShapePartial<PolygonShape, PolygonShapeMeta>

export function isPolygonShape(shape: TLShape): shape is PolygonShape {
  return shape.meta.annot === 'polygon'
}
