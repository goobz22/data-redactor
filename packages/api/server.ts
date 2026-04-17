import { handleFeedback } from './routes/feedback'
import { handlePatterns } from './routes/patterns'
import { join, extname } from 'node:path'

const PORT = Bun.env.PORT || 3000
const PRESIDIO_URL = Bun.env.PRESIDIO_URL || 'http://localhost:5050'

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
            version: '1.0.8',
          },
          { headers: corsHeaders }
        )
      }

      // Redaction endpoints
      if (urlPath === '/api/redact' && req.method === 'POST') {
        return handleRedact(req)
      }

      // Image redaction endpoint
      if (urlPath === '/api/redact/image' && req.method === 'POST') {
        return handleRedactImage(req)
      }

      // PDF redaction endpoint
      if (urlPath === '/api/redact/pdf' && req.method === 'POST') {
        return handleRedactPdf(req)
      }

      // Feedback endpoints
      if (urlPath === '/api/feedback') {
        return handleFeedback(req, corsHeaders)
      }

      // Edge cases endpoints (must come before /api/patterns)
      if (urlPath.startsWith('/api/edge-cases')) {
        return handlePatterns(req, corsHeaders)
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

      // Custom recognizers endpoints
      if (urlPath === '/api/recognizers' && req.method === 'GET') {
        return handleGetRecognizers()
      }

      if (urlPath === '/api/recognizers/deny-list' && req.method === 'POST') {
        return handleAddDenyListRecognizer(req)
      }

      if (urlPath === '/api/recognizers/pattern' && req.method === 'POST') {
        return handleAddPatternRecognizer(req)
      }

      if (urlPath.startsWith('/api/recognizers/') && req.method === 'DELETE') {
        const name = urlPath.replace('/api/recognizers/', '')
        return handleDeleteRecognizer(name)
      }

      // Strategies endpoint
      if (urlPath === '/api/strategies' && req.method === 'GET') {
        return handleGetStrategies()
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
    const { text, config } = body

    // Validate required field
    if (!text || typeof text !== 'string') {
      return Response.json(
        { error: 'Missing required field: text (must be a string)' },
        { status: 400, headers: corsHeaders }
      )
    }

    // Forward to Presidio backend
    const response = await fetch(`${PRESIDIO_URL}/redact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, config }),
    })

    if (!response.ok) {
      const error = await response.json()
      return Response.json(
        { error: error.error || 'Presidio redaction failed' },
        { status: response.status, headers: corsHeaders }
      )
    }

    const result = await response.json()
    return Response.json(result, { headers: corsHeaders })
  } catch (error) {
    if (error instanceof SyntaxError) {
      return Response.json(
        { error: 'Invalid JSON payload' },
        { status: 400, headers: corsHeaders }
      )
    }
    console.error('Presidio error:', error)
    return Response.json(
      { error: 'Failed to connect to Presidio backend. Is it running?' },
      { status: 503, headers: corsHeaders }
    )
  }
}

async function handleRedactImage(req: Request): Promise<Response> {
  try {
    // Forward the multipart form data directly to Presidio
    const formData = await req.formData()

    // Rebuild form data for Presidio
    const presidioFormData = new FormData()
    for (const [key, value] of formData.entries()) {
      presidioFormData.append(key, value)
    }

    const response = await fetch(`${PRESIDIO_URL}/redact/image`, {
      method: 'POST',
      body: presidioFormData,
    })

    if (!response.ok) {
      const contentType = response.headers.get('content-type')
      if (contentType?.includes('application/json')) {
        const error = await response.json()
        return Response.json(
          { error: error.error || 'Image redaction failed' },
          { status: response.status, headers: corsHeaders }
        )
      }
      return Response.json(
        { error: 'Image redaction failed' },
        { status: response.status, headers: corsHeaders }
      )
    }

    // Return the redacted image
    const imageData = await response.arrayBuffer()
    return new Response(imageData, {
      headers: {
        'Content-Type': 'image/png',
        ...corsHeaders,
      },
    })
  } catch (error) {
    console.error('Image redaction error:', error)
    return Response.json(
      { error: 'Failed to connect to Presidio backend. Is it running?' },
      { status: 503, headers: corsHeaders }
    )
  }
}

async function handleRedactPdf(req: Request): Promise<Response> {
  try {
    // Forward the multipart form data directly to Presidio
    const formData = await req.formData()

    // Rebuild form data for Presidio
    const presidioFormData = new FormData()
    for (const [key, value] of formData.entries()) {
      presidioFormData.append(key, value)
    }

    const response = await fetch(`${PRESIDIO_URL}/redact/pdf`, {
      method: 'POST',
      body: presidioFormData,
    })

    if (!response.ok) {
      const contentType = response.headers.get('content-type')
      if (contentType?.includes('application/json')) {
        const error = await response.json()
        return Response.json(
          { error: error.error || 'PDF redaction failed' },
          { status: response.status, headers: corsHeaders }
        )
      }
      return Response.json(
        { error: 'PDF redaction failed' },
        { status: response.status, headers: corsHeaders }
      )
    }

    // Return the redacted PDF
    const pdfData = await response.arrayBuffer()
    return new Response(pdfData, {
      headers: {
        'Content-Type': 'application/pdf',
        ...corsHeaders,
      },
    })
  } catch (error) {
    console.error('PDF redaction error:', error)
    return Response.json(
      { error: 'Failed to connect to Presidio backend. Is it running?' },
      { status: 503, headers: corsHeaders }
    )
  }
}

// Custom recognizer handlers
async function handleGetRecognizers(): Promise<Response> {
  try {
    const response = await fetch(`${PRESIDIO_URL}/recognizers`)
    if (!response.ok) {
      return Response.json(
        { error: 'Failed to get recognizers' },
        { status: response.status, headers: corsHeaders }
      )
    }
    const result = await response.json()
    return Response.json(result, { headers: corsHeaders })
  } catch (error) {
    console.error('Get recognizers error:', error)
    return Response.json(
      { error: 'Failed to connect to Presidio backend' },
      { status: 503, headers: corsHeaders }
    )
  }
}

async function handleAddDenyListRecognizer(req: Request): Promise<Response> {
  try {
    const body = await req.json()
    const response = await fetch(`${PRESIDIO_URL}/recognizers/deny-list`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!response.ok) {
      const error = await response.json()
      return Response.json(
        { error: error.error || 'Failed to add deny-list recognizer' },
        { status: response.status, headers: corsHeaders }
      )
    }
    const result = await response.json()
    return Response.json(result, { headers: corsHeaders })
  } catch (error) {
    console.error('Add deny-list error:', error)
    return Response.json(
      { error: 'Failed to connect to Presidio backend' },
      { status: 503, headers: corsHeaders }
    )
  }
}

async function handleAddPatternRecognizer(req: Request): Promise<Response> {
  try {
    const body = await req.json()
    const response = await fetch(`${PRESIDIO_URL}/recognizers/pattern`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!response.ok) {
      const error = await response.json()
      return Response.json(
        { error: error.error || 'Failed to add pattern recognizer' },
        { status: response.status, headers: corsHeaders }
      )
    }
    const result = await response.json()
    return Response.json(result, { headers: corsHeaders })
  } catch (error) {
    console.error('Add pattern error:', error)
    return Response.json(
      { error: 'Failed to connect to Presidio backend' },
      { status: 503, headers: corsHeaders }
    )
  }
}

async function handleDeleteRecognizer(name: string): Promise<Response> {
  try {
    const response = await fetch(
      `${PRESIDIO_URL}/recognizers/${encodeURIComponent(name)}`,
      { method: 'DELETE' }
    )
    if (!response.ok) {
      const error = await response.json()
      return Response.json(
        { error: error.error || 'Failed to delete recognizer' },
        { status: response.status, headers: corsHeaders }
      )
    }
    const result = await response.json()
    return Response.json(result, { headers: corsHeaders })
  } catch (error) {
    console.error('Delete recognizer error:', error)
    return Response.json(
      { error: 'Failed to connect to Presidio backend' },
      { status: 503, headers: corsHeaders }
    )
  }
}

async function handleGetStrategies(): Promise<Response> {
  try {
    const response = await fetch(`${PRESIDIO_URL}/strategies`)
    if (!response.ok) {
      return Response.json(
        { error: 'Failed to get strategies' },
        { status: response.status, headers: corsHeaders }
      )
    }
    const result = await response.json()
    return Response.json(result, { headers: corsHeaders })
  } catch (error) {
    console.error('Get strategies error:', error)
    return Response.json(
      { error: 'Failed to connect to Presidio backend' },
      { status: 503, headers: corsHeaders }
    )
  }
}

console.log(`
============================================================
           Data Redactor Server v1.1.0
============================================================
  UI:      http://localhost:${server.port}
  API:     http://localhost:${server.port}/api
  Backend: Presidio (${PRESIDIO_URL})
------------------------------------------------------------
  Endpoints:
    GET  /api/health          - Health check
    POST /api/redact          - Redact text
    POST /api/redact/image    - Redact image (OCR)
    POST /api/redact/pdf      - Redact PDF
    GET  /api/recognizers     - List recognizers
    POST /api/recognizers/*   - Add custom recognizers
    GET  /api/strategies      - List strategies
    GET  /api/patterns        - Community patterns
    POST /api/feedback        - Submit feedback
============================================================
`)
