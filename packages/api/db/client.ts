/**
 * MongoDB Database Client
 *
 * Uses MongoDB Atlas for both local development and Vercel deployment
 * Connection string is read from MONGODB_URI environment variable
 */

import { MongoClient, ObjectId, type Db } from 'mongodb'

// =============================================================================
// TYPES
// =============================================================================
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

export interface FeedbackResult {
  id: string
  created_at: string
}

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
  approved_version?: string
}

export interface PatternResult {
  id: string
  created_at: string
}

// =============================================================================
// DATABASE CONNECTION
// =============================================================================

const MONGODB_URI = Bun.env.MONGODB_URI

if (!MONGODB_URI) {
  console.warn(
    '[DB] MONGODB_URI environment variable not set. Database features will not work.'
  )
}

let client: MongoClient | null = null
let db: Db | null = null

async function getDb(): Promise<Db> {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is not set')
  }

  // If we already have a connected db, return it
  if (db) {
    return db
  }

  // Create new connection
  if (!client) {
    client = new MongoClient(MONGODB_URI)
    await client.connect()
    console.log('[DB] MongoDB connected successfully')
  }

  // Get database instance
  db = client.db()

  // Create indexes for better query performance
  await createIndexes()

  return db
}

async function createIndexes(): Promise<void> {
  if (!db) return

  try {
    // Feedback collection indexes
    const feedbackCollection = db.collection('feedback')
    await feedbackCollection.createIndex({ createdAt: -1 })
    await feedbackCollection.createIndex({ category: 1 })

    // Patterns collection indexes
    const patternsCollection = db.collection('community_patterns')
    await patternsCollection.createIndex({ created_at: -1 })
    await patternsCollection.createIndex({ category: 1 })
    await patternsCollection.createIndex({ status: 1 })
    await patternsCollection.createIndex({ upvotes: -1, created_at: -1 })

    console.log('[DB] Indexes created successfully')
  } catch (error) {
    console.error('[DB] Error creating indexes:', error)
  }
}

// Helper to convert MongoDB _id to string id
function normalizeId<T extends { _id?: ObjectId }>(
  doc: T
): Omit<T, '_id'> & { id: string } {
  const { _id, ...rest } = doc
  return { ...rest, id: _id?.toString() || '' } as Omit<T, '_id'> & {
    id: string
  }
}

// =============================================================================
// FEEDBACK FUNCTIONS
// =============================================================================

export async function saveFeedback(
  entry: FeedbackEntry
): Promise<FeedbackResult> {
  const database = await getDb()
  const collection = database.collection('feedback')
  const now = new Date()

  const doc = {
    createdAt: now,
    original: entry.original,
    missed: entry.missed,
    suggestedType: entry.suggestedType || null,
    regex: entry.regex || null,
    sampleData: entry.sampleData || null,
    patternName: entry.patternName || null,
    category: entry.category || null,
  }

  const result = await collection.insertOne(doc)

  return {
    id: result.insertedId.toString(),
    created_at: now.toISOString(),
  }
}

export async function getAllFeedback(
  limit: number = 100,
  offset: number = 0
): Promise<FeedbackEntry[]> {
  const database = await getDb()
  const collection = database.collection('feedback')

  const docs = await collection
    .find({})
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit)
    .toArray()

  return docs.map(doc => normalizeId(doc as FeedbackEntry & { _id: ObjectId }))
}

export async function getFeedbackCount(): Promise<number> {
  const database = await getDb()
  const collection = database.collection('feedback')
  return await collection.countDocuments()
}

export async function getFeedbackByCategory(
  category: string,
  limit: number = 100
): Promise<FeedbackEntry[]> {
  const database = await getDb()
  const collection = database.collection('feedback')

  const docs = await collection
    .find({ category })
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray()

  return docs.map(doc => normalizeId(doc as FeedbackEntry & { _id: ObjectId }))
}

