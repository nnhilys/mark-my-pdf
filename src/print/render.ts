import type { jsPDF as JSPDF } from 'jspdf'
import type { BoxShape } from '../shape/box/shape'
import type { PolygonShape } from '../shape/polygon/shape'
import type { SegmentShape } from '../shape/segment/shape'
import type { AnnotShape } from '../shape/shape'
import type { PrintPage } from './type'
import { GState } from 'jspdf'
import { getDefaultColorTheme, sortByIndex } from 'tldraw'
import { isBoxShape } from '../shape/box/shape'
import { isPolygonShape } from '../shape/polygon/shape'
import { isSegmentShape } from '../shape/segment/shape'

export function renderPrintShapes(pdf: JSPDF, page: PrintPage, shapes: AnnotShape[], scaleX: number, scaleY: number) {
  shapes.forEach((shape) => {
    // Reset global alpha to 1 before drawing each shape
    pdf.setGState(new GState({ 'opacity': 1, 'stroke-opacity': 1 }))

    const theme = getDefaultColorTheme({ isDarkMode: false })
    const color = theme[shape.props.color].fill

    // Set fill and draw color to follow the shape color
    pdf.setFillColor(color)
    pdf.setDrawColor(color)

    // Set global line width
    pdf.setLineWidth(2)

    if (isBoxShape(shape)) {
      renderBox(pdf, page, shape, scaleX, scaleY)
    }
    else if (isSegmentShape(shape)) {
      renderSegment(pdf, page, shape, scaleX, scaleY)
    }
    else if (isPolygonShape(shape)) {
      renderPolygon(pdf, page, shape, scaleX, scaleY)
    }
  })
}

function renderBox(pdf: JSPDF, page: PrintPage, box: BoxShape, scaleX: number, scaleY: number) {
  const x = (box.x - page.box.x) * scaleX
  const y = (box.y - page.box.y) * scaleY
  const w = box.props.w * scaleX
  const h = box.props.h * scaleY

  // Draw filled rectangle (x, y, width, height, 'F' = fill only) with 20% opacity
  // pdf.setGState(new GState({ opacity: 0.2 }))
  // pdf.rect(x, y, w, h, 'F')

  // Draw border rectangle (same position and size, 'S' = stroke only) with 100% opacity
  pdf.setGState(new GState({ opacity: 1 }))
  pdf.rect(x, y, w, h, 'S')
}

function renderSegment(pdf: JSPDF, page: PrintPage, segment: SegmentShape, scaleX: number, scaleY: number) {
  const points = Object.values(segment.props.points)

  const start = {
    x: (segment.x + points[0].x - page.box.x) * scaleX,
    y: (segment.y + points[0].y - page.box.y) * scaleY,
  }

  const end = {
    x: (segment.x + points[1].x - page.box.x) * scaleX,
    y: (segment.y + points[1].y - page.box.y) * scaleY,
  }

  // Draw line (start.x, start.y, end.x, end.y, 'S' = stroke only) with 20% opacity
  pdf.setGState(new GState({ 'stroke-opacity': 0.6 }))
  pdf.line(start.x, start.y, end.x, end.y, 'S')
}

function renderPolygon(pdf: JSPDF, page: PrintPage, polygon: PolygonShape, scaleX: number, scaleY: number) {
  const x = (polygon.x - page.box.x) * scaleX
  const y = (polygon.y - page.box.y) * scaleY

  const points = Object.values(polygon.props.points)
    .sort(sortByIndex)
    .map(point => [point.x * scaleX, point.y * scaleY])

  const polygonPoints = points.map((point, index) => {
    if (index === 0)
      return [point[0] + x, point[1] + y]
    return [point[0] - points[index - 1][0], point[1] - points[index - 1][1]]
  })
  const [first, ...rest] = polygonPoints

  // Draw filled polygon (rest, first[0], first[1], [1, 1], 'F' = fill only) with 20% opacity
  // pdf.setGState(new GState({ opacity: 0.2 }))
  // pdf.lines(rest, first[0], first[1], [1, 1], 'F', true)

  // Draw border polygon (rest, first[0], first[1], [1, 1], 'S' = stroke only) with 100% opacity
  pdf.setGState(new GState({ opacity: 1 }))
  pdf.lines(rest, first[0], first[1], [1, 1], 'S', true)
}
