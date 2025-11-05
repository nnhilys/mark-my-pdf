import { useEffect } from 'react'
import { useEditor } from 'tldraw'
import { useMedia } from '../util/media'
import { usePref } from './store'

const list = document.documentElement.classList

export function useTheme() {
  const editor = useEditor()
  const theme = usePref(state => state.theme)
  const prefersDark = useMedia('(prefers-color-scheme: dark)')

  useEffect(() => {
    const force = theme === 'system' ? prefersDark : theme === 'dark'
    list.toggle('dark', force)
    editor.user.updateUserPreferences({ colorScheme: theme })
  }, [editor, theme, prefersDark])
}
