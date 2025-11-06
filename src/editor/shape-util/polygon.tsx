import type { HandleSnapGeometry, TLHandle } from 'tldraw'
import type { PolygonShape } from '../../shape/polygon/shape'
import type { PolygonShapeProps } from '../tool/polygon/shape'
import { getIndexBetween, getIndices, Polygon2d, Polyline2d, ShapeUtil, sortByIndex, SVGContainer, Vec, WeakCache } from 'tldraw'
import { isPolygonShape } from '../../shape/polygon/shape'
import { PolygonShapeSvg } from '../../shape/polygon/svg'
import { polygonShapeProps } from '../tool/polygon/shape'

const handlesCache = new WeakCache<PolygonShape['props'], TLHandle[]>()

/** @public */
export class PolygonShapeUtil extends ShapeUtil<PolygonShape> {
  static override type = 'polygon' as const
  static override props = polygonShapeProps
  // static override migrations = lineShapeMigrations

  override hideResizeHandles = () => true
  override hideRotateHandle = () => true
  override hideSelectionBoundsFg = () => true
  override hideSelectionBoundsBg = () => true

  override getDefaultProps(): PolygonShapeProps {
    const [start, end] = getIndices(2)
    return {
      color: 'grey',
      size: 's',
      points: {
        [start]: { id: start, index: start, x: 0, y: 0 },
        [end]: { id: end, index: end, x: 0, y: 0 },
      },
    }
  }

  getGeometry(shape: PolygonShape) {
    // todo: should we have min size?
    return getGeometryForLineShape(shape)
  }

  override getHandles(shape: PolygonShape) {
    return handlesCache.get(shape.props, () => {
      const spline = getGeometryForLineShape(shape)
      const points = linePointsToArray(shape)
      const results: TLHandle[] = points.map(point => ({
        ...point,
        id: point.index,
        type: 'vertex',
        canSnap: true,
      }))

      for (let i = 0; i < points.length - 1; i++) {
        const index = getIndexBetween(points[i].index, points[i + 1].index)
        const point = spline.center
        results.push({
          id: index,
          type: 'create',
          index,
          x: point.x,
          y: point.y,
          canSnap: true,
        })
      }

      return results.sort(sortByIndex)
    })
  }

  //   Events
  override onResize: ShapeUtil<PolygonShape>['onResize'] = (shape, info) => {
    const { scaleX, scaleY } = info

    return {
      props: {
        points: mapObjectMapValues(
          shape.props.points,
          (_, { id, index, x, y }) => ({
            id,
            index,
            x: x * scaleX,
            y: y * scaleY,
          }),
        ),
      },
    }
  }

  override onHandleDrag: ShapeUtil<PolygonShape>['onHandleDrag'] = (shape, { handle }) => {
    return {
      ...shape,
      props: {
        ...shape.props,
        points: {
          ...shape.props.points,
          [handle.id]: { id: handle.id, index: handle.index, x: handle.x, y: handle.y },
        },
      },
    }
  }

  component(shape: PolygonShape) {
    const spline = getGeometryForLineShape(shape)
    return (
      <SVGContainer id={shape.id}>
        <PolygonShapeSvg shape={shape} spline={spline} fill="none" />
      </SVGContainer>
    )
  }

  indicator(shape: PolygonShape) {
    const spline = getGeometryForLineShape(shape)
    return <path d={spline.getSvgPathData()} />
  }

  override toSvg(shape: PolygonShape) {
    const spline = getGeometryForLineShape(shape)

    if (isPolygonShape(shape)) {
      const points = linePointsToArray(shape).map(Vec.From)
      const center = new Polygon2d({ points, isFilled: true }).center

      return (
        <PolygonShapeSvg shape={shape} spline={spline} fill="none">
          <g>
            <rect
              width="32px"
              height="10px"
              ry="4px"
              rx="4px"
              style={{
                transform: `translate(${center.x}px, ${center.y}px)`,
                padding: '2px',
                opacity: 1,
              }}
            />
          </g>
        </PolygonShapeSvg>
      )
    }

    return <PolygonShapeSvg shape={shape} spline={spline} fill="none" />
  }

  override getHandleSnapGeometry(shape: PolygonShape): HandleSnapGeometry {
    const points = linePointsToArray(shape)
    return {
      points,
      getSelfSnapPoints: (handle) => {
        const index = this.getHandles(shape)
          .filter(h => h.type === 'vertex')
          .findIndex(h => h.id === handle.id)!

        // We want to skip the current and adjacent handles
        return points.filter((_, i) => Math.abs(i - index) > 1).map(Vec.From)
      },
    }
  }

  calc(shape: PolygonShape) {
    const points = linePointsToArray(shape).map(Vec.From)
    const a = new Polygon2d({ points, isFilled: true })
    return Math.abs(a.getArea())
  }
}

function getGeometryForLineShape(shape: PolygonShape): Polyline2d {
  const points = linePointsToArray(shape).map(Vec.From)
  return new Polyline2d({ points })
}

function linePointsToArray(shape: PolygonShape) {
  return Object.values(shape.props.points).sort(sortByIndex)
}

function mapObjectMapValues<Key extends string, ValueBefore, ValueAfter>(
  object: { readonly [K in Key]: ValueBefore },
  mapper: (key: Key, value: ValueBefore) => ValueAfter,
): { [K in Key]: ValueAfter } {
  const result = {} as { [K in Key]: ValueAfter }
  for (const [key, value] of objectMapEntries(object)) {
    const newValue = mapper(key, value)
    result[key] = newValue
  }
  return result
}

function objectMapEntries<Key extends string, Value>(object: {
  [K in Key]: Value
}): Array<[Key, Value]> {
  return Object.entries(object) as [Key, Value][]
}
