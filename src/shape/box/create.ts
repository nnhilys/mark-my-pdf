import type { BoxLike, TLDefaultColorStyle, TLShapeId } from 'tldraw'
import type { BoxShapeMetaPartial, BoxShapePartial } from './shape'
import { createShapeId } from 'tldraw'
import { randomShapeColor } from '../color'

export function createBoxShape(props: {
  box: BoxLike
  //
  id: TLShapeId | null
  color: TLDefaultColorStyle | null
  meta: BoxShapeMetaPartial
}): BoxShapePartial {
  const { box, id, color, meta } = props

  const { x, y, w, h } = box

  const boxShape: BoxShapePartial = {
    type: 'geo',
    id: id ?? createShapeId(),
    x,
    y,
    opacity: 1,
    props: {
      geo: 'rectangle',
      dash: 'solid',
      fill: 'semi',
      size: 's',
      color: color ?? randomShapeColor(),
      w,
      h,
    },
    meta: {
      ...meta,
      type: 'annot',
      annot: 'box',
      group: meta.group ?? crypto.randomUUID(),
    },
  }

  return boxShape
}
