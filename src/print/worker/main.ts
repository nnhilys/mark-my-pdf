export const printWorker = new ComlinkWorker<typeof import('./print-worker')>(
  new URL('./print-worker', import.meta.url),
  { type: 'module' },
)
