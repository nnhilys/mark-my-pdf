import type { ReactElement } from 'react'
import { Theme } from '@radix-ui/themes'
import { useTheme } from '../theme/use'

export function AppBox(): ReactElement {
  const theme = useTheme()

  return (
    <Theme accentColor="tomato" grayColor="sand" appearance={theme}>
      <div className="w-screen h-screen flex justify-center p-32">
        Mark my pdf
      </div>
    </Theme>
  )
}
