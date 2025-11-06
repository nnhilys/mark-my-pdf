import type { TLLineShapePoint } from 'tldraw'
import { Edge2d, sortByIndex, Vec } from 'tldraw'

/**
 * In tldraw, LineShape is actually more like poly-line as they can have more
 * than 2 handles. However, in our app, most "line" shapes are edges with only
 * 2 handles (see ScaleShape and SegmentShape).
 *
 * This is a convenient utility that is similar to LineShapeUtils' getGeometry
 * but instead of a polyline, we return an edge (from the first 2 handles).
 * For practical reasons, we throw an error if there's more than 2 handles,
 * because it's likely we don't support polyline LineShape in the near future.
 *
 * This returns relative coordinates, as TLLineShape's handles are positioned
 * relative to the shape's "x" and "y".
 */
export function getLineShapeEdgeRelative(points: Record<string, TLLineShapePoint>): Edge2d {
  const handles = Object.values(points).sort(sortByIndex)
  const [start, end] = [handles.at(0), handles.at(1)]
  if (handles.length !== 2 || !start || !end)
    throw new Error('Line must have exactly 2 handles.')

  const edge = new Edge2d({
    start: Vec.From(start),
    end: Vec.From(end),
  })
  return edge
}

/**
 * This is similar to getLineShapeEdgeRelative but returns absolute coordinates
 * for the edge's points. It means both handles of the edge are positioned
 * relative to the editor, not to the "shape"'s "x" and "y".
 */
export function getLineShapeEdgeAbsolute(
  x: number,
  y: number,
  points: Record<string, TLLineShapePoint>,
): Edge2d {
  const edge = getLineShapeEdgeRelative(points)
  edge.getVertices().forEach(v => v.add({ x, y }))
  return edge
}
