import type { ReactElement } from 'react'
import { Copy } from 'lucide-react'
import { useHotkeys } from 'react-hotkeys-hook'
import { track, useEditor } from 'tldraw'

export const ToolbarDuplicate = track((): ReactElement => {
  const editor = useEditor()

  const duplicateShapes = () => {
    const prev = editor.getSelectedShapes()

    editor.markHistoryStoppingPoint()
    editor.duplicateShapes(prev, { x: 20, y: 20 })
  }

  useHotkeys('mod+d', duplicateShapes)

  return (
    <button type="button" className="p-10" onClick={duplicateShapes}>
      <Copy size={18} />
    </button>
  )
})
