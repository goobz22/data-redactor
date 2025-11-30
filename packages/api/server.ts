import { DataRedactor, getPreset, hasPreset } from '../core/src/index'
import type { PresetName } from '../core/src/index'
import { handleFeedback } from './routes/feedback'
import { handlePatterns } from './routes/patterns'
import { join, extname } from 'node:path'

const PORT = Bun.env.PORT || 3000

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

// MIME types for static files
const mimeTypes: Record<string, string> = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
}

// Resolve paths relative to project root
const projectRoot = join(import.meta.dir, '../..')
const distDir = join(projectRoot, 'dist')

const server = Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url)
    const urlPath = url.pathname

    // CORS preflight
    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders })
    }

    try {
      // ===================
      // API ROUTES
      // ===================

      // Health check
      if (urlPath === '/api/health' && req.method === 'GET') {
        return Response.json(
          {
            status: 'ok',
            timestamp: new Date().toISOString(),
            version: '1.0.7',
          },
          { headers: corsHeaders }
        )
      }

      // Redaction endpoint
      if (urlPath === '/api/redact' && req.method === 'POST') {
        return handleRedact(req)
      }

      // Feedback endpoints
      if (urlPath === '/api/feedback') {
        return handleFeedback(req, corsHeaders)
      }

      // Community patterns endpoints
      if (urlPath.startsWith('/api/patterns')) {
        return handlePatterns(req, corsHeaders)
      }

      // Presets endpoint
      if (urlPath === '/api/presets' && req.method === 'GET') {
        return Response.json(
          {
            presets: [
              'strict-ai',
              'minimal',
              'logs',
              'financial',
              'healthcare',
            ],
          },
          { headers: corsHeaders }
        )
      }

      // ===================
      // STATIC FILE SERVING
      // ===================

      // Serve static files from dist directory
      const filePath = urlPath === '/' ? '/index.html' : urlPath
      const fullPath = join(distDir, filePath)

      // Check if file exists
      const file = Bun.file(fullPath)
      if (await file.exists()) {
        const ext = extname(filePath)
        const contentType = mimeTypes[ext] || 'application/octet-stream'
        return new Response(file, {
          headers: { 'Content-Type': contentType },
        })
      }

      // SPA fallback - serve index.html for non-API routes
      if (!urlPath.startsWith('/api/')) {
        const indexFile = Bun.file(join(distDir, 'index.html'))
        if (await indexFile.exists()) {
          return new Response(indexFile, {
            headers: { 'Content-Type': 'text/html' },
          })
        }
      }

      // 404 for unknown routes
      return Response.json(
        { error: 'Not found', path: urlPath },
        { status: 404, headers: corsHeaders }
      )
    } catch (error) {
      console.error('Server error:', error)
      return Response.json(
        { error: 'Internal server error' },
        { status: 500, headers: corsHeaders }
      )
    }
  },
})

async function handleRedact(req: Request): Promise<Response> {
  try {
    const body = await req.json()
    const { text, config, preset } = body

    // Validate required field
    if (!text || typeof text !== 'string') {
      return Response.json(
        { error: 'Missing required field: text (must be a string)' },
        { status: 400, headers: corsHeaders }
      )
    }

    // Validate preset if provided
    if (preset && !hasPreset(preset)) {
      return Response.json(
        {
          error: `Invalid preset: ${preset}. Available presets: strict-ai, minimal, logs, financial, healthcare`,
        },
        { status: 400, headers: corsHeaders }
      )
    }

    // Determine configuration
    let redactorConfig
    if (preset && !config) {
      redactorConfig = getPreset(preset as PresetName)
    } else if (config) {
      redactorConfig = config
    }

    // Create redactor and process
    const redactor = new DataRedactor(redactorConfig)
    const result = redactor.redact(text)

    // Build response
    return Response.json(
      {
        redactedText: result.redactedText,
        stats: {
          originalLength: text.length,
          redactedLength: result.redactedText.length,
          matchCount: result.matches.length,
          types: [...new Set(result.matches.map(m => m.type))],
        },
        mapping: result.mapping,
      },
      { headers: corsHeaders }
    )
  } catch (error) {
    if (error instanceof SyntaxError) {
      return Response.json(
        { error: 'Invalid JSON payload' },
        { status: 400, headers: corsHeaders }
      )
    }
    console.error('Redact error:', error)
    return Response.json(
      { error: 'Redaction failed' },
      { status: 500, headers: corsHeaders }
    )
  }
}

console.log(`
╔═══════════════════════════════════════════════════════════╗
║           Data Redactor Server                            ║
╠═══════════════════════════════════════════════════════════╣
║  UI:     http://localhost:${server.port}                          ║
║  API:    http://localhost:${server.port}/api                      ║
╠═══════════════════════════════════════════════════════════╣
║  Endpoints:                                               ║
║    GET  /api/health       - Health check                  ║
║    POST /api/redact       - Redact sensitive data         ║
║    GET  /api/presets      - List available presets        ║
║    GET  /api/feedback     - List feedback submissions     ║
║    POST /api/feedback     - Submit feedback               ║
║    GET  /api/patterns     - List community patterns       ║
║    POST /api/patterns     - Submit pattern                ║
║    GET  /api/patterns/:id - Get pattern details           ║
╚═══════════════════════════════════════════════════════════╝
`)
