import { useEffect } from 'react'
import { useMedia } from '../util/media'
import { usePref } from './store'

const list = document.documentElement.classList

export function useTheme() {
  const theme = usePref(state => state.theme)
  const prefersDark = useMedia('(prefers-color-scheme: dark)')

  useEffect(() => {
    const force = theme === 'system' ? prefersDark : theme === 'dark'
    list.toggle('dark', force)
  }, [theme, prefersDark])
}
