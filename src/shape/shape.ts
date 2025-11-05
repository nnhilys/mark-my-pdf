import type { TLShape } from 'tldraw'
import type { BoxShape, BoxShapePartial } from './box/shape'
import type { PieceShape, PieceShapePartial } from './piece/shape'
import type { PolygonShape, PolygonShapePartial } from './polygon/shape'
import type { SegmentShape, SegmentShapePartial } from './segment/shape'
import { isBoxShape } from './box/shape'
import { isPieceShape } from './piece/shape'
import { isPolygonShape } from './polygon/shape'
import { isSegmentShape } from './segment/shape'

export type AnnotShape
  = | BoxShape
    | SegmentShape
    | PolygonShape
    | PieceShape

export type AnnotShapePartial
  = | BoxShapePartial
    | SegmentShapePartial
    | PolygonShapePartial
    | PieceShapePartial

export function isAnnotShape(shape: TLShape): shape is AnnotShape {
  return false
    || isBoxShape(shape)
    || isSegmentShape(shape)
    || isPolygonShape(shape)
    || isPieceShape(shape)
}
