import type { ReactElement } from 'react'
import { Theme } from '@radix-ui/themes'
import { EditorBox } from '../editor/box'
import { useTheme } from '../theme/use'
import { ToolbarBox } from '../toolbar/box'

export function AppBox(): ReactElement {
  useTheme()

  return (
    <Theme accentColor="tomato" grayColor="sand">
      <div className="w-screen h-screen flex justify-center flex-col overflow-hidden">
        <ToolbarBox />
        <EditorBox />
      </div>
    </Theme>
  )
}
