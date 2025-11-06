import type { PolygonToAnnot } from '../../editor/tool/polygon/polygon'
import { AnnotPolygonTool } from '../../editor/tool/polygon/polygon'
import { createPolygonShape } from './create'

export const POLYGON_TOOL_ID = 'Polygon'

export function createPolygonShapeTool() {
  return class PolygonShapeTool extends AnnotPolygonTool {
    static override id = POLYGON_TOOL_ID

    override toAnnot: PolygonToAnnot = (props) => {
      const { polygon } = props

      const polygonShape = createPolygonShape({
        x: polygon.x,
        y: polygon.y,
        points: polygon.props.points,
        id: polygon.id,
        color: null,
        meta: {
          group: null,
          name: '',
          isClosed: true,
        },
      })

      return polygonShape
    }
  }
}
