import type { ReactElement } from 'react'
import type { TLHandle, TLLineShape, TLShape } from 'tldraw'
import { LineShapeUtil as TLLineShapeUtil } from 'tldraw'
import { isAnnotShapeBase } from '../../shape/base'
import { autoSelectEditorShape } from './auto-select'

export function isLineShape(shape: TLShape): shape is TLLineShape {
  return shape.type === LineShapeUtil.type
}

export class LineShapeUtil extends TLLineShapeUtil {
  override getHandles(shape: TLLineShape): TLHandle[] {
    // Remove the "create from middle" behaviour. There's no shape that we need
    // this behaviour.
    const prev = super.getHandles(shape)
    const next = prev.filter(handle => handle.type !== 'create')
    return next
  }

  onClick = (shape: TLLineShape) => {
    scrollToShapeInAnnot(shape)
    autoSelectEditorShape({ editor: this.editor, shape })
  }

  override indicator(): ReactElement {
    return <div></div>
  }
}

// @todo 1: We should make the shape component interactive,
// and handle the click event there
// @todo 2: Even if we handle at utils,
// there must be a better place (code-wise) for this.
function scrollToShapeInAnnot(shape: TLShape): void {
  if (!isAnnotShapeBase(shape))
    return

  // @todo: Extract the data key.
  // For now, just search as-is when needed.
  const selector = `[data-annot-group="${shape.meta.group}"]`
  const group = document.querySelector(selector)
  if (!group)
    return

  group.scrollIntoView({ behavior: 'smooth', block: 'center' })
}
