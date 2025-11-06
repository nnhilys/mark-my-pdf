import type { ReactElement } from 'react'
import type { PdfPage } from '../libs/pdf/type'
import { useQuery } from '@tanstack/react-query'
import { getPdfPages } from '../libs/pdf/get-pages'
import { UIOverlaySpinner } from '../ui/overlay-spinner'
import { PageContext } from './state'

export function PageProvider(props: { children: ReactElement }): ReactElement {
  const { children } = props

  const { data: pages } = useQuery({
    queryKey: ['sample-pdf-pages'],
    queryFn: async (): Promise<PdfPage[]> => {
      return getPdfPages()
    },
  })

  if (!pages)
    return <UIOverlaySpinner visible />

  return (
    <PageContext value={pages ?? null}>
      {children}
    </PageContext>
  )
}
