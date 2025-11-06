import type { TLDefaultColorStyle, TLShapeId } from 'tldraw'
import type { PolygonPoint } from '../../editor/tool/polygon/shape'
import type { PolygonShapeMetaPartial, PolygonShapePartial } from './shape'
import { createShapeId } from 'tldraw'
import { randomShapeColor } from '../color'

export function createPolygonShape(props: {
  x: number
  y: number
  points: Record<string, PolygonPoint>
  //
  id: TLShapeId | null
  color: TLDefaultColorStyle | null
  meta: PolygonShapeMetaPartial
}): PolygonShapePartial {
  const { x, y, points, id, color, meta } = props

  const shape: PolygonShapePartial = {
    id: id ?? createShapeId(),
    type: 'polygon',
    x,
    y,
    props: {
      points,
      size: 'l',
      color: color ?? randomShapeColor(),
    },
    meta: {
      ...meta,
      type: 'annot',
      annot: 'polygon',
      group: meta.group ?? crypto.randomUUID(),
    },
  }
  return shape
}
