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
  saveEdgeCase,
  getEdgeCases,
  getEdgeCaseCount,
  getEdgeCaseById,
  upvoteEdgeCase,
  downvoteEdgeCase,
  updateEdgeCaseStatus,
  deleteEdgeCase,
  saveSampleSubmission,
  getSampleSubmissions,
  getSampleSubmissionById,
  deleteSampleSubmission,
  type CommunityPattern,
  type EdgeCaseReport,
  type SampleSubmission,
} from '../db/client'

/**
 * Handle community patterns API requests
 * GET    /api/patterns                                 - List all patterns with pagination
 * GET    /api/patterns/:id                             - Get a single pattern
 * POST   /api/patterns                                 - Submit new pattern
 * POST   /api/patterns/:id/vote                        - Vote on a pattern
 * POST   /api/patterns/:id/use                         - Mark pattern as used
 * PATCH  /api/patterns/:id                             - Update pattern status (admin)
 * DELETE /api/patterns/:id                             - Delete pattern (admin)
 * GET    /api/patterns/:name/edge-cases                - List edge cases for a pattern
 * POST   /api/patterns/:name/edge-cases                - Submit edge case report
 * GET    /api/patterns/:name/sample-submissions        - List sample submissions
 * POST   /api/patterns/:name/sample-submissions        - Submit test sample
 * POST   /api/edge-cases/:id/vote                      - Vote on edge case
 * PATCH  /api/edge-cases/:id                           - Update edge case status
 * DELETE /api/edge-cases/:id                           - Delete edge case
 */
