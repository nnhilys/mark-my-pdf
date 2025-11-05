import type { Box, TLCameraMoveOptions, TLCameraOptions } from 'tldraw'

const zoomSteps = [0.1, 0.5, 1, 2, 4, 8, 16]

const zoomMax = (() => {
  const max = Math.max(...zoomSteps)
  if (Number.isFinite(max) === false)
    throw new Error('Zoom steps is empty')
  return max
})()

const zoomMin = (() => {
  const min = Math.min(...zoomSteps)
  if (Number.isFinite(min) === false)
    throw new Error('Zoom steps is empty')
  return min
})()

const options: Partial<TLCameraOptions> = {
  wheelBehavior: 'zoom',
  zoomSteps,
}

function constraints(bounds: Box): Partial<TLCameraOptions> {
  return {
    constraints: {
      bounds,
      padding: { x: 32, y: 32 },
      origin: { x: 0.5, y: 0 },
      initialZoom: 'fit-max-100',
      baseZoom: 'default',
      behavior: 'contain',
    },
  }
}

export const EDITOR_CAMERA = {
  options,
  zoomSteps,
  constraints,
  zoomMax,
  zoomMin,
}

export const cameraMoveOptions: TLCameraMoveOptions = {
  animation: {
    duration: 200,
  },
}
