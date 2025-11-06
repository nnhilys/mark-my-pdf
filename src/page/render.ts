import type { Editor } from 'tldraw'
import type { PageDetail } from './type'
import { getIndicesBetween, sortByIndex } from 'tldraw'
import { EDITOR_CAMERA } from '../editor/camera'
import { createPageAssets, createPageShape } from './shape'

// References: https://tldraw.dev/examples/pdf-editor
export function renderPages(editor: Editor, pages: PageDetail[]) {
  editor.updateInstanceState({ isDebugMode: false })

  editor.createAssets(pages.map(createPageAssets))
  editor.createShapes(pages.map(createPageShape))

  const shapeIds = pages.map(page => page.shapeId)
  const shapeIdSet = new Set(shapeIds)

  // Don't let the user unlock the pages
  editor.sideEffects.registerBeforeChangeHandler('shape', (prev, next) => {
    if (!shapeIdSet.has(next.id))
      return next
    if (next.isLocked)
      return next
    return { ...prev, isLocked: true }
  })

  // Make sure the shapes are below any of the other shapes
  function makeSureShapesAreAtBottom() {
    const shapes = shapeIds.map(id => editor.getShape(id)!).sort(sortByIndex)
    const pageId = editor.getCurrentPageId()

    const siblings = editor.getSortedChildIdsForParent(pageId)
    const currentBottomShapes = siblings
      .slice(0, shapes.length)
      .map(id => editor.getShape(id)!)

    if (currentBottomShapes.every((shape, i) => shape.id === shapes[i].id))
      return

    const otherSiblings = siblings.filter(id => !shapeIdSet.has(id))
    const bottomSibling = otherSiblings[0]
    const lowestIndex = editor.getShape(bottomSibling)!.index

    const indexes = getIndicesBetween(undefined, lowestIndex, shapes.length)
    editor.updateShapes(
      shapes.map((shape, i) => ({
        id: shape.id,
        type: shape.type,
        isLocked: shape.isLocked,
        index: indexes[i],
      })),
    )
  }

  makeSureShapesAreAtBottom()
  editor.sideEffects.registerAfterCreateHandler('shape', makeSureShapesAreAtBottom)
  editor.sideEffects.registerAfterChangeHandler('shape', makeSureShapesAreAtBottom)

  // Constrain the camera to the bounds of the pages
  const targetBounds = pages.reduce(
    (acc, page) => acc.union(page.bounds),
    pages[0].bounds.clone(),
  )
  editor.setCameraOptions(EDITOR_CAMERA.constraints(targetBounds))
  editor.setCamera(editor.getCamera(), { reset: true })
}