export async function handlePatterns(
  req: Request,
  corsHeaders: Record<string, string>
): Promise<Response> {
  const url = new URL(req.url)
  const pathParts = url.pathname.split('/').filter(Boolean)

  // /api/edge-cases (GET all edge cases, no pattern filter)
  if (
    pathParts.length === 2 &&
    pathParts[1] === 'edge-cases' &&
    req.method === 'GET'
  ) {
    return handleGetEdgeCases(url, undefined, corsHeaders)
  }

  // /api/edge-cases/:id/vote
  if (
    pathParts.length === 4 &&
    pathParts[1] === 'edge-cases' &&
    pathParts[3] === 'vote' &&
    req.method === 'POST'
  ) {
    return handleEdgeCaseVote(req, pathParts[2], corsHeaders)
  }

  // /api/edge-cases/:id (GET, PATCH or DELETE)
  if (pathParts.length === 3 && pathParts[1] === 'edge-cases') {
    const id = pathParts[2]

    if (req.method === 'GET') {
      return handleGetEdgeCaseById(id, corsHeaders)
    }

    if (req.method === 'PATCH') {
      return handleUpdateEdgeCaseStatus(req, id, corsHeaders)
    }

    if (req.method === 'DELETE') {
      return handleDeleteEdgeCase(id, corsHeaders)
    }
  }

  // /api/patterns/:name/edge-cases
  if (
    pathParts.length === 4 &&
    pathParts[1] === 'patterns' &&
    pathParts[3] === 'edge-cases'
  ) {
    const patternName = pathParts[2]

    if (req.method === 'GET') {
      return handleGetEdgeCases(url, patternName, corsHeaders)
    }

    if (req.method === 'POST') {
      return handleSubmitEdgeCase(req, patternName, corsHeaders)
    }
  }

  // /api/patterns/:name/sample-submissions
  if (
    pathParts.length === 4 &&
    pathParts[1] === 'patterns' &&
    pathParts[3] === 'sample-submissions'
  ) {
    const patternName = pathParts[2]

    if (req.method === 'GET') {
      return handleGetSampleSubmissions(url, patternName, corsHeaders)
    }

    if (req.method === 'POST') {
      return handleSubmitSample(req, patternName, corsHeaders)
    }
  }

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

// =============================================================================
// EDGE CASE HANDLERS
// =============================================================================

async function handleGetEdgeCases(
  url: URL,
  patternName: string | undefined,
  corsHeaders: Record<string, string>
): Promise<Response> {
  try {
    const status = url.searchParams.get('status') as
      | 'open'
      | 'fixed'
      | 'wont-fix'
      | null
    const limit = parseInt(url.searchParams.get('limit') || '100')
    const offset = parseInt(url.searchParams.get('offset') || '0')

    const edgeCases = await getEdgeCases(
      patternName,
      status || undefined,
      limit,
      offset
    )
    const count = await getEdgeCaseCount(patternName, status || undefined)

    return Response.json(
      {
        edgeCases,
        count,
        limit,
        offset,
        patternName: patternName || null,
      },
      { headers: corsHeaders }
    )
  } catch (error) {
    console.error('[Edge Cases] Get error:', error)
    return Response.json(
      { error: 'Failed to fetch edge cases' },
      { status: 500, headers: corsHeaders }
    )
  }
}

async function handleSubmitEdgeCase(
  req: Request,
  patternName: string,
  corsHeaders: Record<string, string>
): Promise<Response> {
  try {
    const body = await req.json()
    const {
      reportType,
      fullSampleText,
      problematicValue,
      expectedBehavior,
      context,
      submittedBy,
    } = body

    // Validate required fields
    if (
      !reportType ||
      !fullSampleText ||
      !problematicValue ||
      !expectedBehavior
    ) {
      return Response.json(
        {
          error:
            'Missing required fields: reportType, fullSampleText, problematicValue, expectedBehavior',
        },
        { status: 400, headers: corsHeaders }
      )
    }

    // Validate report type
    const validTypes = ['false-positive', 'false-negative', 'performance']
    if (!validTypes.includes(reportType)) {
      return Response.json(
        {
          error: `Invalid reportType. Must be one of: ${validTypes.join(', ')}`,
        },
        { status: 400, headers: corsHeaders }
      )
    }

    // Validate sample text size (500 lines max)
    const lineCount = fullSampleText.split('\n').length
    if (lineCount > 500) {
      return Response.json(
        { error: 'Sample text too large (500 line maximum)' },
        { status: 400, headers: corsHeaders }
      )
    }

    const edgeCase: EdgeCaseReport = {
      pattern_name: patternName,
      report_type: reportType,
      full_sample_text: fullSampleText,
      problematic_value: problematicValue,
      expected_behavior: expectedBehavior,
      context: context || undefined,
      submitted_by: submittedBy || undefined,
      votes: 0,
      status: 'open',
    }

    const result = await saveEdgeCase(edgeCase)

    return Response.json(
      {
        success: true,
        id: result.id,
        createdAt: result.created_at,
      },
      { status: 201, headers: corsHeaders }
    )
  } catch (error) {
    console.error('[Edge Cases] Submit error:', error)
    return Response.json(
      { error: 'Failed to submit edge case' },
      { status: 500, headers: corsHeaders }
    )
  }
}

async function handleGetEdgeCaseById(
  id: string,
  corsHeaders: Record<string, string>
): Promise<Response> {
  try {
    const edgeCase = await getEdgeCaseById(id)

    if (!edgeCase) {
      return Response.json(
        { error: 'Edge case not found' },
        { status: 404, headers: corsHeaders }
      )
    }

    return Response.json(edgeCase, { headers: corsHeaders })
  } catch (error) {
    console.error('[Edge Cases] Get by ID error:', error)
    return Response.json(
      { error: 'Failed to fetch edge case' },
      { status: 500, headers: corsHeaders }
    )
  }
}

async function handleEdgeCaseVote(
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
      vote === 'up' ? await upvoteEdgeCase(id) : await downvoteEdgeCase(id)

    if (!success) {
      return Response.json(
        { error: 'Edge case not found' },
        { status: 404, headers: corsHeaders }
      )
    }

    return Response.json({ success: true, vote }, { headers: corsHeaders })
  } catch (error) {
    console.error('[Edge Cases] Vote error:', error)
    return Response.json(
      { error: 'Failed to vote on edge case' },
      { status: 500, headers: corsHeaders }
    )
  }
}

