import {
  savePattern,
  getAllPatterns,
  getPatternCount,
  getPatternsByCategory,
  getPatternById,
  updatePatternStatus,
  upvotePattern,
  downvotePattern,
  incrementPatternUsage,
  deletePattern,
  type CommunityPattern,
} from '../db/client'

/**
 * Handle community patterns API requests
 * GET    /api/patterns           - List all patterns with pagination
 * GET    /api/patterns/:id       - Get a single pattern
 * POST   /api/patterns           - Submit new pattern
 * POST   /api/patterns/:id/vote  - Vote on a pattern
 * POST   /api/patterns/:id/use   - Mark pattern as used
 * PATCH  /api/patterns/:id       - Update pattern status (admin)
 * DELETE /api/patterns/:id       - Delete pattern (admin)
 */
export async function handlePatterns(
  req: Request,
  corsHeaders: Record<string, string>
): Promise<Response> {
  const url = new URL(req.url)
  const pathParts = url.pathname.split('/').filter(Boolean)

  // /api/patterns/:id/vote or /api/patterns/:id/use
  if (pathParts.length === 4 && pathParts[2]) {
    const id = pathParts[2]
    const action = pathParts[3]

    if (action === 'vote' && req.method === 'POST') {
      return handleVote(req, id, corsHeaders)
    }

    if (action === 'use' && req.method === 'POST') {
      return handleUse(id, corsHeaders)
    }
  }

  // /api/patterns/:id
  if (pathParts.length === 3 && pathParts[2]) {
    const id = pathParts[2]

    if (req.method === 'GET') {
      return handleGetOne(id, corsHeaders)
    }

    if (req.method === 'PATCH') {
      return handleUpdateStatus(req, id, corsHeaders)
    }

    if (req.method === 'DELETE') {
      return handleDelete(id, corsHeaders)
    }
  }

  // /api/patterns
  try {
    // GET - List patterns
    if (req.method === 'GET') {
      const limit = parseInt(url.searchParams.get('limit') || '100')
      const offset = parseInt(url.searchParams.get('offset') || '0')
      const category = url.searchParams.get('category')
      const status = url.searchParams.get('status')

      let patterns: CommunityPattern[]
      if (category) {
        patterns = await getPatternsByCategory(category, limit)
      } else {
        patterns = await getAllPatterns(limit, offset, status || undefined)
      }

      const count = await getPatternCount(status || undefined)

      return Response.json(
        {
          patterns,
          count,
          limit,
          offset,
        },
        { headers: corsHeaders }
      )
    }

    // POST - Submit new pattern
    if (req.method === 'POST') {
      const body = await req.json()
      const { name, regex, description, category, samples, segments } = body

      // Validate required fields
      if (!name || !regex) {
        return Response.json(
          { error: 'Missing required fields: name, regex' },
          { status: 400, headers: corsHeaders }
        )
      }

      // Validate category
      const validCategories = [
        'identifier',
        'financial',
        'healthcare',
        'infrastructure',
        'personal',
        'custom',
      ]
      if (category && !validCategories.includes(category)) {
        return Response.json(
          {
            error: `Invalid category. Must be one of: ${validCategories.join(', ')}`,
          },
          { status: 400, headers: corsHeaders }
        )
      }

      // Validate regex is valid
      try {
        new RegExp(regex)
      } catch {
        return Response.json(
          { error: 'Invalid regex pattern' },
          { status: 400, headers: corsHeaders }
        )
      }

      const pattern: CommunityPattern = {
        name,
        regex,
        description,
        category: category || 'custom',
        samples: samples || [],
        segments: segments || [],
        status: 'pending',
      }

      const result = await savePattern(pattern)

      return Response.json(
        {
          success: true,
          id: result.id,
          createdAt: result.created_at,
        },
        { status: 201, headers: corsHeaders }
      )
    }

    // Method not allowed
    return Response.json(
      { error: 'Method not allowed' },
      { status: 405, headers: corsHeaders }
    )
  } catch (error) {
    console.error('[Patterns] Error:', error)

    // Check if it's a database error
    if (error instanceof Error && error.message.includes('SQLite')) {
      return Response.json(
        {
          error: 'Database error. Please check SQLite file permissions.',
          details:
            process.env.NODE_ENV === 'development' ? error.message : undefined,
        },
        { status: 503, headers: corsHeaders }
      )
    }

    return Response.json(
      { error: 'Failed to process patterns request' },
      { status: 500, headers: corsHeaders }
    )
  }
}

