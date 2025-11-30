import {
  saveFeedback,
  getAllFeedback,
  getFeedbackCount,
  getFeedbackByCategory,
  deleteFeedback,
  type FeedbackEntry,
} from '../db/client'

/**
 * Handle feedback API requests
 * GET  /api/feedback - List all feedback with pagination
 * POST /api/feedback - Submit new feedback
 * DELETE /api/feedback?id=xxx - Delete feedback by ID (admin)
 */
export async function handleFeedback(
  req: Request,
  corsHeaders: Record<string, string>
): Promise<Response> {
  const url = new URL(req.url)

  try {
    // GET - List feedback
    if (req.method === 'GET') {
      const limit = parseInt(url.searchParams.get('limit') || '100')
      const offset = parseInt(url.searchParams.get('offset') || '0')
      const category = url.searchParams.get('category')

      let entries: FeedbackEntry[]
      if (category) {
        entries = await getFeedbackByCategory(category, limit)
      } else {
        entries = await getAllFeedback(limit, offset)
      }

      const count = await getFeedbackCount()

      return Response.json(
        {
          feedback: entries,
          count,
          limit,
          offset,
        },
        { headers: corsHeaders }
      )
    }

    // POST - Submit feedback
    if (req.method === 'POST') {
      const body = await req.json()
      const {
        original,
        missed,
        type,
        regex,
        sampleData,
        patternName,
        category,
      } = body

      // Validate required fields
      if (!original || !missed) {
        return Response.json(
          { error: 'Missing required fields: original, missed' },
          { status: 400, headers: corsHeaders }
        )
      }

      // Validate category if provided
      const validCategories = ['pii', 'system', 'financial', 'custom']
      if (category && !validCategories.includes(category)) {
        return Response.json(
          {
            error: `Invalid category. Must be one of: ${validCategories.join(', ')}`,
          },
          { status: 400, headers: corsHeaders }
        )
      }

      const entry: FeedbackEntry = {
        original,
        missed,
        suggestedType: type,
        regex,
        sampleData,
        patternName,
        category,
      }

      const result = await saveFeedback(entry)

      return Response.json(
        {
          success: true,
          id: result.id,
          createdAt: result.created_at,
        },
        { status: 201, headers: corsHeaders }
      )
    }

    // DELETE - Remove feedback (admin)
    if (req.method === 'DELETE') {
      const id = url.searchParams.get('id')

      if (!id) {
        return Response.json(
          { error: 'Missing required parameter: id' },
          { status: 400, headers: corsHeaders }
        )
      }

      const deleted = await deleteFeedback(id)

      if (!deleted) {
        return Response.json(
          { error: 'Feedback not found' },
          { status: 404, headers: corsHeaders }
        )
      }

      return Response.json(
        { success: true, deleted: id },
        { headers: corsHeaders }
      )
    }

    // Method not allowed
    return Response.json(
      { error: 'Method not allowed' },
      { status: 405, headers: corsHeaders }
    )
  } catch (error) {
    console.error('[Feedback] Error:', error)

    // Check if it's a database connection error
    if (error instanceof Error && error.message.includes('connect')) {
      return Response.json(
        {
          error: 'Database unavailable. Please ensure PostgreSQL is running.',
          details:
            process.env.NODE_ENV === 'development' ? error.message : undefined,
        },
        { status: 503, headers: corsHeaders }
      )
    }

    return Response.json(
      { error: 'Failed to process feedback request' },
      { status: 500, headers: corsHeaders }
    )
  }
}
