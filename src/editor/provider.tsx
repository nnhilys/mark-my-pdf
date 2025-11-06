import type { ReactElement } from 'react'
import type { StateNode, TLClickEventInfo } from 'tldraw'
import { Tldraw } from 'tldraw'
import { usePages } from '../page/context'
import { renderPages } from '../page/render'
import { usePref } from '../theme/store'
import { EDITOR_CAMERA } from './camera'
import { editorComponents } from './component/components'
import { editorShapeUtils } from './shape-util/main'
import { editorTools } from './tool/main'

type IdleStateNode = StateNode & {
  handleDoubleClickOnCanvas: (info: TLClickEventInfo) => void
}

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

        // Prevent create text on double click
        // Reference: https://tldraw.dev/examples/custom-double-click-behavior
        const selectIdleState = editor.getStateDescendant<IdleStateNode>('select.idle')
        if (!selectIdleState)
          throw new Error('SelectTool Idle state not found')

        const removeDoubleClickOnCanvasHandler = () => void {}
        selectIdleState.handleDoubleClickOnCanvas
          = removeDoubleClickOnCanvasHandler.bind(selectIdleState)
      }}
    >
      {children}
    </Tldraw>
  )
}
