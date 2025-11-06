import type { TLEnterEventHandler, TLEventHandlers, TLInterruptEvent, TLShape } from 'tldraw'
import { createShapeId, StateNode } from 'tldraw'
import { isEditorOrphanedShape } from '../../../shape/base'
import { createSegmentShape } from '../../../shape/segment/create'
import { getLineShapeEdgeAbsolute } from '../../../shape/segment/edge'
import { isSegmentShape } from '../../../shape/segment/shape'
import { isLineShape } from '../../shape-util/line'

interface onEnterLineToolInfo {
  from: 'line'
  onInteractionEnd: string
}

export class LineSelectCreate extends StateNode {
  static override id = 'create'

  from = 'line'
  onInteractionEnd = 'line'

  markId = ''

  shape = {} as TLShape

  override onEnter?: TLEnterEventHandler | undefined = (info: onEnterLineToolInfo) => {
    const { inputs } = this.editor
    this.from = info.from ?? 'line'

    this.onInteractionEnd = info.onInteractionEnd ?? 'line'
    const { currentPagePoint } = inputs
    const id = createShapeId()

    const prev = this.editor.getSelectedShapes().filter(isSegmentShape).at(-1) ?? null

    this.editor.createShapes([{
      id,
      type: info.from ?? 'line',
      x: currentPagePoint.x,
      y: currentPagePoint.y,
    }])

    if (prev) {
      const orphans = this.editor
        .getCurrentPageShapes()
        .filter(isEditorOrphanedShape)
        .filter(isLineShape)

      const line = orphans.at(0)
      if (!line)
        throw new Error('Line Select Tool: No line shape found')

      const edge = getLineShapeEdgeAbsolute(line.x, line.y, line.props.points)
      const vertices = edge.getVertices()

      if (vertices.length !== 2)
        return

      const [start, end] = vertices
      const segment = createSegmentShape({
        start,
        end,
        id: line.id,
        color: prev.props.color,
        meta: { ...prev.meta },
      })
      this.editor.createShape(segment)
    }

    this.editor.select(id)
    this.shape = this.editor.getShape(id)!
  }

  override onPointerMove: TLEventHandlers['onPointerMove'] = () => {
    if (!this.shape)
      return

    this.parent.transition('moving', {
      shapeId: this.shape.id,
      from: this.from,
      onInteractionEnd: this.onInteractionEnd,
    })
  }

  override onCancel: TLEventHandlers['onCancel'] = () => {
    this.cancel()
  }

  override onComplete: TLEventHandlers['onComplete'] = () => {
    this.complete()
  }

  override onInterrupt: TLInterruptEvent = () => {
    this.editor.setCurrentTool(this.onInteractionEnd)
    this.editor.deselect(...this.editor.getSelectedShapeIds())
    this.editor.snaps.clearIndicators()
  }

  complete() {
    this.editor.setCurrentTool(this.onInteractionEnd)
    this.editor.deselect(...this.editor.getSelectedShapeIds())
    this.editor.snaps.clearIndicators()
  }

  cancel() {
    this.editor.setCurrentTool(this.onInteractionEnd)
    this.editor.deselect(...this.editor.getSelectedShapeIds())
    this.editor.snaps.clearIndicators()
  }
}
