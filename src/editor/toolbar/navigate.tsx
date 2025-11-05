import type { ReactElement } from 'react'
import * as ToggleGroup from '@radix-ui/react-toggle-group'
import { Hand, MousePointer, Search } from 'lucide-react'
import { twJoin } from 'tailwind-merge'
import { HandTool, SelectTool, track, useEditor, ZoomTool } from 'tldraw'

const toggleGroupItemClasses = twJoin(
  'flex items-center justify-center p-10 rounded-4 text-gray-11',
  'hover:bg-gray-3 focus:outline-none',
)

export const EditorToolbarNavigate = track((): ReactElement => {
  const editor = useEditor()

  return (
    <ToggleGroup.Root
      type="single"
      className="flex flex-col gap-4 bg-gray-1 p-6 border border-gray-6 rounded-4"
      value={editor.getCurrentToolId()}
      onValueChange={(value) => {
        editor.setCurrentTool(value)
      }}
    >
      <ToggleGroup.Item
        className={toggleGroupItemClasses}
        value={SelectTool.id}
      >
        <MousePointer size={16} />
      </ToggleGroup.Item>
      <ToggleGroup.Item
        className={toggleGroupItemClasses}
        value={HandTool.id}
      >
        <Hand size={16} />
      </ToggleGroup.Item>
      <ToggleGroup.Item
        className={toggleGroupItemClasses}
        value={ZoomTool.id}
      >
        <Search size={16} />
      </ToggleGroup.Item>
    </ToggleGroup.Root>
  )
})
