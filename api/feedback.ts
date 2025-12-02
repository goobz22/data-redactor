import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getDb, normalizeId, type FeedbackEntry } from './lib/db.js'
import { ObjectId } from 'mongodb'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }

  try {
    const db = await getDb()
    const collection = db.collection('feedback')

    // GET - List feedback
    if (req.method === 'GET') {
      const limit = parseInt((req.query.limit as string) || '100')
      const offset = parseInt((req.query.offset as string) || '0')
      const category = req.query.category as string

      const filter: Record<string, string> = {}
      if (category) filter.category = category

      const docs = await collection
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .toArray()

      const count = await collection.countDocuments(filter)

      const feedback = docs.map(doc =>
        normalizeId(doc as FeedbackEntry & { _id: ObjectId })
      )

      return res.status(200).json({ feedback, count, limit, offset })
    }

    // POST - Submit feedback
    if (req.method === 'POST') {
      const {
        original,
        missed,
        type,
        regex,
        sampleData,
        patternName,
        category,
      } = req.body

      if (!original || !missed) {
        return res
          .status(400)
          .json({ error: 'Missing required fields: original, missed' })
      }

      const now = new Date()
      const doc = {
        createdAt: now,
        original,
        missed,
        suggestedType: type || null,
        regex: regex || null,
        sampleData: sampleData || null,
        patternName: patternName || null,
        category: category || null,
      }

      const result = await collection.insertOne(doc)

      return res.status(201).json({
        success: true,
        id: result.insertedId.toString(),
        createdAt: now.toISOString(),
      })
    }

    // DELETE - Remove feedback
    if (req.method === 'DELETE') {
      const id = req.query.id as string
      if (!id) {
        return res.status(400).json({ error: 'Missing required parameter: id' })
      }

      const result = await collection.deleteOne({ _id: new ObjectId(id) })
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Feedback not found' })
      }

      return res.status(200).json({ success: true, deleted: id })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('[Feedback API] Error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
