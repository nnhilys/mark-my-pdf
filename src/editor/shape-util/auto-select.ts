import type { Editor, TLShape } from 'tldraw'
import { isAnnotShape } from '../../shape/shape'

// @todo: Extract logic to individual shape to handle?
function selectGroup(params: { editor: Editor, shape: TLShape }): boolean {
  const { editor, shape } = params

  const selection = editor.getSelectedShapeIds()

  if (selection.length > 1 && selection.includes(shape.id)) {
    editor.select(shape.id)
    return true
  }

  const all = editor.getCurrentPageShapes()
  const siblings = all.filter((s) => {
    return isAnnotShape(s)
      && s.meta.group === shape.meta.group
      && s.type === shape.type
  })

  window.setTimeout(() => {
    editor.select(...siblings)
  }, 0)

  return true
}

export function autoSelectEditorShape(params: { editor: Editor, shape: TLShape }): void {
  const { editor, shape } = params
  // There's only one auto logic for now,
  // but if we have more,
  // rely on the boolean returned to skip other checks
  selectGroup({ editor, shape })
}
