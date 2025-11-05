import type { Theme } from './pref'
import { useMedia } from '../util/media'
import { usePref } from './store'

export function useTheme(): Exclude<Theme, 'system'> {
  const theme = usePref(state => state.theme)

  const prefersDark = useMedia('(prefers-color-scheme: dark)')

  if (theme === 'system')
    return prefersDark ? 'dark' : 'light'

  return theme
}
