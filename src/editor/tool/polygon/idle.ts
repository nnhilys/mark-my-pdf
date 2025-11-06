import type { TLEnterEventHandler, TLEventHandlers, TLShapeId } from 'tldraw'
import { StateNode } from 'tldraw'

export class PolygonIdle extends StateNode {
  static override id = 'idle'

  private shapeId = '' as TLShapeId

  override onEnter: TLEnterEventHandler = (info: { shapeId: TLShapeId }) => {
    this.shapeId = info.shapeId
    this.editor.setCursor({ type: 'cross', rotation: 0 })

    this.editor.updateInstanceState({
      isToolLocked: true,
    })

    this.editor.user.updateUserPreferences({ isSnapMode: true })
  }

  override onPointerDown: TLEventHandlers['onPointerDown'] = () => {
    this.parent.transition('pointing', { shapeId: this.shapeId })
  }

  override onCancel = () => {
    this.editor.setCurrentTool('select')
  }
}
