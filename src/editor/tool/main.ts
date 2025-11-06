import type { TldrawEditorBaseProps } from 'tldraw'
import { HandTool, SelectTool, ZoomTool } from 'tldraw'
import { createBoxShapeTool } from '../../shape/box/tool'
import { createPolygonShapeTool } from '../../shape/polygon/tool'
import { createSegmentShapeTool } from '../../shape/segment/tool'
import { LineSelectTool } from './line-select/line-select'

export const editorTools: TldrawEditorBaseProps['tools'] = [
  HandTool,
  ZoomTool,
  SelectTool,
  //
  LineSelectTool,
  createBoxShapeTool(),
  createSegmentShapeTool(),
  createPolygonShapeTool(),
]
