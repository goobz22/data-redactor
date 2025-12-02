export type RedactionStrategy = 'token' | 'mask' | 'formatPreserving'

export interface PatternConfig {
  enabled: boolean
  strategy: RedactionStrategy
  regex?: string // Optional custom regex pattern (if not provided, uses built-in default)
  flags?: string // Optional regex flags (e.g., 'i' for case-insensitive)

  // Testing & Quality Metadata
  testSampleIds?: string[] // References to test samples in test-samples directory
  qualityScore?: number // 0-100 calculated from test results
  knownIssues?: number // Count of open edge case reports
  lastTested?: string // ISO timestamp of last test run
}

export interface CustomPattern {
  name: string
  regex: string
  strategy: RedactionStrategy
  flags?: string
}

export interface FormatOptions {
  tokenFormat?: string // Format template for tokens, e.g., "[{TYPE}_{INDEX}]" or "{{{TYPE}-{INDEX}}}"
  maskChar?: string // Character to use for masking, default "*"
  preserveStructure?: boolean // For mask strategy, preserve dots/dashes/etc, default true
}

export interface ScenarioConfig {
  enabled: boolean
  strategy: RedactionStrategy
}

export interface RedactorConfig {
  formatOptions?: FormatOptions
  customEntities?: {
    companyNames?: string[]
    customerNames?: string[]
    [key: string]: string[] | undefined
  }
  patterns?: {
    ipv4?: PatternConfig
    ipv6?: PatternConfig
    macAddress?: PatternConfig
    email?: PatternConfig
    phone?: PatternConfig
    ssn?: PatternConfig
    creditCard?: PatternConfig
    creditCardLast4?: PatternConfig
    hostname?: PatternConfig
    ticketNumber?: PatternConfig
    name?: PatternConfig
    uuid?: PatternConfig
    filePath?: PatternConfig
    custom?: CustomPattern[]
  }
  scenarios?: {
    authHeader?: ScenarioConfig
    password?: ScenarioConfig
    apiKey?: ScenarioConfig
    connectionString?: ScenarioConfig
    privateKey?: ScenarioConfig
    awsCredentials?: ScenarioConfig
  }
  testData?: string // Optional test data for UI testing
}

export interface Match {
  value: string
  start: number
  end: number
  type: string
  strategy: RedactionStrategy
}

export interface RedactionResult {
  redactedText: string
  mapping: Record<string, string>
  matches: Match[]
}

export interface Pattern {
  name: string
  regex: RegExp
  strategy: RedactionStrategy
  enabled: boolean
  test: (text: string) => boolean
  findAll: (text: string) => Match[]
}

// ============================================================
// Testing & Validation Types
// ============================================================

export interface ExpectedMatch {
  value: string // Text that should match
  shouldMatch: boolean // true = should find, false = false positive
  startIndex: number // Position in content
  endIndex: number
  reason?: string // Explanation (e.g., "Valid IPv4 address")
}

export interface TestSample {
  id: string // e.g., "ipv4-apache-log"
  name: string // e.g., "Apache Access Log"
  content: string // Full log/config text (5-20 lines)
  expectedMatches: ExpectedMatch[] // What should be found
  category: 'logs' | 'config' | 'network' | 'support-ticket' | 'code'
}

export interface PatternTestResult {
  patternName: string
  sampleId: string
  passed: boolean
  expectedCount: number
  actualCount: number
  falsePositives: string[] // Matched but shouldn't
  falseNegatives: string[] // Missed but should match
  accuracy: number // 0-100
}

export interface EdgeCaseReport {
  id: string
  patternName: string
  reportType: 'false-positive' | 'false-negative' | 'performance'
  fullSampleText: string // Full context (max 500 lines)
  problematicValue: string // The specific issue
  expectedBehavior: string // "Should match" or "Should NOT match"
  context?: string // User description
  submittedBy?: string
  timestamp: number
  votes: number
  status: 'open' | 'fixed' | 'wont-fix'
}
