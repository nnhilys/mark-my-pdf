import type { TLEnterEventHandler, TLEventHandlers, TLLineShape, TLShape } from 'tldraw'
import type { SegmentShapeMetaPartial } from '../../../shape/segment/shape'
import { StateNode } from 'tldraw'
import { createSegmentShape } from '../../../shape/segment/create'
import { getLineShapeEdgeAbsolute } from '../../../shape/segment/edge'

export class LineSelectGeoToLine extends StateNode {
  static override id = 'geo-to-line'

  markId = ''

  shape = {} as TLShape

  onInteractionEnd = 'line'

  override onEnter?: TLEnterEventHandler | undefined = ({ shape, onInteractionEnd }: { shape: TLLineShape, onInteractionEnd: string }) => {
    if (!shape)
      throw new Error('No shape found')

    this.onInteractionEnd = onInteractionEnd ?? 'line'
    const edge = getLineShapeEdgeAbsolute(shape.x, shape.y, shape.props.points)
    const vertices = edge.getVertices()

    if (vertices.length !== 2)
      return

    const [start, end] = vertices

    const segment = createSegmentShape({
      start,
      end,
      id: shape.id,
      color: shape.props.color,
      meta: { ...(shape.meta as SegmentShapeMetaPartial) },
    })

    this.editor.createShape(segment)
    this.editor.select(shape.id)

    this.shape = this.editor.getShape(shape.id)!
  }

  override onPointerMove: TLEventHandlers['onPointerMove'] = () => {
    if (!this.shape)
      return

    this.parent.transition('moving', {
      shapeId: this.shape.id,
      from: 'line',
      onInteractionEnd: this.onInteractionEnd,
    })
  }
}
