import type { TLDefaultColorStyle, TLShapeId, VecLike } from 'tldraw'
import type { SegmentShape, SegmentShapeMetaPartial, SegmentShapePartial } from './shape'
import { createShapeId, getIndices, Vec } from 'tldraw'
import { randomShapeColor } from '../color'

export const SEGMENT_SHAPE_INDICES = (() => {
  const indices = getIndices(2)
  if (indices.length < 2)
    throw new Error('Invalid indices')
  const [start, end] = indices
  return { start, end } as const
})()

export function createSegmentShape(props: {
  start: VecLike
  end: VecLike
  //
  id: TLShapeId | null
  color: TLDefaultColorStyle | null
  meta: SegmentShapeMetaPartial
}): SegmentShapePartial {
  const { start: absStart, end: absEnd, id, color, meta } = props

  const relEnd = Vec.From(absEnd).sub(absStart)
  const { end: endID, start: startID } = SEGMENT_SHAPE_INDICES

  const points: SegmentShape['props']['points'] = {
    // We follow tldraw's pattern here that the "start" handle starts at 0, 0.
    // (the actual "start" point is the "line.x" and ".y".)
    [startID]: { id: startID, index: startID, x: 0, y: 0 },
    [endID]: { id: endID, index: endID, x: relEnd.x, y: relEnd.y },
  }

  const flat: SegmentShapePartial = {
    id: id ?? createShapeId(),
    type: 'line',
    x: absStart.x,
    y: absStart.y,
    props: {
      dash: 'solid',
      size: 'l',
      color: color ?? randomShapeColor(),
      points,
    },
    meta: {
      ...meta,
      type: 'annot',
      annot: 'segment',
      group: meta.group ?? crypto.randomUUID(),
    },
  }

  return flat
}
