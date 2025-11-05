import type { ReactElement } from 'react'
import { createShapeId, Tldraw } from 'tldraw'
import { EDITOR_CAMERA } from '../camera'
import { editorComponents } from '../component/components'
import { editorTools } from '../tool/main'

export function EditorProvider(props: { children: ReactElement }): ReactElement {
  const { children } = props

  return (
    <Tldraw
      components={editorComponents}
      tools={editorTools}
      cameraOptions={EDITOR_CAMERA.options}
      onMount={(editor) => {
        Array.from({ length: 10 }).forEach(() => {
          editor.createShape({
            id: createShapeId(),
            type: 'geo',
            x: Math.random() * 1000,
            y: Math.random() * 1000,
            props: {
              geo: 'rectangle',
              w: Math.random() * 100,
              h: Math.random() * 100,
              dash: 'draw',
              color: 'blue',
              size: 'm',
            },
          })
        })
      }}
    >
      {children}
    </Tldraw>
  )
}
