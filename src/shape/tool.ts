import type { Editor } from 'tldraw'

/**
 * For annotation tools like this, it's better to keep the tool active. This
 * allows the user to mark multiple items consecutively and edit them all at
 * once at the end.
 *
 * Without locking the tool, the editor would automatically switch back to
 * SelectTool after each annotation, which interrupts the user's workflow.
 *
 * Good: add -> add -> ... -> add -> edit.
 * Not good: add -> edit -> add -> edit -> ... -> add -> edit.
 */
export function lockEditorTool(editor: Editor): void {
  editor.updateInstanceState({ isToolLocked: true })
}

export function resetEditorToolLock(editor: Editor): void {
  editor.updateInstanceState({ isToolLocked: false })
}