async function handleUpdateEdgeCaseStatus(
  req: Request,
  id: string,
  corsHeaders: Record<string, string>
): Promise<Response> {
  try {
    const body = await req.json()
    const { status } = body

    const validStatuses = ['open', 'fixed', 'wont-fix']
    if (!validStatuses.includes(status)) {
      return Response.json(
        {
          error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
        },
        { status: 400, headers: corsHeaders }
      )
    }

    const success = await updateEdgeCaseStatus(id, status)

    if (!success) {
      return Response.json(
        { error: 'Edge case not found' },
        { status: 404, headers: corsHeaders }
      )
    }

    return Response.json({ success: true, status }, { headers: corsHeaders })
  } catch (error) {
    console.error('[Edge Cases] Update status error:', error)
    return Response.json(
      { error: 'Failed to update edge case status' },
      { status: 500, headers: corsHeaders }
    )
  }
}

async function handleDeleteEdgeCase(
  id: string,
  corsHeaders: Record<string, string>
): Promise<Response> {
  try {
    const deleted = await deleteEdgeCase(id)

    if (!deleted) {
      return Response.json(
        { error: 'Edge case not found' },
        { status: 404, headers: corsHeaders }
      )
    }

    return Response.json(
      { success: true, deleted: id },
      { headers: corsHeaders }
    )
  } catch (error) {
    console.error('[Edge Cases] Delete error:', error)
    return Response.json(
      { error: 'Failed to delete edge case' },
      { status: 500, headers: corsHeaders }
    )
  }
}

// =============================================================================
// SAMPLE SUBMISSION HANDLERS
// =============================================================================

async function handleGetSampleSubmissions(
  url: URL,
  patternName: string,
  corsHeaders: Record<string, string>
): Promise<Response> {
  try {
    const limit = parseInt(url.searchParams.get('limit') || '100')
    const offset = parseInt(url.searchParams.get('offset') || '0')

    const submissions = await getSampleSubmissions(patternName, limit, offset)

    return Response.json(
      {
        submissions,
        count: submissions.length,
        limit,
        offset,
        patternName,
      },
      { headers: corsHeaders }
    )
  } catch (error) {
    console.error('[Sample Submissions] Get error:', error)
    return Response.json(
      { error: 'Failed to fetch sample submissions' },
      { status: 500, headers: corsHeaders }
    )
  }
}

async function handleSubmitSample(
  req: Request,
  patternName: string,
  corsHeaders: Record<string, string>
): Promise<Response> {
  try {
    const body = await req.json()
    const {
      sampleText,
      problematicValue,
      reportType,
      expectedBehavior,
      context,
    } = body

    // Validate required fields
    if (!sampleText || !problematicValue || !reportType || !expectedBehavior) {
      return Response.json(
        {
          error:
            'Missing required fields: sampleText, problematicValue, reportType, expectedBehavior',
        },
        { status: 400, headers: corsHeaders }
      )
    }

    // Validate report type
    const validTypes = ['false-positive', 'false-negative']
    if (!validTypes.includes(reportType)) {
      return Response.json(
        {
          error: `Invalid reportType. Must be one of: ${validTypes.join(', ')}`,
        },
        { status: 400, headers: corsHeaders }
      )
    }

    // Validate sample text size (500 lines max)
    const lineCount = sampleText.split('\n').length
    if (lineCount > 500) {
      return Response.json(
        { error: 'Sample text too large (500 line maximum)' },
        { status: 400, headers: corsHeaders }
      )
    }

    const submission: SampleSubmission = {
      pattern_name: patternName,
      sample_text: sampleText,
      problematic_value: problematicValue,
      report_type: reportType,
      expected_behavior: expectedBehavior,
      context: context || undefined,
    }

    const result = await saveSampleSubmission(submission)

    return Response.json(
      {
        success: true,
        id: result.id,
        createdAt: result.created_at,
      },
      { status: 201, headers: corsHeaders }
    )
  } catch (error) {
    console.error('[Sample Submissions] Submit error:', error)
    return Response.json(
      { error: 'Failed to submit sample' },
      { status: 500, headers: corsHeaders }
    )
  }
}
