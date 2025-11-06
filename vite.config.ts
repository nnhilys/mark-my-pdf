import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { comlink } from 'vite-plugin-comlink'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vite.dev/config/
export default defineConfig({
  worker: {
    format: 'es',
    plugins: () => [
      tsconfigPaths(),
      comlink(),
    ],
  },
  plugins: [
    react(),
    tailwindcss(),
    tsconfigPaths(),
    comlink(),
    viteStaticCopy({
      targets: [
        {
          src: path.resolve(__dirname, 'node_modules/pdfjs-dist/cmaps/'),
          dest: 'public/',
        },
      ],
    }),
  ],
})
