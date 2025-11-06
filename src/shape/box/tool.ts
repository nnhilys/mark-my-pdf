import type { GeoToBoxAnnot } from '../../editor/tool/box'
import { Box } from 'tldraw'
import { AnnotBoxTool } from '../../editor/tool/box'
import { createBoxShape } from './create'

export const BOX_TOOL_ID = 'Box'

export function createBoxShapeTool() {
  return class BoxShapeTool extends AnnotBoxTool {
    static override id = BOX_TOOL_ID

    override toAnnot: GeoToBoxAnnot = (props) => {
      const { geo } = props

      const box = createBoxShape({
        box: new Box(geo.x, geo.y, geo.props.w, geo.props.h),
        id: geo.id,
        color: null,
        meta: {
          group: null,
          name: '',
        },
      })

      return box
    }
  }
}
