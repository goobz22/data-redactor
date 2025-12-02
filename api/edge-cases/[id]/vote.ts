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
    return res.status(400).json({ error: 'Missing edge case ID' })
  }

  try {
    const db = await getDb()
    const collection = db.collection('edge_cases')

    const { direction } = req.body
    if (!direction || !['up', 'down'].includes(direction)) {
      return res
        .status(400)
        .json({ error: 'Invalid vote direction. Must be "up" or "down"' })
    }

    const increment = direction === 'up' ? 1 : -1

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $inc: { votes: increment },
        $set: { updated_at: new Date().toISOString() },
      },
      { returnDocument: 'after' }
    )

    if (!result) {
      return res.status(404).json({ error: 'Edge case not found' })
    }

    return res.status(200).json({
      success: true,
      votes: result.votes,
    })
  } catch (error) {
    console.error('[Edge Cases Vote API] Error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
