import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/adapters/*/*.ts'],
  format: ['esm'],
  dts: true,
})
