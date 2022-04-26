import { resolve } from 'path'
import { codemod } from './main'

test('simple js vite config', () => {
  const config = resolve(__dirname, '../tests/vite.config.js')
  const result = codemod({ config })

  expect(result).not.toMatch('import { chromeExtension }')
  expect(result).not.toMatch(`from 'rollup-plugin-chrome-extension'`)
  expect(result).not.toMatch('plugins: [chromeExtension({ manifest })]')

  expect(result).toMatch('import { crx }')
  expect(result).toMatch(`from '@crxjs/vite-plugin'`)
  expect(result).toMatch('plugins: [crx({ manifest })]')
})

test('ts vite config with type import', () => {
  const config = resolve(__dirname, '../tests/vite.config.ts')
  const result = codemod({ config })

  expect(result).not.toMatch('import { chromeExtension }')
  expect(result).not.toMatch(`from 'rollup-plugin-chrome-extension'`)
  expect(result).not.toMatch(
    'chromeExtension({ manifest, contentScripts: { preambleCode: false } }),',
  )

  expect(result).toMatch('import { crx }')
  expect(result).toMatch(`from '@crxjs/vite-plugin'`)
  expect(result).toMatch(
    'crx({ manifest, contentScripts: { preambleCode: false } }),',
  )

  expect(result).toMatch(`import react from '@vitejs/plugin-react'`)
  expect(result).toMatch('react(),')
})
