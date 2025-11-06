import type { PageDetail } from './type'
import { useState } from 'react'
import { UIOverlaySpinner } from '../ui/overlay-spinner'
import { getPages } from './get'

export function PageUpload(props: {
  setFile: (file: File | 'sample') => void
  setPages: (pages: PageDetail[]) => void
}) {
  const { setFile, setPages } = props

  const [isLoading, setIsLoading] = useState(false)

  const upload = async () => {
    const input = window.document.createElement('input')
    input.type = 'file'
    input.accept = 'application/pdf'
    input.addEventListener('change', async (e) => {
      const fileList = (e.target as HTMLInputElement).files
      if (!fileList || fileList.length === 0)
        return
      const file = fileList[0]

      setIsLoading(true)
      try {
        const pages = await getPages(file)
        setFile(file)
        setPages(pages)
      }
      finally {
        setIsLoading(false)
      }
    })
    input.click()
  }

  const loadSample = async () => {
    setIsLoading(true)
    try {
      const pages = await getPages('sample')
      setFile('sample')
      setPages(pages)
    }
    finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <UIOverlaySpinner visible={isLoading} />
      <button
        type="button"
        className="flex flex-col gap-4 bg-gray-1 p-10 border border-gray-6 rounded-4"
        onClick={upload}
      >
        Upload PDF
      </button>
      <div>or</div>
      <button
        type="button"
        className="flex flex-col gap-4 bg-gray-1 p-10 border border-gray-6 rounded-4"
        onClick={loadSample}
      >
        Use an example
      </button>
    </>
  )
}
