import type { TLComponents } from 'tldraw'
import { EditorBackground } from './background'
import { EditorBrush } from './brush'
import { EditorContextMenu } from './context-menu'
import { EditorErrorFallback } from './error-fallback'
import { EditorSelectionForeground } from './selection-foreground'

export const editorComponents: TLComponents = {
  Background: EditorBackground,
  Brush: EditorBrush,
  ErrorFallback: EditorErrorFallback,
  SelectionForeground: EditorSelectionForeground,
  ContextMenu: EditorContextMenu,
}
