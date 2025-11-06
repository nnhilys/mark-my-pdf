import type { ReactElement, ReactNode } from 'react'
import type { PolygonShape } from './shape'
import { getDefaultColorTheme, track } from 'tldraw'
import { usePref } from '../../theme/store'
import { useMedia } from '../../util/media'

// https://github.com/frenic/csstype?tab=readme-ov-file#what-should-i-do-when-i-get-type-errors
declare module 'react' {
  interface CSSProperties {
    '--shape-fill-1'?: string
  }
}

export const PolygonShapeComponent = track((props: {
  original: ReactNode
  polygon: PolygonShape
}): ReactElement => {
  const { original, polygon } = props

  const theme = usePref(state => state.theme)
  const prefersDark = useMedia('(prefers-color-scheme: dark)')
  const isDarkMode = theme === 'system' ? prefersDark : theme === 'dark'

  const colorTheme = getDefaultColorTheme({ isDarkMode })
  const color = colorTheme[polygon.props.color].solid

  return (
    <div className="shape-component" style={{ '--shape-fill-1': color }}>
      {original}
    </div>
  )
})
