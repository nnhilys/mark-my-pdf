import type { ReactElement } from 'react'
import { DefaultCanvas } from 'tldraw'
import { EditorToolbarDelete } from './toolbar/delete'
import { EditorToolbarDuplicate } from './toolbar/duplicate'
import { EditorToolbarHistory } from './toolbar/history'
import { EditorToolbarManual } from './toolbar/manual'
import { EditorToolbarNavigate } from './toolbar/navigate'
import { EditorToolbarZoom } from './toolbar/zoom'
import { EditorZoomProvider } from './zoom'

export function EditorBox(): ReactElement {
  // This defines the slot for tldraw to put the editor canvas in.
  // The editor is actually created much sooner, as a provider.
  // To learn more, see "editor/provider".
  const canvas = <DefaultCanvas />

  return (
    <div className="flex-1 relative w-full h-full bg-gray-3" draggable={false}>
      <div className="absolute top-16 left-16 z-(--tl-layer-panels)">
        <EditorToolbarNavigate />
      </div>
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-(--tl-layer-panels)">
        <div className="flex gap-4 bg-gray-1 p-6 border border-gray-6 rounded-4">
          <EditorToolbarHistory />
          <EditorToolbarDuplicate />
          <EditorToolbarDelete />
          <div className="w-1 bg-gray-5" />
          <EditorToolbarManual />
          <div className="w-1 bg-gray-5" />
          <EditorToolbarZoom />
        </div>
      </div>
      <div className="w-full h-full">
        <EditorZoomProvider>
          {canvas}
        </EditorZoomProvider>
      </div>
    </div>
  )
}
