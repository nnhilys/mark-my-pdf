import type { ReactElement } from 'react'
import type { PageDetail } from '../page/type'
import { useMemo, useState } from 'react'
import { EditorBox } from '../editor/box'
import { EditorProvider } from '../editor/provider'
import { PageContext } from '../page/context'
import { PageUpload } from '../page/upload'
import { useTheme } from '../theme/use'

export function AppBox(): ReactElement {
  useTheme()

  const [file, setFile] = useState<File | 'sample' | null>(null)
  const [pages, setPages] = useState<PageDetail[] | null>(null)

  const reset = () => {
    setFile(null)
    setPages(null)
  }

  const value = useMemo(() => {
    if (!pages || !file)
      return null
    return { pages, file }
  }, [pages, file])

  if (file === null || pages === null) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-gray-3">
        <PageUpload setFile={setFile} setPages={setPages} />
      </div>
    )
  }

  return (
    <PageContext value={value}>
      <EditorProvider>
        <EditorBox reset={reset} />
      </EditorProvider>
    </PageContext>
  )
}
