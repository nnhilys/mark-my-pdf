import type { PageDetail } from './type'
import { createContext, use } from 'react'

export const PageContext = createContext<PageDetail[] | null>(null)

export function usePages() {
  const page = use(PageContext)
  if (page === null)
    throw new Error('PageProvider not found')

  return page
}
