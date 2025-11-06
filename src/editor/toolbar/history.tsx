import type { ReactElement } from 'react'
import { Redo, Undo } from 'lucide-react'
import { useHotkeys } from 'react-hotkeys-hook'
import { track, useEditor } from 'tldraw'

export const EditorToolbarHistory = track((): ReactElement => {
  const editor = useEditor()

  const canUndo = editor.getCanUndo()
  const canRedo = editor.getCanRedo()

  const undo = () => editor.undo()
  const redo = () => editor.redo()

  useHotkeys('mod+z', undo)
  useHotkeys('mod+y', redo)

  return (
    <>
      <button
        type="button"
        className="p-10 disabled:text-gray-7"
        onClick={undo}
        disabled={!canUndo}
      >
        <Undo size={18} />
      </button>
      <button
        type="button"
        className="p-10 disabled:text-gray-7"
        onClick={redo}
        disabled={!canRedo}
      >
        <Redo size={18} />
      </button>
    </>
  )
})
