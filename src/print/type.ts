import type { BoxModel } from 'tldraw'
import type { PageDetail } from '../page/type'

export type PrintPage = Omit<PageDetail, 'canvas' | 'bounds'> & {
  box: BoxModel
}
