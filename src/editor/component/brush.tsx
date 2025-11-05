import type { ReactElement } from 'react'
import type { TLBrushProps } from 'tldraw'
import { DefaultBrush } from 'tldraw'

export function EditorBrush(props: TLBrushProps): ReactElement {
  return (
    <DefaultBrush
      {...props}
      opacity={0.5}
    />
  )
}
