import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/Variants.tsx', 'src/variant.ts', 'src/read-helpers.ts', 'src/script-generator.ts', 'src/types.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  bundle: false, // Don't bundle - preserves 'use client' directives
  external: ['react', 'react-dom'],
  outDir: 'dist',
  outExtension({ format }) {
    return {
      js: format === 'cjs' ? '.cjs' : '.js',
    }
  },
})
