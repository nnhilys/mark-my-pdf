import type { PageDetail } from './type'
import { createContext, use } from 'react'

interface Context {
  /**
   * use for rendering on canvas
   */
  pages: PageDetail[]
  /**
   * keep this for printing with smaller scale
   */
  file: File | 'sample'
}

export const PageContext = createContext<Context | null>(null)

export function usePages() {
  const page = use(PageContext)

  if (page === null)
    throw new Error('PageProvider not found')

  return page
}
