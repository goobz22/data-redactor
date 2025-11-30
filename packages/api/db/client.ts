/**
 * SQLite Database Client using Bun's built-in SQLite
 *
 * No external database required - works out of the box
 */

import { Database } from 'bun:sqlite'

// Database file path - stored in the api/db folder
const DB_PATH = import.meta.dir + '/data.db'

// =============================================================================
// TYPES
// =============================================================================
export interface FeedbackEntry {
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
// DATABASE INITIALIZATION
// =============================================================================

let db: Database | null = null

function getDb(): Database {
  if (!db) {
    db = new Database(DB_PATH)
    db.exec('PRAGMA journal_mode = WAL')
    initializeTables()
    console.log(`[DB] SQLite database initialized at ${DB_PATH}`)
  }
  return db
}

function initializeTables() {
  const database = db!

  // Create feedback table
  database.exec(`
    CREATE TABLE IF NOT EXISTS feedback (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      created_at TEXT DEFAULT (datetime('now')),
      original TEXT NOT NULL,
      missed TEXT NOT NULL,
      suggested_type TEXT,
      regex TEXT,
      sample_data TEXT,
      pattern_name TEXT,
      category TEXT
    )
  `)

  // Create community_patterns table
  database.exec(`
    CREATE TABLE IF NOT EXISTS community_patterns (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      name TEXT NOT NULL,
      regex TEXT NOT NULL,
      description TEXT,
      category TEXT NOT NULL DEFAULT 'custom',
      samples TEXT DEFAULT '[]',
      segments TEXT DEFAULT '[]',
      status TEXT DEFAULT 'pending',
      usage_count INTEGER DEFAULT 0,
      upvotes INTEGER DEFAULT 0,
      downvotes INTEGER DEFAULT 0,
      approved_version TEXT
    )
  `)

  // Add approved_version column if it doesn't exist (migration for existing DBs)
  try {
    database.exec(
      `ALTER TABLE community_patterns ADD COLUMN approved_version TEXT`
    )
  } catch {
    // Column already exists, ignore
  }

  // Create indexes
  database.exec(`
    CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_feedback_category ON feedback(category);
    CREATE INDEX IF NOT EXISTS idx_patterns_created_at ON community_patterns(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_patterns_category ON community_patterns(category);
    CREATE INDEX IF NOT EXISTS idx_patterns_status ON community_patterns(status);
  `)
}

// =============================================================================
// FEEDBACK FUNCTIONS
// =============================================================================

export async function saveFeedback(
  entry: FeedbackEntry
): Promise<FeedbackResult> {
  const database = getDb()
  const id = crypto.randomUUID()
  const now = new Date().toISOString()

  database.run(
    `INSERT INTO feedback (id, created_at, original, missed, suggested_type, regex, sample_data, pattern_name, category)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      now,
      entry.original,
      entry.missed,
      entry.suggestedType || null,
      entry.regex || null,
      entry.sampleData || null,
      entry.patternName || null,
      entry.category || null,
    ]
  )

  return { id, created_at: now }
}

export async function getAllFeedback(
  limit: number = 100,
  offset: number = 0
): Promise<FeedbackEntry[]> {
  const database = getDb()
  const stmt = database.prepare(
    `SELECT id, created_at as createdAt, original, missed, suggested_type as suggestedType,
            regex, sample_data as sampleData, pattern_name as patternName, category
     FROM feedback ORDER BY created_at DESC LIMIT ? OFFSET ?`
  )
  return stmt.all(limit, offset) as FeedbackEntry[]
}

export async function getFeedbackCount(): Promise<number> {
  const database = getDb()
  const result = database
    .query('SELECT COUNT(*) as count FROM feedback')
    .get() as { count: number }
  return result?.count || 0
}

export async function getFeedbackByCategory(
  category: string,
  limit: number = 100
): Promise<FeedbackEntry[]> {
  const database = getDb()
  const stmt = database.prepare(
    `SELECT id, created_at as createdAt, original, missed, suggested_type as suggestedType,
            regex, sample_data as sampleData, pattern_name as patternName, category
     FROM feedback WHERE category = ? ORDER BY created_at DESC LIMIT ?`
  )
  return stmt.all(category, limit) as FeedbackEntry[]
}

export async function deleteFeedback(id: string): Promise<boolean> {
  const database = getDb()
  const result = database.run('DELETE FROM feedback WHERE id = ?', [id])
  return result.changes > 0
}

// =============================================================================
// COMMUNITY PATTERN FUNCTIONS
// =============================================================================

export async function savePattern(
  pattern: CommunityPattern
): Promise<PatternResult> {
  const database = getDb()
  const id = crypto.randomUUID()
  const now = new Date().toISOString()

  database.run(
    `INSERT INTO community_patterns (id, created_at, updated_at, name, regex, description, category, samples, segments, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      now,
      now,
      pattern.name,
      pattern.regex,
      pattern.description || null,
      pattern.category || 'custom',
      JSON.stringify(pattern.samples || []),
      JSON.stringify(pattern.segments || []),
      pattern.status || 'pending',
    ]
  )

  return { id, created_at: now }
}

export async function getAllPatterns(
  limit: number = 100,
  offset: number = 0,
  status?: string
): Promise<CommunityPattern[]> {
  const database = getDb()

  let query = `SELECT id, created_at, updated_at, name, regex, description, category,
                      samples, segments, status, usage_count, upvotes, downvotes, approved_version
               FROM community_patterns`

  const params: (string | number)[] = []

  if (status) {
    query += ' WHERE status = ?'
    params.push(status)
  }

  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?'
  params.push(limit, offset)

  const stmt = database.prepare(query)
  const rows = stmt.all(...params) as CommunityPattern[]

  // Parse JSON fields
  return rows.map(row => ({
    ...row,
    samples:
      typeof row.samples === 'string' ? JSON.parse(row.samples) : row.samples,
    segments:
      typeof row.segments === 'string'
        ? JSON.parse(row.segments)
        : row.segments,
  }))
}

export async function getPatternsByCategory(
  category: string,
  limit: number = 100
): Promise<CommunityPattern[]> {
  const database = getDb()
  const stmt = database.prepare(
    `SELECT id, created_at, updated_at, name, regex, description, category,
            samples, segments, status, usage_count, upvotes, downvotes
     FROM community_patterns WHERE category = ? ORDER BY upvotes DESC, created_at DESC LIMIT ?`
  )
  const rows = stmt.all(category, limit) as CommunityPattern[]

  return rows.map(row => ({
    ...row,
    samples:
      typeof row.samples === 'string' ? JSON.parse(row.samples) : row.samples,
    segments:
      typeof row.segments === 'string'
        ? JSON.parse(row.segments)
        : row.segments,
  }))
}

export async function getPatternCount(status?: string): Promise<number> {
  const database = getDb()

  if (status) {
    const result = database
      .query(
        'SELECT COUNT(*) as count FROM community_patterns WHERE status = ?'
      )
      .get(status) as { count: number }
    return result?.count || 0
  }

  const result = database
    .query('SELECT COUNT(*) as count FROM community_patterns')
    .get() as { count: number }
  return result?.count || 0
}

export async function getPatternById(
  id: string
): Promise<CommunityPattern | null> {
  const database = getDb()
  const stmt = database.prepare(
    `SELECT id, created_at, updated_at, name, regex, description, category,
            samples, segments, status, usage_count, upvotes, downvotes
     FROM community_patterns WHERE id = ?`
  )
  const row = stmt.get(id) as CommunityPattern | null

  if (!row) return null

  return {
    ...row,
    samples:
      typeof row.samples === 'string' ? JSON.parse(row.samples) : row.samples,
    segments:
      typeof row.segments === 'string'
        ? JSON.parse(row.segments)
        : row.segments,
  }
}

export async function updatePatternStatus(
  id: string,
  status: 'pending' | 'approved' | 'rejected'
): Promise<boolean> {
  const database = getDb()
  const now = new Date().toISOString()
  const result = database.run(
    'UPDATE community_patterns SET status = ?, updated_at = ? WHERE id = ?',
    [status, now, id]
  )
  return result.changes > 0
}

export async function upvotePattern(id: string): Promise<boolean> {
  const database = getDb()
  const now = new Date().toISOString()
  const result = database.run(
    'UPDATE community_patterns SET upvotes = upvotes + 1, updated_at = ? WHERE id = ?',
    [now, id]
  )
  return result.changes > 0
}

export async function downvotePattern(id: string): Promise<boolean> {
  const database = getDb()
  const now = new Date().toISOString()
  const result = database.run(
    'UPDATE community_patterns SET downvotes = downvotes + 1, updated_at = ? WHERE id = ?',
    [now, id]
  )
  return result.changes > 0
}

export async function incrementPatternUsage(id: string): Promise<boolean> {
  const database = getDb()
  const now = new Date().toISOString()
  const result = database.run(
    'UPDATE community_patterns SET usage_count = usage_count + 1, updated_at = ? WHERE id = ?',
    [now, id]
  )
  return result.changes > 0
}

export async function deletePattern(id: string): Promise<boolean> {
  const database = getDb()
  const result = database.run('DELETE FROM community_patterns WHERE id = ?', [
    id,
  ])
  return result.changes > 0
}
