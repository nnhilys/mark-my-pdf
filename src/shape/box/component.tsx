import type { ReactElement, ReactNode } from 'react'
import type { BoxShape } from './shape'
import { getDefaultColorTheme, track } from 'tldraw'
import { usePref } from '../../theme/store'
import { useMedia } from '../../util/media'

// https://github.com/frenic/csstype?tab=readme-ov-file#what-should-i-do-when-i-get-type-errors
declare module 'react' {
  interface CSSProperties {
    '--shape-fill-1'?: string
  }
}

export const BoxShapeComponent = track((props: {
  original: ReactNode
  box: BoxShape
}): ReactElement => {
  const { original, box } = props

  const theme = usePref(state => state.theme)
  const prefersDark = useMedia('(prefers-color-scheme: dark)')
  const isDarkMode = theme === 'system' ? prefersDark : theme === 'dark'

  const colorTheme = getDefaultColorTheme({ isDarkMode })
  const color = colorTheme[box.props.color].solid

  return (
    <div className="shape-component" style={{ '--shape-fill-1': color }}>
      {original}
    </div>
  )
})
