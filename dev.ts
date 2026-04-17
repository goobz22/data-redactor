/**
 * Development script that runs Presidio, API, and UI servers concurrently
 */

import { spawn } from 'bun'
import { join } from 'node:path'

console.log('Starting development servers...\n')

// Path to Presidio Python executable
const presidioPath = join(import.meta.dir, 'presidio-backend')
const pythonExe = join(presidioPath, 'Scripts', 'python.exe')
const presidioScript = join(presidioPath, 'presidio_server.py')

// Start Presidio backend
console.log('[DEV] Starting Presidio backend on port 5050...')
const presidio = spawn({
  cmd: [pythonExe, presidioScript],
  stdout: 'inherit',
  stderr: 'inherit',
})

// Wait a bit for Presidio to initialize before starting Bun servers
await new Promise(resolve => setTimeout(resolve, 6000))
console.log('[DEV] Presidio initialized, starting Bun servers...\n')

// Start API server on port 3001 for dev mode
const api = spawn({
  cmd: ['bun', '--hot', 'packages/api/server.ts'],
  stdout: 'inherit',
  stderr: 'inherit',
  env: { ...process.env, PORT: '3001' },
})

// Start UI server
const ui = spawn({
  cmd: ['bun', '--hot', 'packages/ui/index.html'],
  stdout: 'inherit',
  stderr: 'inherit',
})

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n[DEV] Shutting down all servers...')
  presidio.kill()
  api.kill()
  ui.kill()
  process.exit(0)
})

// Wait for all processes
await Promise.all([presidio.exited, api.exited, ui.exited])
