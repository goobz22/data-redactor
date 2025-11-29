// Build script for UI - bundles main.js with dependencies for static deployment
import { copyFileSync, mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = join(__dirname, 'dist')

// Create output directory
if (!existsSync(outDir)) {
  mkdirSync(outDir, { recursive: true })
}

// Bundle main.js with Bun
const result = await Bun.build({
  entrypoints: [join(__dirname, 'packages/ui/main.js')],
  outdir: outDir,
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
copyFileSync(join(__dirname, 'packages/ui/index.html'), join(outDir, 'index.html'))
copyFileSync(join(__dirname, 'packages/ui/styles.css'), join(outDir, 'styles.css'))

console.log('UI build complete! Output in dist/')
