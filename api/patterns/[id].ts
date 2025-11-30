import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getDb, normalizeId, type CommunityPattern } from '../lib/db'
import { ObjectId } from 'mongodb'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, PATCH, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }

  const { id } = req.query

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Missing pattern ID' })
  }

  try {
    const db = await getDb()
    const collection = db.collection('community_patterns')

    // GET - Get single pattern
    if (req.method === 'GET') {
      const doc = await collection.findOne({ _id: new ObjectId(id) })
      if (!doc) {
        return res.status(404).json({ error: 'Pattern not found' })
      }
      return res.status(200).json({
        pattern: normalizeId(doc as CommunityPattern & { _id: ObjectId }),
      })
    }

    // PATCH - Update pattern status
    if (req.method === 'PATCH') {
      const { status } = req.body
      const validStatuses = ['pending', 'approved', 'rejected']
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
        })
      }

      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { status, updated_at: new Date().toISOString() } }
      )

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'Pattern not found' })
      }

      return res.status(200).json({ success: true, status })
    }

    // DELETE - Delete pattern
    if (req.method === 'DELETE') {
      const result = await collection.deleteOne({ _id: new ObjectId(id) })
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Pattern not found' })
      }
      return res.status(200).json({ success: true, deleted: id })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('[Pattern API] Error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
