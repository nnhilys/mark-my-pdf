import type { TLCancelEvent, TLEnterEventHandler, TLEventHandlers, TLHandle, TLLineShape, TLPointerEvent, TLShapeId, Vec } from 'tldraw'
import { StateNode, structuredClone } from 'tldraw'
import { isSegmentShape } from '../../../shape/segment/shape'

export class LineSelectMoving extends StateNode {
  static override id = 'moving'
  initialPagePoint: Vec | undefined
  initialPageRotation: number | undefined
  shape = {} as TLLineShape
  handle = {} as TLHandle
  from = 'line'
  onInteractionEnd = 'line'

  override onEnter?: TLEnterEventHandler | undefined = ({ shapeId, from, onInteractionEnd }: { shapeId: TLShapeId, from: string, onInteractionEnd: string }) => {
    const shape = this.editor.getShape<TLLineShape>(shapeId)
    if (!shape)
      throw new Error('No shape found')

    const handles = this.editor.getShapeHandles(shape)
    if (!handles)
      throw new Error('No handle found')

    this.handle = structuredClone(handles.at(-1)!)
    this.shape = shape
    this.initialPagePoint = this.editor.inputs.originPagePoint.clone()
    this.initialPageRotation = this.editor.getShapePageTransform(shape).rotation()
    this.from = from ?? 'line'
    this.onInteractionEnd = onInteractionEnd
  }

  override onPointerMove?: TLPointerEvent | undefined = () => {
    const { currentPagePoint } = this.editor.inputs

    const point = currentPagePoint.clone().sub(this.initialPagePoint!).rot(-this.initialPageRotation!)

    const points = structuredClone(this.shape.props.points)
    points[this.handle.index] = {
      id: this.handle.id,
      index: this.handle.index,
      x: point.x,
      y: point.y,
    }
    this.editor.updateShapes(
      [
        { ...this.shape, props: { points } },
      ],
    )
  }

  override onPointerDown?: TLPointerEvent | undefined = () => {
    this.parent.transition('create', {
      from: this.from,
      onInteractionEnd: this.onInteractionEnd,
    })
  }

  override onCancel: TLCancelEvent | undefined = () => {
    const latestShape = this.editor.getSelectedShapes().filter(isSegmentShape).at(-1) ?? null
    if (latestShape)
      this.editor.deleteShape(latestShape)

    this.editor.deselect(...this.editor.getSelectedShapeIds())
    this.editor.markHistoryStoppingPoint()
    this.editor.setCurrentTool(this.onInteractionEnd)
  }

  override onRightClick: TLEventHandlers['onRightClick'] = () => {
    const latestShape = this.editor.getSelectedShapes().filter(isSegmentShape).at(-1) ?? null
    if (latestShape)
      this.editor.deleteShape(latestShape)

    this.editor.deselect(...this.editor.getSelectedShapeIds())
    this.editor.markHistoryStoppingPoint()
    this.editor.setCurrentTool(this.onInteractionEnd)
  }
}
