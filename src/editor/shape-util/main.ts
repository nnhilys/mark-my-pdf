import type { TldrawEditorBaseProps } from 'tldraw'
import { ImageShapeUtil } from 'tldraw'
import { GeoShapeUtil } from './geo'
import { LineShapeUtil } from './line'
import { PolygonShapeUtil } from './polygon'

export const editorShapeUtils: TldrawEditorBaseProps['shapeUtils'] = [
  ImageShapeUtil,
  GeoShapeUtil,
  LineShapeUtil,
  PolygonShapeUtil,
]
