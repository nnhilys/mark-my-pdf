import type { TLCancelEvent, TLEnterEventHandler, TLEventHandlers, TLHandle, TLKeyboardEvent, TLPointerEventInfo, TLShapeId, TLShapePartial } from 'tldraw'
import type { PolygonShape } from '../../../shape/polygon/shape'
import { sortByIndex, StateNode, Vec } from 'tldraw'

export class PolygonMoving extends StateNode {
  static override id = 'moving'

  shapeId = '' as TLShapeId
  initialHandle = {} as TLHandle
  initialAdjacentHandle = null as TLHandle | null
  initialPagePoint = {} as Vec

  markId = ''
  initialPageTransform: any
  initialPageRotation: any

  info = {} as TLPointerEventInfo & {
    shape: PolygonShape
    target: 'handle'
    onInteractionEnd?: string
  }

  isPrecise = false
  isPreciseId = null as TLShapeId | null
  pointingId = null as TLShapeId | null

  override onEnter: TLEnterEventHandler = (
    info: TLPointerEventInfo & {
      shape: PolygonShape
      target: 'handle'
      onInteractionEnd?: string
    },
  ) => {
    const { shape, handle } = info
    this.info = info
    this.parent.setCurrentToolIdMask(info.onInteractionEnd)
    this.shapeId = shape.id
    this.markId = `creating:${shape.id}`
    this.initialHandle = structuredClone(handle)

    this.initialPageTransform = this.editor.getShapePageTransform(shape)!
    this.initialPageRotation = this.initialPageTransform.rotation()
    // Heads up: this is the last pointer _down_ position
    this.initialPagePoint = this.editor.inputs.originPagePoint.clone()

    this.editor.setCursor({ type: 'cross', rotation: 0 })

    const handles = this.editor.getShapeHandles(shape)!.sort(sortByIndex)
    const index = handles.findIndex(h => h.id === info.handle.id)

    // Find the adjacent handle for snapping
    this.initialAdjacentHandle = null

    // Start from the handle and work forward
    for (let i = index + 1; i < handles.length; i++) {
      const handle = handles[i]
      if (handle.type === 'vertex' && handle.id !== 'middle' && handle.id !== info.handle.id) {
        this.initialAdjacentHandle = handle
        break
      }
    }

    // If still no handle, start from the end and work backward
    if (!this.initialAdjacentHandle) {
      for (let i = handles.length - 1; i >= 0; i--) {
        const handle = handles[i]
        if (handle.type === 'vertex' && handle.id !== 'middle' && handle.id !== info.handle.id) {
          this.initialAdjacentHandle = handle
          break
        }
      }
    }

    this.editor.select(this.shapeId)
  }

  override onPointerMove: TLEventHandlers['onPointerMove'] = () => {
    this.update()
  }

  override onKeyDown: TLKeyboardEvent | undefined = () => {
    this.update()
  }

  override onKeyUp: TLKeyboardEvent | undefined = () => {
    this.update()
  }

  /**
   * It's important that we complete a handle on pointer _down_, not _up_,
   * because our positioning of the _next_ handle is
   * based on the last pointer _down_ position on the page.
   * See "onEnter" for more details.
   */
  override onPointerDown: TLEventHandlers['onPointerDown'] = () => {
    this.complete()
  }

  override onComplete: TLEventHandlers['onComplete'] = () => {
    this.complete()
  }

  override onCancel: TLCancelEvent = () => {
    this.cancel()
  }

  override onExit = () => {
    this.parent.setCurrentToolIdMask(undefined)
    this.editor.setHintingShapes([])
    this.editor.snaps.clearIndicators()
    this.editor.setCursor({ type: 'default', rotation: 0 })
  }

