import type { TLShape, TLShapePartial, UnknownRecord } from 'tldraw'
import { isShape } from 'tldraw'
import z from 'zod'

export interface AnnotMetaBase {
  type: 'annot'
  /**
   * Group shapes into annots
   * - For segment shapes, use to group shapes into a polyline
   * - For box shapes and polygon shapes, each shape is a group itself
   */
  group: string | null
  /**
   * Name of annot, set by user
   */
  name: string
}

export type AnnotShapeBase = TLShape & { meta: AnnotMetaBase }

export function isAnnotShapeBase(shape: TLShape): shape is AnnotShapeBase {
  const test = shape as AnnotShapeBase
  return test.meta.type === 'annot'
}

const recordSchema = z.object({ id: z.string(), typeName: z.string() }).loose()

export const editorShapeBaseSchema = z.custom<TLShape>((value) => {
  const recordTest = recordSchema.safeParse(value)
  if (!recordTest.success)
    return false
  // This is the best we can do, because UnknownRecord.id is typed in a way
  // that would be very difficult for zod to correctly infer.
  const record = recordTest.data as unknown as UnknownRecord
  return isShape(record)
})

/**
 * "Orphaned" is a weak term for tldraw's shapes that are just created but not
 * updated to one of our shapes (e.g., predict areas, annots).
 *
 * In general, there should not be a permanent orphaned shape as they should be
 * immediately updated to one of our shapes the moment after they are created.
 *
 * @TODO: Make this contract stricter? E.g., there should be a "Shape" type
 * that requires a "meta.type" that all of our shapes should based on.
 */
export function isEditorOrphanedShape(shape: TLShape): boolean {
  return shape.meta.type === undefined
}

/**
 * It's intentional that, unlike tldraw's ShapePartial, our wrapper does not
 * allow optional "meta". We are using "meta" for identification purpose so
 * it must always be defined, especially in creating situations. This is similar
 * to how tldraw's "id" and "type" are always required in partial shapes.
 */
export type EditorShapePartial<
  Shape extends TLShape,
  Meta,
>
  = & TLShapePartial<Shape>
    & { meta: Meta }
