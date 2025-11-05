import type { ReactElement } from 'react'
import type { TLSelectionForegroundProps } from 'tldraw'
import { DefaultSelectionForeground, TldrawSelectionForeground, track, useEditor } from 'tldraw'

/**
 * tldraw has 2 built-in SelectionForeground:
 * 1. "Tldraw..." is the full-featured one (used on tldraw.com) that provides
 *    all controls including resize handles. In fact, the resizing of GeoShape
 *    (after created) would not work without these controls.
 * 2. "Default..." is the minimum one with only a rectangle around the selected
 *    shapes.
 * Depend on the selected shape, we will render one or the other.
 *
 * Note that there is indeed a performance hit when switching from one to
 * another, but it's not much in practice since the wrapper itself (our
 * component here) does not change.
 */
export const EditorSelectionForeground = track((
  props: TLSelectionForegroundProps,
): ReactElement | null => {
  const editor = useEditor()

  const shape = editor.getOnlySelectedShape()

  // If there is more than one selected shape, we should always use the minimum
  // selection to disable all controls. Note that this removes the control
  // handles, but does not prevent "drag to move" because that does not rely
  // on handles but on the shape itself.
  //
  // Technically, this also covers the case when there is no selection.
  if (shape === null)
    return <DefaultSelectionForeground {...props} />

  return <TldrawSelectionForeground {...props} />
})
