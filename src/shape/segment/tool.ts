import type { TLEnterEventHandler, TLExitEventHandler, TLPointerEvent, TLShapeId } from 'tldraw'
import type { SegmentShape } from './shape'
import { LineShapeTool } from 'tldraw'
import { z } from 'zod'
import { isLineShape } from '../../editor/shape-util/line'
import { isEditorOrphanedShape } from '../base'
import { lockEditorTool } from '../tool'
import { createSegmentShape } from './create'
import { getLineShapeEdgeAbsolute } from './edge'
import { isSegmentShape } from './shape'

/**
 * To validate the creating event. We may not use all the values here, but we
 * need to define them for the validation to be correct.
 */
const creatingSchema = z.object({
  info: z.object({
    isCreating: z.literal(true),
    // This is the literal "id" of the original LineShapeTool. We'll update
    // them at "onExit".
    onInteractionEnd: z.literal('line'),
  }),
  to: z.literal('select'),
})

export const SEGMENT_TOOL_ID = 'Segment'

export function createSegmentShapeTool() {
  return class SegmentShapeTool extends LineShapeTool {
    static override id = SEGMENT_TOOL_ID

    /**
     * Remember the last segment selected for two reasons:
     * 1. To continue a pipeline, i.e., maintaining "color" and "meta.group".
     * 2. To re-select if the current shape is deleted (see onPointerUp below).
     *
     * This does not need to be a flat segment, because the user should be able
     * to continue from a vertical or extension segment.
     */
    prev: SegmentShape | null = null

    /**
     * Store the created shape because we may delete it later (see "onPointerUp"
     * below).
     */
    shapeID: TLShapeId | null = null

    override onEnter: TLEnterEventHandler = () => {
      lockEditorTool(this.editor)
      // @TODO: It would be great if we can reset the tool lock status some
      // where in this tool. The Piece tool reset the lock at "onExit", but the
      // LineShapeTool goes back and forth to SelectTool so it's more complicated.
      // (e.g., if we reset at "onExit", SelectTool won't give back the control to
      // us.)
    }

    /**
     * Convert the newly created line shape to a flat segment.
     */
    convert(): TLShapeId | null {
      const orphans = this.editor
        .getCurrentPageShapes()
        .filter(isEditorOrphanedShape)
        .filter(isLineShape)

      const line = orphans.at(0)
      // User is adding a new segment to existing line so there is no orphaned line.
      if (!line)
        return null

      const edge = getLineShapeEdgeAbsolute(line.x, line.y, line.props.points)

      const vertices = edge.getVertices()
      if (vertices.length !== 2)
        return null

      const [start, end] = vertices
      const segment = createSegmentShape({
        start,
        end,
        //
        id: line.id,
        color: this.prev?.props.color ?? null,
        meta: {
          group: this.prev?.meta.group?.toString() ?? null,
          name: this.prev?.meta.name ?? '',
        },
      })

      this.editor.createShape(segment)

      return segment.id
    }

    override onPointerDown: TLPointerEvent = () => {
      // Users may select 0, 1, or several segments before adding this new one.
      this.prev = this.editor
        .getSelectedShapes()
        .filter(isSegmentShape)
        .at(0) ?? null

      this.editor.setCurrentTool('line-select', {
        from: 'line',
        onInteractionEnd: SegmentShapeTool.id,
      })

      // The (orphaned) shape is created in a child tool so it's only available
      // in the next cycle.
      window.setTimeout(() => {
        this.shapeID = this.convert()
      }, 0)
    }

    override onExit: TLExitEventHandler = (info: unknown, to) => {
      // Fix literal tool ID issue.
      //
      // When using the LineShapeTool to draw a line, it starts with two points
      // close together and switches to the SelectTool for the user to extend the
      // line. Once the user is done and releases the mouse, the plan is for
      // control to go back to the LineShapeTool or another specified tool.
      //
      // However, because the LineShapeTool is mistakenly identified by a fixed name
      // "line" instead of its proper ID, the control doesn't shift correctly to the
      // intended SegmentTool, but rather tries to switch to a LineShapeTool that
      // doesn't exist.
      const creating = creatingSchema.safeParse({ info, to })
      if (creating.success) {
        const typedInfo = info as typeof creating.data.info
        typedInfo.onInteractionEnd = SegmentShapeTool.id as 'line'
      }
    }

    override onPointerUp: TLPointerEvent = () => {
      // Deletes a nearly-empty line.
      //
      // This is necessary because the LineShapeTool creates a nearly-empty line
      // on pointer down, and relies on the SelectTool to provide its length via
      // dragging. If the user does not drag, the SelectTool does not take over,
      // leaving a nearly-empty line.
      //
      // When the tool is not locked, the user can immediately drag the handles to
      // give it length. However, when using the SegmentTool, which is a locked
      // tool, the nearly-empty line would still remain while the user's drag
      // creates a new line. Deleting this nearly-empty line helps to avoid
      // confusion.
      //
      // We don't need to check if there's no dragging here. This function is
      // used only when the SelectTool doesn't take control. If the user drags
      // the pointer after pressing it down, the SegmentTool will not be in
      // control anymore.
      //
      // The LineShapeTool automatically selects a shape after creating it. If we
      // delete the shape here, we need to switch the selection back to the
      // previous shape. This way, the user's selection remains uninterrupted.
      if (this.prev !== null)
        this.editor.select(this.prev)
    }
  }
}
