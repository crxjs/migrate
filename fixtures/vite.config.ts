import { defineConfig } from 'vite'
import { chromeExtension, defineManifest } from 'rollup-plugin-chrome-extension'
import react from '@vitejs/plugin-react'
import type { Plugin } from 'vite'

const manifest = defineManifest({
  name: 'test',
  version: '1.0.0',
  manifest_version: 3,
})

export default defineConfig({
  plugins: [
    react(),
    chromeExtension({ manifest, contentScripts: { preambleCode: false } }),
  ],
})