async function handleGetOne(
  id: string,
  corsHeaders: Record<string, string>
): Promise<Response> {
  try {
    const pattern = await getPatternById(id)

    if (!pattern) {
      return Response.json(
        { error: 'Pattern not found' },
        { status: 404, headers: corsHeaders }
      )
    }

    return Response.json({ pattern }, { headers: corsHeaders })
  } catch (error) {
    console.error('[Patterns] Get one error:', error)
    return Response.json(
      { error: 'Failed to fetch pattern' },
      { status: 500, headers: corsHeaders }
    )
  }
}

async function handleVote(
  req: Request,
  id: string,
  corsHeaders: Record<string, string>
): Promise<Response> {
  try {
    const body = await req.json()
    const { vote } = body

    if (vote !== 'up' && vote !== 'down') {
      return Response.json(
        { error: 'Invalid vote. Must be "up" or "down"' },
        { status: 400, headers: corsHeaders }
      )
    }

    const success =
      vote === 'up' ? await upvotePattern(id) : await downvotePattern(id)

    if (!success) {
      return Response.json(
        { error: 'Pattern not found' },
        { status: 404, headers: corsHeaders }
      )
    }

    return Response.json({ success: true, vote }, { headers: corsHeaders })
  } catch (error) {
    console.error('[Patterns] Vote error:', error)
    return Response.json(
      { error: 'Failed to vote on pattern' },
      { status: 500, headers: corsHeaders }
    )
  }
}

async function handleUse(
  id: string,
  corsHeaders: Record<string, string>
): Promise<Response> {
  try {
    const success = await incrementPatternUsage(id)

    if (!success) {
      return Response.json(
        { error: 'Pattern not found' },
        { status: 404, headers: corsHeaders }
      )
    }

    return Response.json({ success: true }, { headers: corsHeaders })
  } catch (error) {
    console.error('[Patterns] Use error:', error)
    return Response.json(
      { error: 'Failed to mark pattern as used' },
      { status: 500, headers: corsHeaders }
    )
  }
}

async function handleUpdateStatus(
  req: Request,
  id: string,
  corsHeaders: Record<string, string>
): Promise<Response> {
  try {
    const body = await req.json()
    const { status } = body

    const validStatuses = ['pending', 'approved', 'rejected']
    if (!validStatuses.includes(status)) {
      return Response.json(
        {
          error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
        },
        { status: 400, headers: corsHeaders }
      )
    }

    const success = await updatePatternStatus(id, status)

    if (!success) {
      return Response.json(
        { error: 'Pattern not found' },
        { status: 404, headers: corsHeaders }
      )
    }

    return Response.json({ success: true, status }, { headers: corsHeaders })
  } catch (error) {
    console.error('[Patterns] Update status error:', error)
    return Response.json(
      { error: 'Failed to update pattern status' },
      { status: 500, headers: corsHeaders }
    )
  }
}

async function handleDelete(
  id: string,
  corsHeaders: Record<string, string>
): Promise<Response> {
  try {
    const deleted = await deletePattern(id)

    if (!deleted) {
      return Response.json(
        { error: 'Pattern not found' },
        { status: 404, headers: corsHeaders }
      )
    }

    return Response.json(
      { success: true, deleted: id },
      { headers: corsHeaders }
    )
  } catch (error) {
    console.error('[Patterns] Delete error:', error)
    return Response.json(
      { error: 'Failed to delete pattern' },
      { status: 500, headers: corsHeaders }
    )
  }
}
