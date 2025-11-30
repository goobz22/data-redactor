import { DataRedactor, getPreset, hasPreset } from '../core/src/index'
import type { PresetName } from '../core/src/index'
import { handleFeedback } from './routes/feedback'
import { handlePatterns } from './routes/patterns'

const PORT = process.env.PORT || 3001

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

const server = Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url)
    const path = url.pathname

    // CORS preflight
    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders })
    }

    try {
      // Health check
      if (path === '/api/health' && req.method === 'GET') {
        return Response.json(
          {
            status: 'ok',
            timestamp: new Date().toISOString(),
            version: '1.0.6',
          },
          { headers: corsHeaders }
        )
      }

      // Redaction endpoint
      if (path === '/api/redact' && req.method === 'POST') {
        return handleRedact(req)
      }

      // Feedback endpoints
      if (path === '/api/feedback') {
        return handleFeedback(req, corsHeaders)
      }

      // Community patterns endpoints
      if (path.startsWith('/api/patterns')) {
        return handlePatterns(req, corsHeaders)
      }

      // Presets endpoint
      if (path === '/api/presets' && req.method === 'GET') {
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

      // 404 for unknown routes
      return Response.json(
        { error: 'Not found', path },
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
║           Data Redactor API Server                        ║
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

Server running at http://localhost:${server.port}
`)
