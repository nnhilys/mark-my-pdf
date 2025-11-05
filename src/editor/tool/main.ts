import type { TldrawEditorBaseProps } from 'tldraw'
import { HandTool, SelectTool, ZoomTool } from 'tldraw'

export const editorTools: TldrawEditorBaseProps['tools'] = [
  HandTool,
  ZoomTool,
  SelectTool,
]
