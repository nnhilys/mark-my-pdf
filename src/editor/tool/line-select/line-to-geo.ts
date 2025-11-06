import type { TLEnterEventHandler, TLEventHandlers, TLLineShape, TLShape } from 'tldraw'
import { StateNode } from 'tldraw'
import { isSegmentShape } from '../../../shape/segment/shape'
import { isAnnotShape } from '../../../shape/shape'

interface onEnterGeoToolInfo {
  direction: 'up' | 'down'
  extension: boolean
  onInteractionEnd: string
}

export class LineSelectLineToGeo extends StateNode {
  static override id = 'line-to-geo'

  markId = ''

  shape = {} as TLShape

  onInteractionEnd = 'line'

  override onEnter?: TLEnterEventHandler | undefined = ({ info, shape }: { info: onEnterGeoToolInfo, shape: TLLineShape }) => {
    if (!shape)
      throw new Error('No shape found')

    this.onInteractionEnd = info.onInteractionEnd ?? 'line'

    if (isAnnotShape(shape)) {
      const prev = this.editor.getSelectedShapes().filter(isSegmentShape).at(-1) ?? null

      if (prev)
        this.editor.deleteShape(prev)

      this.shape = shape
      this.editor.select(shape.id)
    }
  }

  override onPointerMove: TLEventHandlers['onPointerMove'] = () => {
    if (!this.shape)
      return

    this.parent.transition('geo-to-line', {
      shape: this.shape,
      onInteractionEnd: this.onInteractionEnd,
    })
  }
}
