import type { TLEnterEventHandler, TLExitEventHandler, TLGeoShape, TLPointerEvent } from 'tldraw'
import type { AnnotShapePartial } from '../../shape/shape'
import { GeoShapeTool } from 'tldraw'
import { z } from 'zod'
import { isGeoShape } from '../shape-util/geo'

const creatingEvent = z.object({
  info: z.object({
    isCreating: z.literal(true),
    // This one is tricky.
    // We need to catch a "geo" id, then override it to tool id.
    // The schema here is to catch the correct event.
    // In practice, the event will be modified right after this catch.
    onInteractionEnd: z.literal('geo'),
  }),
  to: z.literal('select'),
})

export type GeoToBoxAnnot = (props: {
  geo: TLGeoShape
}) => AnnotShapePartial

export abstract class AnnotBoxTool extends GeoShapeTool {
  override onEnter: TLEnterEventHandler = () => {
    // It's better (i.e., less confusing) to return to "select" and let the
    // user edit the created area.
    this.editor.updateInstanceState({ isToolLocked: false })
  }

  /**
   * Convert a newly created geo shape to an annotation shape.
   */
  abstract toAnnot: GeoToBoxAnnot

  /**
   * What:
   * Disable the built-in "click to create" behaviour.
   *
   * Why:
   * tldraw's GeoShapeTool supports 2 very different ways of creating a new shape,
   * based on the user's interaction:
   *
   * If the user drags (onPointerMove):
   *   1. Create a 1x1 GeoShape, then
   *   2. Transition to SelectTool's dragging state for resizing.
   * -> We should support this case.
   *
   * If the user clicks (onPointerUp):
   *   1. Create a medium-sized GeoShape, then
   *   2. Stay at GeoShapeTool (because we have tool locked globally).
   * -> We should NOT support this case.
   *
   * How: This is defined at GeoShapeTool's "Pointing" child,
   * which we don't have access to extend for good reasons.
   * However, we can always cancel the behaviour by transitioning,
   * e.g., back to the "Idle" child,
   * as parent always handles events before children.
   */
  override onPointerUp: TLPointerEvent = () => {
    this.transition('idle')
  }

  override onExit: TLExitEventHandler = (info: unknown, to) => {
    // Always reset tool to default
    this.editor.updateInstanceState({ isToolLocked: false })

    // Update tldraw's newly created GeoShape to our AnnotShape.
    // The shape is actually created inside GeoShapeTool's Pointing,
    // but we don't have access there to extend it (for good reasons).
    // However, because GeoShapeTool hands over the resizing to SelectTool,
    // we can apply our update right here before its exit.
    const creating = creatingEvent.safeParse({ info, to })
    if (!creating.success)
      // There may be other expected cases where "on exit" could be triggered
      // without creating a geo shape (e.g., the user cancelled the action),
      // so we should not throw error here.
      return

    // Update the shape from original "geo" to our annot shape,
    // both visually ("props") and functionally ("meta").
    const geo = this.editor.getOnlySelectedShape()
    // At this point we should have a geo shape,
    // otherwise it's a coding error or tldraw changes their implementation.
    if (!geo)
      throw new Error(`Expected a geo shape, but received "undefined".`)
    if (!isGeoShape(geo))
      throw new Error(`Expected a geo shape, but received "${geo.type}".`)

    const annot = this.toAnnot({ geo })
    this.editor.updateShape(annot);

    // "geo shape" tool passes a literal "geo" id when transition to "select" tool,
    // which would break the app because it should be the current tool id.
    // Therefore, we need to manually override it here.
    //
    // Also, we need to mutate the original "info" object because:
    // 1. It is passed by reference during tools transition.
    // 2. In parsing, Zod does not return the original object but a copy.
    (info as typeof creating.data.info).onInteractionEnd = this.id as 'geo'
  }
}
