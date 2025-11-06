import type { ReactElement } from 'react'
import type { TLGeoShape, TLShape } from 'tldraw'
import { GeoShapeUtil as TLGeoShapeUtil } from 'tldraw'
import { BoxShapeComponent } from '../../shape/box/component'
import { isBoxShape } from '../../shape/box/shape'
import { autoSelectEditorShape } from './auto-select'

export function isGeoShape(shape: TLShape): shape is TLGeoShape {
  return shape.type === GeoShapeUtil.type
}

export class GeoShapeUtil extends TLGeoShapeUtil {
  override hideRotateHandle: TLGeoShapeUtil['hideRotateHandle'] = () => true

  onClick = (shape: TLGeoShape) => {
    autoSelectEditorShape({ editor: this.editor, shape })
  }

  override component(geo: TLGeoShape): ReactElement {
    const original = super.component(geo)

    if (isBoxShape(geo))
      return <BoxShapeComponent original={original} box={geo} />

    return original
  }

  override indicator(geo: TLGeoShape): ReactElement {
    const original = super.indicator(geo)
    return original
  }
}
