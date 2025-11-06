import { StateNode } from 'tldraw'
import { LineSelectCreate } from './create'
import { LineSelectMoving } from './moving'

export class LineSelectTool extends StateNode {
  static override id = 'line-select'
  static override initial = 'create'

  static override children = () => [
    LineSelectCreate,
    LineSelectMoving,
  ]
}
