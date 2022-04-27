import { readFileSync } from 'fs'
import { resolve } from 'path'
import { codemod } from './codemod'

test('simple js vite config', () => {
  const config = resolve(__dirname, '../fixtures/vite.config.js')
  const code = readFileSync(config, { encoding: 'utf-8' })
  const result = codemod({ code, isTypeScript: false })

  expect(result).not.toMatch('import { chromeExtension }')
  expect(result).not.toMatch(`from 'rollup-plugin-chrome-extension'`)
  expect(result).not.toMatch('plugins: [chromeExtension({ manifest })]')

  expect(result).toMatch('import { crx }')
  expect(result).toMatch(`from '@crxjs/vite-plugin'`)
  expect(result).toMatch('plugins: [crx({ manifest })]')
})

test('ts vite config with type import', () => {
  const config = resolve(__dirname, '../fixtures/vite.config.ts')
  const code = readFileSync(config, { encoding: 'utf-8' })
  const result = codemod({ code, isTypeScript: true })

  expect(result).not.toMatch('import { chromeExtension }')
  expect(result).not.toMatch(`from 'rollup-plugin-chrome-extension'`)
  expect(result).not.toMatch(
    'chromeExtension({ manifest, contentScripts: { preambleCode: false } }),',
  )

  expect(result).toMatch('import { crx, defineManifest }')
  expect(result).toMatch(`from '@crxjs/vite-plugin'`)
  expect(result).toMatch(
    'crx({ manifest, contentScripts: { preambleCode: false } }),',
  )

  expect(result).toMatch(`import react from '@vitejs/plugin-react'`)
  expect(result).toMatch('react(),')
})
