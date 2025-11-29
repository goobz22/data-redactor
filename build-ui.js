// Build script for UI - bundles main.js with dependencies for static deployment
import { copyFileSync, mkdirSync, readdirSync } from 'fs'
import { join } from 'path'

const rootDir = process.cwd()
const outDir = join(rootDir, 'dist')

console.log('Build starting...')
console.log('Root directory:', rootDir)
console.log('Output directory:', outDir)

// Create output directory
mkdirSync(outDir, { recursive: true })

// Bundle main.js with Bun
const result = await Bun.build({
  entrypoints: [join(rootDir, 'packages/ui/main.js')],
  outdir: outDir,
  naming: 'main.js',
  minify: true,
  target: 'browser',
})

if (!result.success) {
  console.error('Build failed:')
  for (const log of result.logs) {
    console.error(log)
  }
  process.exit(1)
}

// Copy static files
copyFileSync(join(rootDir, 'packages/ui/index.html'), join(outDir, 'index.html'))
copyFileSync(join(rootDir, 'packages/ui/styles.css'), join(outDir, 'styles.css'))

// List output files
console.log('UI build complete! Output in dist/:')
const files = readdirSync(outDir)
for (const file of files) {
  console.log(`  - ${file}`)
}
