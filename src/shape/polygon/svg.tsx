import type { ReactElement } from 'react'
import type { Polyline2d, TLDefaultFillStyle, TLDefaultSizeStyle } from 'tldraw'
import type { PolygonShape } from './shape'
import { useDefaultColorTheme, useEditor } from 'tldraw'

const STROKE_SIZES: Record<TLDefaultSizeStyle, number> = {
  s: 2,
  m: 3.5,
  l: 5,
  xl: 10,
}

export function PolygonShapeSvg(props: {
  shape: PolygonShape
  spline: Polyline2d
  fill: TLDefaultFillStyle
  children?: ReactElement
}) {
  const { shape, spline, fill, children } = props

  const theme = useDefaultColorTheme()
  const editor = useEditor()
  const strokeWidth = STROKE_SIZES[shape.props.size] / editor.getZoomLevel()
  const { color } = shape.props
  // Line style lines
  const pathData = spline.getSvgPathData()

  const getShapeFill = () => {
    switch (fill) {
      case 'none': {
        return null
      }
      case 'solid': {
        return <path fill={theme[color].solid} d={pathData} />
      }
      case 'pattern':
      case 'semi': {
        return <path fill={theme[color].semi} d={pathData} />
      }
    }
  }

  return (
    <>
      {getShapeFill()}
      <path d={pathData} stroke={theme[color].solid} strokeWidth={strokeWidth} fill="none" />
      {children
        ? (
            <>
              <g>
                <path fill={theme[color].solid} d={pathData} opacity={0.3} strokeWidth={0} />
              </g>
              {children}
            </>
          )
        : null}
    </>
  )
}
