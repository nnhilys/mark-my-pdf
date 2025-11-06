import type { ReactElement } from 'react'
import { DropdownMenu, Text } from '@radix-ui/themes'
import { Maximize2, Minimize2, ScanSearch, ZoomIn, ZoomOut } from 'lucide-react'
import { useHotkeys } from 'react-hotkeys-hook'
import { track, useEditor } from 'tldraw'
import { cameraMoveOptions, EDITOR_CAMERA } from '../camera'

export const EditorToolbarZoom = track((): ReactElement => {
  const editor = useEditor()
  const level = editor.getZoomLevel()

  const zoomIn = () => {
    if (level < EDITOR_CAMERA.zoomMax) {
      editor.zoomIn(editor.getViewportScreenCenter(), cameraMoveOptions)
    }
  }

  const zoomOut = () => {
    if (level > EDITOR_CAMERA.zoomMin) {
      editor.zoomOut(editor.getViewportScreenCenter(), cameraMoveOptions)
    }
  }

  const resetZoom = () => {
    if (level !== 1) {
      editor.resetZoom(editor.getViewportScreenCenter(), cameraMoveOptions)
    }
  }

  const toSelection = () => {
    if (editor.getSelectedShapes().length > 0) {
      editor.zoomToSelection(cameraMoveOptions)
    }
  }

  const toContent = () => {
    if (editor.getCurrentPageShapeIds().size > 0) {
      editor.zoomToFit(cameraMoveOptions)
    }
  }

  useHotkeys('minus', zoomOut)
  useHotkeys('equal', zoomIn)

  return (
    <>
      <button
        type="button"
        className="p-10 rounded-4 hover:bg-gray-3"
        onClick={zoomOut}
      >
        <ZoomOut size={20} />
      </button>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <button
            type="button"
            className="flex items-center gap-8 p-10 rounded-4 hover:bg-gray-3"
          >
            <Text size="2">{`${Math.round(level * 100)}%`}</Text>
            <DropdownMenu.TriggerIcon />
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item className="flex gap-4" onClick={resetZoom}>
            <ScanSearch size={16} />
            Reset zoom
          </DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item className="flex gap-4" onClick={toContent}>
            <Maximize2 size={16} />
            Zoom to fit
          </DropdownMenu.Item>
          <DropdownMenu.Item className="flex gap-4" onClick={toSelection}>
            <Minimize2 size={16} />
            Zoom To Selection
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
      <button
        type="button"
        className="p-10 rounded-4 text-gray-11 hover:bg-gray-3"
        onClick={zoomIn}
      >
        <ZoomIn size={20} />
      </button>
    </>
  )
})
