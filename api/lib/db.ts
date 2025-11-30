/**
 * MongoDB Database Client for Vercel Serverless Functions
 * Shared connection logic for all API routes
 */

import { MongoClient, ObjectId, type Db } from 'mongodb'

// Types
export interface CommunityPattern {
  _id?: ObjectId
  id?: string
  created_at?: string
  updated_at?: string
  name: string
  regex: string
  description?: string
  category: string
  samples?: string[]
  segments?: unknown[]
  status?: 'pending' | 'approved' | 'rejected'
  usage_count?: number
  upvotes?: number
  downvotes?: number
}

export interface FeedbackEntry {
  _id?: ObjectId
  id?: string
  createdAt?: Date
  original: string
  missed: string
  suggestedType?: string
  regex?: string
  sampleData?: string
  patternName?: string
  category?: string
}

// MongoDB connection (cached for serverless)
let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

export async function getDb(): Promise<Db> {
  if (cachedDb) return cachedDb

  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is not set')
  }

  if (!cachedClient) {
    cachedClient = new MongoClient(uri)
    await cachedClient.connect()
  }

  cachedDb = cachedClient.db()
  return cachedDb
}

// Helper to normalize MongoDB _id to string id
export function normalizeId<T extends { _id?: ObjectId }>(
  doc: T
): Omit<T, '_id'> & { id: string } {
  const { _id, ...rest } = doc
  return { ...rest, id: _id?.toString() || '' } as Omit<T, '_id'> & { id: string }
}
