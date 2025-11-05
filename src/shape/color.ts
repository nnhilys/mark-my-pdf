import type { TLDefaultColorStyle } from 'tldraw'
import { randomChild } from '../util/array'

/**
 * We should keep this list sorted by rainbow, as it is used in the UI as
 * options in a dropdown for users to choose from.
 */
export const SHAPE_COLORS: TLDefaultColorStyle[] = [
  'red',
  'orange',
  'green',
  'light-blue',
  'blue',
  'violet',
  'light-violet',
  'light-red',
]

/**
 * This is intentionally narrow than TLDraw's colors. See comment at
 * isShapeColor to learn more.
 */
export function randomShapeColor(): TLDefaultColorStyle {
  return randomChild(SHAPE_COLORS)
}
