import { Theme } from '@radix-ui/themes'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AppBox } from './app/box'
import { DataProvider } from './libs/data/provider'
import './libs/pdf/setup'
import '@radix-ui/themes/styles.css'
import 'tldraw/tldraw.css'
import './style/main.css'

const container = document.getElementById('root')
if (container === null)
  throw new Error('Failed to find the root element')

const app = (
  <StrictMode>
    <DataProvider>
      <Theme accentColor="indigo" grayColor="sand">
        <div className="w-screen h-screen overflow-hidden">
          <AppBox />
        </div>
      </Theme>
    </DataProvider>
  </StrictMode>
)

createRoot(container).render(app)
