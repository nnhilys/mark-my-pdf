import type { ReactElement } from 'react'
import { Tldraw } from 'tldraw'
import { usePages } from '../page/context'
import { renderPages } from '../page/render'
import { usePref } from '../theme/store'
import { EDITOR_CAMERA } from './camera'
import { editorComponents } from './component/components'
import { editorShapeUtils } from './shape-util/main'
import { editorTools } from './tool/main'

export function EditorProvider(props: { children: ReactElement }): ReactElement {
  const { children } = props

  const { pages } = usePages()
  const theme = usePref(state => state.theme)

  return (
    <Tldraw
      components={editorComponents}
      tools={editorTools}
      shapeUtils={editorShapeUtils}
      cameraOptions={EDITOR_CAMERA.options}
      onMount={(editor) => {
        editor.user.updateUserPreferences({ colorScheme: theme })
        renderPages(editor, pages)
      }}
    >
      {children}
    </Tldraw>
  )
}
