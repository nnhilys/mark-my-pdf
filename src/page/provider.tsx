import type { ReactElement } from 'react'
import { useQuery } from '@tanstack/react-query'
import { UIOverlaySpinner } from '../ui/overlay-spinner'
import { getPages } from './get'
import { PageContext } from './state'

export function PageProvider(props: { children: ReactElement }): ReactElement {
  const { children } = props

  const { data: pages } = useQuery({
    queryKey: ['sample-pdf-pages'],
    queryFn: () => getPages(),
  })

  if (!pages)
    return <UIOverlaySpinner visible />

  return (
    <PageContext value={pages ?? null}>
      {children}
    </PageContext>
  )
}
