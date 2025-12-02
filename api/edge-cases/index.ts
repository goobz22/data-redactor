import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getDb, normalizeId, type EdgeCaseReport } from '../lib/db.js'
import { ObjectId } from 'mongodb'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const db = await getDb()
    const collection = db.collection('edge_cases')

    const { status, sort, pattern, limit, offset } = req.query

    const filter: Record<string, unknown> = {}
    if (status && typeof status === 'string') {
      filter.status = status
    }
    if (pattern && typeof pattern === 'string') {
      filter.pattern_name = pattern
    }

    const sortField = sort === 'date' ? 'created_at' : 'votes'
    const sortOrder = -1 // descending

    const limitNum = Math.min(parseInt(String(limit) || '20', 10), 100)
    const offsetNum = parseInt(String(offset) || '0', 10)

    const total = await collection.countDocuments(filter)
    const docs = await collection
      .find(filter)
      .sort({ [sortField]: sortOrder })
      .skip(offsetNum)
      .limit(limitNum)
      .toArray()

    const edgeCases = docs.map(doc =>
      normalizeId(doc as EdgeCaseReport & { _id: ObjectId })
    )

    return res.status(200).json({
      count: edgeCases.length,
      total,
      offset: offsetNum,
      limit: limitNum,
      edge_cases: edgeCases,
    })
  } catch (error) {
    console.error('[Edge Cases API] Error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
