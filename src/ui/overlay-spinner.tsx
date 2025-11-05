import { LoaderCircle } from 'lucide-react'
import { twJoin } from 'tailwind-merge'

export function UIOverlaySpinner(props: { visible: boolean }) {
  const { visible } = props

  return visible && (
    <div className={twJoin(
      'absolute top-0 left-0 w-full h-full z-9999',
      'flex justify-center items-center',
    )}
    >
      <div className="absolute w-full h-full opacity-60 bg-gray-5" />
      <div className="animate-spin text-accent-10">
        <LoaderCircle size={32} />
      </div>
    </div>
  )
}
