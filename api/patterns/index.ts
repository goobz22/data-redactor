import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getDb, normalizeId, type CommunityPattern } from '../lib/db.js'
import { ObjectId } from 'mongodb'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }

  try {
    const db = await getDb()
    const collection = db.collection('community_patterns')

    // GET - List patterns
    if (req.method === 'GET') {
      const limit = parseInt((req.query.limit as string) || '100')
      const offset = parseInt((req.query.offset as string) || '0')
      const category = req.query.category as string
      const status = req.query.status as string

      const filter: Record<string, string> = {}
      if (category) filter.category = category
      if (status) filter.status = status

      const patterns = await collection
        .find(filter)
        .sort({ created_at: -1 })
        .skip(offset)
        .limit(limit)
        .toArray()

      const count = await collection.countDocuments(filter)

      const normalizedPatterns = patterns.map(doc =>
        normalizeId(doc as CommunityPattern & { _id: ObjectId })
      )

      return res.status(200).json({
        patterns: normalizedPatterns,
        count,
        limit,
        offset,
      })
    }

    // POST - Submit new pattern
    if (req.method === 'POST') {
      const { name, regex, description, category, samples, segments } = req.body

      if (!name || !regex) {
        return res
          .status(400)
          .json({ error: 'Missing required fields: name, regex' })
      }

      // Validate regex
      try {
        new RegExp(regex)
      } catch {
        return res.status(400).json({ error: 'Invalid regex pattern' })
      }

      const now = new Date().toISOString()
      const doc = {
        created_at: now,
        updated_at: now,
        name,
        regex,
        description: description || null,
        category: category || 'custom',
        samples: samples || [],
        segments: segments || [],
        status: 'pending',
        usage_count: 0,
        upvotes: 0,
        downvotes: 0,
      }

      const result = await collection.insertOne(doc)

      return res.status(201).json({
        success: true,
        id: result.insertedId.toString(),
        createdAt: now,
      })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('[Patterns API] Error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return res
      .status(500)
      .json({ error: 'Internal server error', details: message })
  }
}
