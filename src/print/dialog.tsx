import type { ReactElement } from 'react'
import { Button, Dialog, Progress, Text } from '@radix-ui/themes'

interface PrintDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  children: ReactElement
  isExporting: boolean
  progress: { current: number, total: number } | null
  exportComplete: boolean
  exportError: string | null
}

export function PrintDialog(props: PrintDialogProps): ReactElement {
  const { open, onOpenChange, onConfirm, children, isExporting, progress, exportComplete, exportError } = props

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(open) => {
        // Don't allow closing during exporting
        if (!isExporting) {
          onOpenChange(open)
        }
      }}
    >
      <Dialog.Trigger>
        {children}
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>
          Print
        </Dialog.Title>
        <Dialog.Description>
          Print as PDF
        </Dialog.Description>
        {isExporting && progress && (
          <div className="flex items-center gap-4">
            <Progress
              value={progress.current}
              max={progress.total}
              size="2"
            />
            <div>
              {`${progress.current} / ${progress.total}`}
            </div>
          </div>
        )}
        {exportComplete && (
          <Text color="green">
            Print completed!
          </Text>
        )}
        {exportError === 'no_data' && (
          <Text color="red">
            There is nothing to print!
          </Text>
        )}
        {exportError === 'unknown_error' && (
          <Text color="red">
            Something went wrong. Please try again!
          </Text>
        )}
        <div className="flex justify-end gap-8">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isExporting}
          >
            {exportComplete ? 'Close' : 'Cancel'}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isExporting}
          >
            Start
          </Button>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  )
}
