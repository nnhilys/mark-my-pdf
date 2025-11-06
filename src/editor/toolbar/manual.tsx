import type { ReactElement } from 'react'
import * as ToggleGroup from '@radix-ui/react-toggle-group'
import { LineSquiggle, Pentagon, RectangleHorizontal } from 'lucide-react'
import { twJoin } from 'tailwind-merge'
import { track, useEditor } from 'tldraw'
import { BOX_TOOL_ID } from '../../shape/box/tool'
import { POLYGON_TOOL_ID } from '../../shape/polygon/tool'
import { SEGMENT_TOOL_ID } from '../../shape/segment/tool'

const toggleGroupItemClasses = twJoin(
  'flex items-center justify-center p-10 rounded-4 text-gray-11',
  'hover:bg-gray-3 focus:outline-none',
  'data-[state=on]:bg-accent-4 data-[state=on]:text-accent-11',
)

export const EditorToolbarManual = track((): ReactElement => {
  const editor = useEditor()

  return (
    <ToggleGroup.Root
      type="single"
      className="flex gap-4"
      value={editor.getCurrentToolId()}
      onValueChange={(value) => {
        editor.setCurrentTool(value)
      }}
    >
      <ToggleGroup.Item
        className={toggleGroupItemClasses}
        value={BOX_TOOL_ID}
      >
        <RectangleHorizontal size={18} />
      </ToggleGroup.Item>
      <ToggleGroup.Item
        className={toggleGroupItemClasses}
        value={SEGMENT_TOOL_ID}
      >
        <LineSquiggle size={18} />
      </ToggleGroup.Item>
      <ToggleGroup.Item
        className={toggleGroupItemClasses}
        value={POLYGON_TOOL_ID}
      >
        <Pentagon size={18} />
      </ToggleGroup.Item>
    </ToggleGroup.Root>
  )
})
