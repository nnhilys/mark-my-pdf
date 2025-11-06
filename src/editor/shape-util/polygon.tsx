import type { HandleSnapGeometry, TLHandle } from 'tldraw'
import type { PolygonShape } from '../../shape/polygon/shape'
import type { PolygonShapeProps } from '../tool/polygon/shape'
import { Edge2d, getIndexBetween, getIndices, Polygon2d, Polyline2d, ShapeUtil, sortByIndex, SVGContainer, Vec, WeakCache } from 'tldraw'
import { PolygonShapeComponent } from '../../shape/polygon/component'
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
      color: 'light-blue',
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
      const points = linePointsToArray(shape)
      const results: TLHandle[] = points.map(point => ({
        ...point,
        id: point.index,
        type: 'vertex',
        snapType: 'point',
      }))

      for (let i = 0; i < points.length - 1; i++) {
        const index = getIndexBetween(points[i].index, points[i + 1].index)
        const start = new Vec(points[i].x, points[i].y)
        const end = new Vec(points[i + 1].x, points[i + 1].y)
        const point = new Edge2d({ start, end }).center
        results.push({
          id: index,
          type: 'create',
          index,
          x: point.x,
          y: point.y,
          snapType: 'point',
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

  component(polygon: PolygonShape) {
    const spline = getGeometryForLineShape(polygon)
    const original = (
      <SVGContainer id={polygon.id}>
        <PolygonShapeSvg shape={polygon} spline={spline} fill="semi" />
      </SVGContainer>
    )
    return <PolygonShapeComponent original={original} polygon={polygon} />
  }

  indicator(shape: PolygonShape) {
    const spline = getGeometryForLineShape(shape)
    return <path d={spline.getSvgPathData()} />
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
  return new Polyline2d({ points: [...points, points[0]] })
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
