export function randomChild<T>(arr: readonly T[]): T {
  if (arr.length === 0)
    throw new Error('Array must not be empty.')
  const index = Math.floor(Math.random() * arr.length)
  const item = arr.at(index)
  // This should never happen
  if (item === undefined)
    throw new Error('Item must not be undefined') // Coding error
  return item
}
