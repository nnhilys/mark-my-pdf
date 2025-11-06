import type { TLEventHandlers, TLInterruptEvent, TLShapeId, TLShapePartial } from 'tldraw'
import type { PolygonShape } from '../../../shape/polygon/shape'
import { createShapeId, getIndexAbove, Mat, sortByIndex, StateNode, Vec } from 'tldraw'

// const MINIMUM_DISTANCE_BETWEEN_HANDLES = 2
export class PolygonPointing extends StateNode {
  static override id = 'pointing'

  shape = {} as PolygonShape

  markId: string | undefined

  isDragging = false

  override onEnter = (info: { shapeId?: TLShapeId, isDragging: boolean }) => {
    const shape = info.shapeId && this.editor.getShape<PolygonShape>(info.shapeId)
    // add new points to the current shapes
    // different from lines tool
    this.markId = undefined

    if (shape) {
      this.markId = `creating:${shape.id}`
      this.editor.markHistoryStoppingPoint(this.markId)
      this.shape = shape
      const handles = this.editor.getShapeHandles(this.shape)
      if (!handles)
        return

      const vertexHandles = handles
        .filter(handle => handle.type === 'vertex')
        .sort(sortByIndex)

      // we don't use .at(-1) here because it somehow undefined
      const endHandle = vertexHandles[vertexHandles.length - 1]

      if (info.isDragging) {
        const lastHandle = last(handles)!
        const nextHandle = lastHandle
        const util = this.editor.getShapeUtil(this.shape)

        const changes = util.onHandleDrag?.(this.shape, {
          handle: nextHandle,
          isPrecise: false,
          initial: this.shape,
          isCreatingShape: true,
        })

        const next: TLShapePartial<PolygonShape> = {
          ...this.shape,
          type: this.shape.type,
          ...changes,
        }
        if (Object.values(this.shape.props.points).length === 3) {
          this.editor.deleteShape(this.shape.id)
          this.editor.setCurrentTool('select')
          return
        }
        if (changes)
          this.editor.updateShapes([next])
      }
      if (endHandle.x === this.shape.props.points.a1.x
        && endHandle.y === this.shape.props.points.a1.y) {
        this.editor.select(this.shape.id)
        this.editor.setCurrentTool('select')
        return
      }

      const shapePagePoint = Mat.applyToPoint(
        this.editor.getShapeParentTransform(this.shape)!,
        new Vec(this.shape.x, this.shape.y),
      )

      const nextPoint = Vec.Sub(this.editor.inputs.currentPagePoint, shapePagePoint)
      const points = structuredClone(this.shape.props.points)

      // Add a new point
      const nextIndex = getIndexAbove(endHandle.index)

      points[nextIndex] = {
        id: nextIndex,
        index: nextIndex,
        x: nextPoint.x,
        y: nextPoint.y,
      }

      this.editor.updateShapes([
        { id: this.shape.id, type: this.shape.type, props: { points } },
      ])

      this.editor.select(this.shape.id)
    }
    else {
      const id = createShapeId()
      this.markId = `creating:${id}`
      this.editor.markHistoryStoppingPoint(this.markId)
      this.editor.createShapes<PolygonShape>([{
        id,
        type: 'polygon',
        x: this.editor.inputs.currentPagePoint.x,
        y: this.editor.inputs.currentPagePoint.y,
        props: {
          color: 'grey',
        },
      }])
      this.editor.select(id)
      this.shape = this.editor.getShape(id)!
    }
  }

  override onPointerMove: TLEventHandlers['onPointerMove'] = () => {
    if (!this.shape)
      return

    const handles = this.editor.getShapeHandles(this.shape)

    if (!handles)
      throw new Error('No handles found')

    const lastHandle = structuredClone(last(handles)!)

    this.parent.transition('moving', {
      shape: this.shape,
      handle: { ...lastHandle },
    })
  }

  override onCancel: TLEventHandlers['onCancel'] = () => {
    this.cancel()
  }

  override onComplete: TLEventHandlers['onComplete'] = () => {
    this.complete()
  }

  override onRightClick: TLEventHandlers['onRightClick'] = () => {
    const firstPoint = this.shape.props.points.a1

    const shape = this.shape

    const handles = this.editor.getShapeHandles(shape)
    if (!handles)
      return

    const vertexHandles = handles
      .filter(handle => handle.type === 'vertex')
      .sort(sortByIndex)

    const endHandle = vertexHandles[vertexHandles.length - 1]

    const nextHandle = {
      ...endHandle,
      x: firstPoint.x,
      y: firstPoint.y,
    }

    const util = this.editor.getShapeUtil(shape)

    const changes = util.onHandleDrag?.(shape, {
      handle: nextHandle,
      isPrecise: false,
      initial: shape,
      isCreatingShape: false,
    })

    const next: TLShapePartial<PolygonShape> = {
      id: shape.id,
      type: shape.type,
      meta: {
        ...shape.meta,
        isClosed: true,
      },
      ...changes,
    }

    if (changes)
      this.editor.updateShapes([next])

    this.complete()
    this.editor.setCurrentTool('select')
  }

  override onInterrupt: TLInterruptEvent = () => {
    this.parent.transition('idle')
    if (this.markId)
      this.editor.bailToMark(this.markId)
    this.editor.snaps.clearIndicators()
  }

  complete() {
    this.parent.transition('idle', { shapeId: this.shape.id })
    this.editor.snaps.clearIndicators()
  }

  cancel() {
    const firstPoint = this.shape.props.points.a1

    const shape = this.shape

    const handles = this.editor.getShapeHandles(shape)
    if (!handles)
      return

    const vertexHandles = handles
      .filter(handle => handle.type === 'vertex')
      .sort(sortByIndex)

    const endHandle = vertexHandles[vertexHandles.length - 1]

    const nextHandle = {
      ...endHandle,
      x: firstPoint.x,
      y: firstPoint.y,
    }

    const util = this.editor.getShapeUtil(shape)

    const changes = util.onHandleDrag?.(shape, {
      handle: nextHandle,
      isPrecise: false,
      initial: shape,
      isCreatingShape: false,
    })

    const next: TLShapePartial<PolygonShape> = {
      id: shape.id,
      ...changes,
      type: shape.type,
      meta: {
        ...shape.meta,
        isClosed: true,
      },
    }

    if (changes)
      this.editor.updateShapes([next])

    this.complete()
    this.editor.setCurrentTool('select')
  }
}

export function last<T>(arr: readonly T[]): T | undefined {
  return arr[arr.length - 1]
}