export async function deleteFeedback(id: string): Promise<boolean> {
  const database = await getDb()
  const collection = database.collection('feedback')

  try {
    const result = await collection.deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount > 0
  } catch {
    return false
  }
}

// =============================================================================
// COMMUNITY PATTERN FUNCTIONS
// =============================================================================

export async function savePattern(
  pattern: CommunityPattern
): Promise<PatternResult> {
  const database = await getDb()
  const collection = database.collection('community_patterns')
  const now = new Date().toISOString()

  const doc = {
    created_at: now,
    updated_at: now,
    name: pattern.name,
    regex: pattern.regex,
    description: pattern.description || null,
    category: pattern.category || 'custom',
    samples: pattern.samples || [],
    segments: pattern.segments || [],
    status: pattern.status || 'pending',
    usage_count: 0,
    upvotes: 0,
    downvotes: 0,
    approved_version: null,
  }

  const result = await collection.insertOne(doc)

  return {
    id: result.insertedId.toString(),
    created_at: now,
  }
}

export async function getAllPatterns(
  limit: number = 100,
  offset: number = 0,
  status?: string
): Promise<CommunityPattern[]> {
  const database = await getDb()
  const collection = database.collection('community_patterns')

  const filter = status ? { status } : {}

  const docs = await collection
    .find(filter)
    .sort({ created_at: -1 })
    .skip(offset)
    .limit(limit)
    .toArray()

  return docs.map(doc =>
    normalizeId(doc as CommunityPattern & { _id: ObjectId })
  )
}

export async function getPatternsByCategory(
  category: string,
  limit: number = 100
): Promise<CommunityPattern[]> {
  const database = await getDb()
  const collection = database.collection('community_patterns')

  const docs = await collection
    .find({ category })
    .sort({ upvotes: -1, created_at: -1 })
    .limit(limit)
    .toArray()

  return docs.map(doc =>
    normalizeId(doc as CommunityPattern & { _id: ObjectId })
  )
}

export async function getPatternCount(status?: string): Promise<number> {
  const database = await getDb()
  const collection = database.collection('community_patterns')

  const filter = status ? { status } : {}
  return await collection.countDocuments(filter)
}

export async function getPatternById(
  id: string
): Promise<CommunityPattern | null> {
  const database = await getDb()
  const collection = database.collection('community_patterns')

  try {
    const doc = await collection.findOne({ _id: new ObjectId(id) })
    if (!doc) return null
    return normalizeId(doc as CommunityPattern & { _id: ObjectId })
  } catch {
    return null
  }
}

export async function updatePatternStatus(
  id: string,
  status: 'pending' | 'approved' | 'rejected'
): Promise<boolean> {
  const database = await getDb()
  const collection = database.collection('community_patterns')

  try {
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status,
          updated_at: new Date().toISOString(),
        },
      }
    )
    return result.modifiedCount > 0
  } catch {
    return false
  }
}

export async function upvotePattern(id: string): Promise<boolean> {
  const database = await getDb()
  const collection = database.collection('community_patterns')

  try {
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $inc: { upvotes: 1 },
        $set: { updated_at: new Date().toISOString() },
      }
    )
    return result.modifiedCount > 0
  } catch {
    return false
  }
}

export async function downvotePattern(id: string): Promise<boolean> {
  const database = await getDb()
  const collection = database.collection('community_patterns')

  try {
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $inc: { downvotes: 1 },
        $set: { updated_at: new Date().toISOString() },
      }
    )
    return result.modifiedCount > 0
  } catch {
    return false
  }
}

export async function incrementPatternUsage(id: string): Promise<boolean> {
  const database = await getDb()
  const collection = database.collection('community_patterns')

  try {
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $inc: { usage_count: 1 },
        $set: { updated_at: new Date().toISOString() },
      }
    )
    return result.modifiedCount > 0
  } catch {
    return false
  }
}

export async function deletePattern(id: string): Promise<boolean> {
  const database = await getDb()
  const collection = database.collection('community_patterns')

  try {
    const result = await collection.deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount > 0
  } catch {
    return false
  }
}
