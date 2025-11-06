import type { IndexKey, RecordPropsType, TLBaseShape, TLShape } from 'tldraw'
import { DefaultColorStyle, DefaultSizeStyle, T } from 'tldraw'

export interface PolygonPoint {
  id: string
  index: IndexKey
  x: number
  y: number
}

export const polygonPointValidators = T.object({
  id: T.string,
  index: T.indexKey,
  x: T.number,
  y: T.number,
})

export const polygonShapeProps = {
  color: DefaultColorStyle,
  size: DefaultSizeStyle,
  points: T.dict(T.string, polygonPointValidators),
}

export type PolygonShapeProps = RecordPropsType<typeof polygonShapeProps>

export type PolygonShapeBase = TLBaseShape<'polygon', PolygonShapeProps>

export function isPolygonShapeBase(shape: TLShape): shape is PolygonShapeBase {
  return shape.type === 'polygon'
}
