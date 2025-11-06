import type { ReactElement } from 'react'
import type { TLGeoShape, TLShape } from 'tldraw'
import { GeoShapeUtil as TLGeoShapeUtil } from 'tldraw'
import { autoSelectEditorShape } from './auto-select'

export function isGeoShape(shape: TLShape): shape is TLGeoShape {
  return shape.type === GeoShapeUtil.type
}

export class GeoShapeUtil extends TLGeoShapeUtil {
  override hideRotateHandle: TLGeoShapeUtil['hideRotateHandle'] = () => true

  onClick = (shape: TLGeoShape) => {
    autoSelectEditorShape({ editor: this.editor, shape })
  }

  override indicator(geo: TLGeoShape): ReactElement {
    const original = super.indicator(geo)
    return original
  }
}
