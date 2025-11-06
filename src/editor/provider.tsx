import type { ReactElement } from 'react'
import { Tldraw } from 'tldraw'
import { renderPages } from '../page/render'
import { usePages } from '../page/state'
import { EDITOR_CAMERA } from './camera'
import { editorComponents } from './component/components'
import { editorShapeUtils } from './shape-util/main'
import { editorTools } from './tool/main'

export function EditorProvider(props: { children: ReactElement }): ReactElement {
  const { children } = props

  const pages = usePages()

  return (
    <Tldraw
      components={editorComponents}
      tools={editorTools}
      shapeUtils={editorShapeUtils}
      cameraOptions={EDITOR_CAMERA.options}
      onMount={(editor) => {
        renderPages(editor, pages)
      }}
    >
      {children}
    </Tldraw>
  )
}
