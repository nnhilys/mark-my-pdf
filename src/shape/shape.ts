import type { TLShape } from 'tldraw'
import type { BoxShape, BoxShapePartial } from './box/shape'
import type { PolygonShape, PolygonShapePartial } from './polygon/shape'
import type { SegmentShape, SegmentShapePartial } from './segment/shape'
import { isBoxShape } from './box/shape'
import { isPolygonShape } from './polygon/shape'
import { isSegmentShape } from './segment/shape'

export type AnnotShape
  = | BoxShape
    | SegmentShape
    | PolygonShape

export type AnnotShapePartial
  = | BoxShapePartial
    | SegmentShapePartial
    | PolygonShapePartial

export function isAnnotShape(shape: TLShape): shape is AnnotShape {
  return false
    || isBoxShape(shape)
    || isSegmentShape(shape)
    || isPolygonShape(shape)
}
