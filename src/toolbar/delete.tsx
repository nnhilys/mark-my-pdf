import type { ReactElement } from 'react'
import { Trash2 } from 'lucide-react'
import { useHotkeys } from 'react-hotkeys-hook'
import { track, useEditor } from 'tldraw'

export const ToolbarDelete = track((): ReactElement => {
  const editor = useEditor()

  // Heads up: This intentionally deletes all types of shapes.
  const deleteShapes = () => {
    const shapes = editor.getSelectedShapes()

    editor.markHistoryStoppingPoint()
    editor.deleteShapes(shapes)
  }

  useHotkeys(['Delete', 'Backspace'], deleteShapes)

  return (
    <button type="button" className="p-10" onClick={deleteShapes}>
      <Trash2 size={18} />
    </button>
  )
})
