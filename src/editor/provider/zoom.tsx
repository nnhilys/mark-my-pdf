import type { ReactElement, ReactNode } from 'react'
import { track, useEditor } from 'tldraw'

export const EDITOR_ZOOM_VARIABLE = '--editor-zoom'

// https://github.com/frenic/csstype?tab=readme-ov-file#what-should-i-do-when-i-get-type-errors
declare module 'react' {
  interface CSSProperties {
    [EDITOR_ZOOM_VARIABLE]?: string
  }
}

export const EditorZoomProvider = track((props: {
  children: ReactNode
}): ReactElement => {
  const { children } = props

  const editor = useEditor()
  const level = editor.getZoomLevel()

  return (
    <div
      style={{ [EDITOR_ZOOM_VARIABLE]: level.toString() }}
      onContextMenu={e => e.preventDefault()}
      draggable={false}
    >
      {children}
    </div>
  )
})
