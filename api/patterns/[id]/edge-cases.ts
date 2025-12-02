import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getDb, normalizeId, type EdgeCaseReport } from '../../lib/db.js'
import { ObjectId } from 'mongodb'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }

  const { id } = req.query
  const patternName = typeof id === 'string' ? id : ''

  if (!patternName) {
    return res.status(400).json({ error: 'Missing pattern name' })
  }

  try {
    const db = await getDb()
    const collection = db.collection('edge_cases')

    // GET - List edge cases for a pattern
    if (req.method === 'GET') {
      const { status, sort } = req.query

      const filter: Record<string, unknown> = { pattern_name: patternName }
      if (status && typeof status === 'string') {
        filter.status = status
      }

      const sortField = sort === 'date' ? 'created_at' : 'votes'
      const sortOrder = -1 // descending

      const docs = await collection
        .find(filter)
        .sort({ [sortField]: sortOrder })
        .toArray()

      const edgeCases = docs.map(doc =>
        normalizeId(doc as EdgeCaseReport & { _id: ObjectId })
      )

      return res.status(200).json({
        pattern: patternName,
        count: edgeCases.length,
        edge_cases: edgeCases,
      })
    }

    // POST - Create new edge case
    if (req.method === 'POST') {
      const body = req.body

      // Validate required fields
      const requiredFields = [
        'report_type',
        'full_sample_text',
        'problematic_value',
        'expected_behavior',
      ]
      for (const field of requiredFields) {
        if (!body[field]) {
          return res
            .status(400)
            .json({ error: `Missing required field: ${field}` })
        }
      }

      const edgeCase: Omit<EdgeCaseReport, '_id' | 'id'> = {
        pattern_name: patternName,
        report_type: body.report_type,
        full_sample_text: body.full_sample_text,
        problematic_value: body.problematic_value,
        expected_behavior: body.expected_behavior,
        context: body.context || '',
        submitted_by: body.submitted_by || 'anonymous',
        votes: body.votes ?? 0,
        status: body.status || 'open',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      const result = await collection.insertOne(edgeCase)

      return res.status(201).json({
        success: true,
        id: result.insertedId.toString(),
        edge_case: { ...edgeCase, id: result.insertedId.toString() },
      })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('[Edge Cases API] Error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
