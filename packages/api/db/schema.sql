-- Data Redactor Database Schema
-- Run this migration to set up the tables

-- =============================================================================
-- FEEDBACK TABLE - For reporting missed redactions
-- =============================================================================
CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- The original text snippet containing the missed data
  original TEXT NOT NULL,

  -- The specific value that was missed
  missed TEXT NOT NULL,

  -- User-suggested type for the missed data (e.g., 'email', 'phone', 'custom')
  suggested_type VARCHAR(100),

  -- If user provided a regex pattern
  regex TEXT,

  -- Sample data used to create the pattern (for regex builder)
  sample_data TEXT,

  -- User-suggested name for the pattern
  pattern_name VARCHAR(200),

  -- Category: 'pii', 'system', 'financial', 'custom'
  category VARCHAR(50)
);

-- Indexes for feedback table
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_category ON feedback(category);
CREATE INDEX IF NOT EXISTS idx_feedback_suggested_type ON feedback(suggested_type);

-- Comments for feedback table
COMMENT ON TABLE feedback IS 'Community feedback for missed redactions';
COMMENT ON COLUMN feedback.original IS 'Original text snippet containing the missed sensitive data';
COMMENT ON COLUMN feedback.missed IS 'The specific value that should have been redacted';
COMMENT ON COLUMN feedback.suggested_type IS 'User-suggested pattern type (email, phone, uuid, etc.)';
COMMENT ON COLUMN feedback.regex IS 'Custom regex pattern if provided by user';
COMMENT ON COLUMN feedback.sample_data IS 'Sample data used to generate the regex (from pattern builder)';
COMMENT ON COLUMN feedback.pattern_name IS 'User-suggested name for new patterns';
COMMENT ON COLUMN feedback.category IS 'Pattern category: pii, system, financial, custom';

-- =============================================================================
-- COMMUNITY PATTERNS TABLE - User-submitted patterns from Pattern Builder
-- =============================================================================
CREATE TABLE IF NOT EXISTS community_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Pattern name (required)
  name VARCHAR(200) NOT NULL,

  -- Regex pattern (required)
  regex TEXT NOT NULL,

  -- Description of what the pattern matches
  description TEXT,

  -- Category: identifier, financial, healthcare, infrastructure, personal, custom
  category VARCHAR(50) NOT NULL DEFAULT 'custom',

  -- Sample values used to create/test the pattern
  samples JSONB DEFAULT '[]'::jsonb,

  -- Pattern segments from the builder (for explanation)
  segments JSONB DEFAULT '[]'::jsonb,

  -- Status: pending, approved, rejected
  status VARCHAR(20) DEFAULT 'pending',

  -- Number of times this pattern has been used/downloaded
  usage_count INTEGER DEFAULT 0,

  -- Upvotes/downvotes for community rating
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0
);

-- Indexes for community_patterns table
CREATE INDEX IF NOT EXISTS idx_patterns_created_at ON community_patterns(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_patterns_category ON community_patterns(category);
CREATE INDEX IF NOT EXISTS idx_patterns_status ON community_patterns(status);
CREATE INDEX IF NOT EXISTS idx_patterns_name ON community_patterns(name);

-- Comments for community_patterns table
COMMENT ON TABLE community_patterns IS 'User-submitted patterns from the Pattern Builder';
COMMENT ON COLUMN community_patterns.name IS 'Pattern name/identifier';
COMMENT ON COLUMN community_patterns.regex IS 'The regex pattern';
COMMENT ON COLUMN community_patterns.description IS 'Human-readable description of what the pattern matches';
COMMENT ON COLUMN community_patterns.category IS 'Pattern category: identifier, financial, healthcare, infrastructure, personal, custom';
COMMENT ON COLUMN community_patterns.samples IS 'JSON array of sample values used to create the pattern';
COMMENT ON COLUMN community_patterns.segments IS 'JSON array of pattern segments from the builder';
COMMENT ON COLUMN community_patterns.status IS 'Review status: pending, approved, rejected';
COMMENT ON COLUMN community_patterns.usage_count IS 'Number of times this pattern has been used';
COMMENT ON COLUMN community_patterns.upvotes IS 'Community upvotes';
COMMENT ON COLUMN community_patterns.downvotes IS 'Community downvotes';

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at on community_patterns
DROP TRIGGER IF EXISTS update_community_patterns_updated_at ON community_patterns;
CREATE TRIGGER update_community_patterns_updated_at
    BEFORE UPDATE ON community_patterns
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
