import type { PdfPage } from '../libs/pdf/type'
import { createContext, use } from 'react'

export const PageContext = createContext<PdfPage[] | null>(null)

export function usePages() {
  const page = use(PageContext)
  if (page === null)
    throw new Error('PageProvider not found')

  return page
}
