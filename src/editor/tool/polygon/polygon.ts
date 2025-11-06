import type { TLExitEventHandler, TLStateNodeConstructor } from 'tldraw'
import type { AnnotShapePartial } from '../../../shape/shape'
import type { PolygonShapeBase } from './shape'
import { StateNode } from 'tldraw'
import { PolygonIdle } from './idle'
import { PolygonMoving } from './moving'
import { PolygonPointing } from './pointing'
import { isPolygonShapeBase } from './shape'

export type PolygonToAnnot = (props: {
  polygon: PolygonShapeBase
}) => AnnotShapePartial

export abstract class AnnotPolygonTool extends StateNode {
  static override id = 'polygon'
  static override initial = 'idle'

  static override children = (): TLStateNodeConstructor[] => [
    PolygonIdle,
    PolygonPointing,
    PolygonMoving,
  ]

  override shapeType = 'polygon'

  /**
   * Convert a newly created polygon shape to an annotation shape.
   */
  abstract toAnnot: PolygonToAnnot

  override onExit: TLExitEventHandler = () => {
    const polygon = this.editor.getOnlySelectedShape()
    if (!polygon)
      return
    if (!isPolygonShapeBase(polygon))
      throw new Error(`Expected a polygon shape, but received "${polygon.type}".`)

    const annot = this.toAnnot({ polygon })
    this.editor.updateShape(annot)
  }
}
