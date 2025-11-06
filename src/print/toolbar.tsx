import type { ReactElement } from 'react'
import { Download } from 'lucide-react'
import { useState } from 'react'
import { track, useEditor } from 'tldraw'
import { usePages } from '../page/context'
import { isAnnotShape } from '../shape/shape'
import { PrintDialog } from './dialog'
import { printPDF } from './print'

export const PrintToolbar = track((): ReactElement => {
  const editor = useEditor()
  const { file } = usePages()

  const [dialogOpen, setDialogOpen] = useState(false)

  const [isExporting, setIsExporting] = useState(false)
  const [progress, setProgress] = useState<{ current: number, total: number } | null>(null)
  const [exportComplete, setExportComplete] = useState(false)
  const [exportError, setExportError] = useState<string | null>(null)

  const handleConfirm = async () => {
    setIsExporting(true)
    setProgress(null)
    setExportComplete(false)
    setExportError(null)

    const success = await printPDF({
      file,
      shapes: editor.getCurrentPageShapes().filter(isAnnotShape),
      onProgress: (current, total) => setProgress({ current, total }),
    }).catch((error) => {
      setExportError('unknown_error')
      console.error(error)
    })

    if (success) {
      setExportComplete(true)
    }
    else {
      setExportError('no_data')
    }

    setIsExporting(false)
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
      <button type="button" className="p-10">
        <Download size={20} />
      </button>
    </PrintDialog>
  )
})
