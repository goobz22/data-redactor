import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getDb } from '../../lib/db.js'
import { ObjectId } from 'mongodb'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { id } = req.query
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Missing pattern ID' })
  }

  try {
    const { vote } = req.body
    if (vote !== 'up' && vote !== 'down') {
      return res
        .status(400)
        .json({ error: 'Invalid vote. Must be "up" or "down"' })
    }

    const db = await getDb()
    const collection = db.collection('community_patterns')

    const update =
      vote === 'up'
        ? {
            $inc: { upvotes: 1 },
            $set: { updated_at: new Date().toISOString() },
          }
        : {
            $inc: { downvotes: 1 },
            $set: { updated_at: new Date().toISOString() },
          }

    const result = await collection.updateOne({ _id: new ObjectId(id) }, update)

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Pattern not found' })
    }

    return res.status(200).json({ success: true, vote })
  } catch (error) {
    console.error('[Vote API] Error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
