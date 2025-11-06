import type { ReactElement } from 'react'
import type { PdfPage } from '../libs/pdf/type'
import { useQuery } from '@tanstack/react-query'
import { Tldraw } from 'tldraw'
import { getPdfPages } from '../libs/pdf/get-pages'
import { renderPages } from '../page/render'
import { UIOverlaySpinner } from '../ui/overlay-spinner'
import { EDITOR_CAMERA } from './camera'
import { editorComponents } from './component/components'
import { editorShapeUtils } from './shape-util/main'
import { editorTools } from './tool/main'

export function EditorProvider(props: { children: ReactElement }): ReactElement {
  const { children } = props

  const { data: pages } = useQuery({
    queryKey: ['sample-pdf-pages'],
    queryFn: async (): Promise<PdfPage[]> => {
      return getPdfPages()
    },
  })

  if (!pages)
    return <UIOverlaySpinner visible />

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