  override onRightClick: TLEventHandlers['onRightClick'] = () => {
    const firstPoint = this.info.shape.props.points.a1

    const initial = this.info.shape

    const shape = this.editor.getShape<PolygonShape>(initial)
    if (!shape)
      return

    const nextHandle = {
      ...this.initialHandle,
      x: firstPoint.x,
      y: firstPoint.y,
    }

    const util = this.editor.getShapeUtil(initial)

    const changes = util.onHandleDrag?.(shape, {
      handle: nextHandle,
      isPrecise: this.isPrecise,
      initial,
      isCreatingShape: false,
    })

    const next: TLShapePartial<PolygonShape> = {
      id: shape.id,
      type: shape.type,
      ...changes,
      meta: {
        ...shape.meta,
        isClosed: true,
      },
    }

    if (changes)
      this.editor.updateShapes([next])

    this.parent.transition('pointing', { shapeId: this.shapeId })
  }

  private complete() {
    this.editor.snaps.clearIndicators()
    if (this.checkClosedPath()) {
      this.editor.setCurrentTool('select')
      const initial = this.info.shape

      const shape = this.editor.getShape<PolygonShape>(initial)
      if (!shape)
        return

      const next: TLShapePartial<PolygonShape> = {
        id: shape.id,
        type: shape.type,
        meta: {
          ...shape.meta,
          isClosed: true,
        },
      }
      this.editor.updateShapes([next])
    }

    else { this.parent.transition('pointing', { shapeId: this.shapeId }) }
  }

  private cancel(isDragging: boolean = false) {
    const firstPoint = this.info.shape.props.points.a1

    const initial = this.info.shape

    const shape = this.editor.getShape<PolygonShape>(initial)
    if (!shape)
      return

    const nextHandle = {
      ...this.initialHandle,
      x: firstPoint.x,
      y: firstPoint.y,
    }

    const util = this.editor.getShapeUtil(initial)

    const changes = util.onHandleDrag?.(shape, {
      handle: nextHandle,
      isPrecise: this.isPrecise,
      initial,
      isCreatingShape: false,
    })

    const next: TLShapePartial<PolygonShape> = {
      id: shape.id,
      type: shape.type,
      ...changes,
    }

    if (changes)
      this.editor.updateShapes([next])

    this.parent.transition('pointing', { shapeId: this.shapeId, isDragging })
  }

  private checkClosedPath(): boolean {
    const THRESH_HOLD = 2
    // "shapeId" could point to an invalid shape
    const handles = this.editor.getShapeHandles(this.shapeId)?.sort(sortByIndex)
    if (!handles)
      return false
    const last = handles[handles.length - 1]
    const first = handles[0]

    // TODO: support update last point into first point
    // better -> crate polygon shape or removing the point entirely
    return Vec.DistMin(last, first, THRESH_HOLD)
  }

  private update() {
    const { editor, shapeId, initialPagePoint } = this
    const { initialHandle, initialPageRotation } = this
    const isSnapMode = this.editor.user.getIsSnapMode()
    const {
      snaps,
      inputs: { currentPagePoint, ctrlKey, altKey },
    } = editor

    const initial = this.info.shape

    const shape = editor.getShape<PolygonShape>(shapeId)
    if (!shape)
      return
    const util = editor.getShapeUtil(shape)

    const point = currentPagePoint
      .clone()
      .sub(initialPagePoint)
      .rot(-initialPageRotation)
      .add(initialHandle)

    // Clear any existing snaps
    editor.snaps.clearIndicators()

    let nextHandle = { ...initialHandle, x: point.x, y: point.y }

    if (initialHandle.snapType === 'point' && (isSnapMode ? !ctrlKey : ctrlKey)) {
      // We're snapping
      const pageTransform = editor.getShapePageTransform(shape.id)
      if (!pageTransform)
        throw new Error('Expected a page transform')

      const snap = snaps.handles.snapHandle({ currentShapeId: shapeId, handle: nextHandle })

      if (snap) {
        snap.nudge.rot(-editor.getShapeParentTransform(shape)!.rotation())
        point.add(snap.nudge)
        nextHandle = { ...initialHandle, x: point.x, y: point.y }
      }
    }

    const changes = util.onHandleDrag?.(shape, {
      handle: nextHandle,
      isPrecise: this.isPrecise || altKey,
      initial,
      isCreatingShape: true,
    })

    const next: TLShapePartial<PolygonShape> = {
      id: shape.id,
      type: shape.type,
      ...changes,
    }

    if (changes)
      editor.updateShapes([next])
  }
}
