import type { ReactElement } from 'react'
import { useState } from 'react'
import { track, useEditor } from 'tldraw'
import { isAnnotShape } from '../shape/shape'
import { PrintDialog } from './dialog'
import { printPDF } from './print'

export const PrintButton = track((): ReactElement => {
  const editor = useEditor()

  const [dialogOpen, setDialogOpen] = useState(false)

  const [isExporting, setIsExporting] = useState(false)
  const [progress, setProgress] = useState<{ current: number, total: number } | null>(null)
  const [exportComplete, setExportComplete] = useState(false)
  const [exportError, setExportError] = useState<string | null>(null)

  const handleConfirm = () => {
    setIsExporting(true)
    setProgress(null)
    setExportComplete(false)
    setExportError(null)

    printPDF({
      shapes: editor.getCurrentPageShapes().filter(isAnnotShape),
      onProgress: (current, total) => setProgress({ current, total }),
    })
      .then((success) => {
        if (success) {
          setExportComplete(true)
        }
        else {
          setExportError('no_data')
        }
      })
      .catch((error) => {
        setExportError('unknown_error')
        console.error(error)
      })
      .finally(() => setIsExporting(false))
  }

  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open)
    // Clear state when dialog closes
    if (!open) {
      setProgress(null)
      setExportComplete(false)
      setExportError(null)
    }
  }

  return (
    <PrintDialog
      open={dialogOpen}
      onOpenChange={handleDialogOpenChange}
      onConfirm={handleConfirm}
      isExporting={isExporting}
      progress={progress}
      exportComplete={exportComplete}
      exportError={exportError}
    >
      <button
        type="button"
        className="flex flex-col gap-4 bg-gray-1 p-6 border border-gray-6 rounded-4"
      >
        Print
      </button>
    </PrintDialog>
  )
})
