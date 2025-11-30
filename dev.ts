/**
 * Development script that runs API and UI servers concurrently
 */

import { spawn } from 'bun'

console.log('Starting development servers...\n')

// Start API server
const api = spawn({
  cmd: ['bun', '--hot', 'packages/api/server.ts'],
  stdout: 'inherit',
  stderr: 'inherit',
})

// Start UI server
const ui = spawn({
  cmd: ['bun', '--hot', 'packages/ui/index.html'],
  stdout: 'inherit',
  stderr: 'inherit',
})

// Handle process termination
process.on('SIGINT', () => {
  api.kill()
  ui.kill()
  process.exit(0)
})

// Wait for both processes
await Promise.all([api.exited, ui.exited])
