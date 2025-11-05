import type { ReactElement } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { track, useEditor } from 'tldraw'
import { ToolbarDelete } from './delete'
import { ToolbarDuplicate } from './duplicate'
import { ToolbarHistory } from './history'

export const ToolbarBox = track((): ReactElement => {
  const editor = useEditor()

  useHotkeys('mod+a', () => editor.selectAll())

  return (
    <div
      className="flex p-8 overflow-x-auto overflow-y-hidden text-gray-11"
      draggable={false}
    >
      <ToolbarHistory />
      <ToolbarDuplicate />
      <ToolbarDelete />
    </div>
  )
})
