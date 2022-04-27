import { defineConfig } from 'rollup'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import esbuild from 'rollup-plugin-esbuild'

export default defineConfig({
  input: 'src/main.ts',
  output: {
    file: 'bin/main.js',
    banner: '#!/usr/bin/env node',
  },
  plugins: [commonjs(), resolve(), esbuild({ target: 'esnext' })],
  external: ['fs/promises'],
})
