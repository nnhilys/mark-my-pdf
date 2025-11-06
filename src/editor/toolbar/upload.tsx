import type { ReactElement } from 'react'
import { Upload } from 'lucide-react'

export function EditorToolbarReset(props: { reset: () => void }): ReactElement {
  const { reset } = props
  return (
    <button type="button" className="p-10" onClick={reset}>
      <Upload size={18} />
    </button>
  )
}
