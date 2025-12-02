type RedactionStrategy = 'token' | 'mask' | 'formatPreserving'
interface PatternConfig {
  enabled: boolean
  strategy: RedactionStrategy
  regex?: string
  flags?: string
  testSampleIds?: string[]
  qualityScore?: number
  knownIssues?: number
  lastTested?: string
}
interface CustomPattern {
  name: string
  regex: string
  strategy: RedactionStrategy
  flags?: string
}
interface FormatOptions {
  tokenFormat?: string
  maskChar?: string
  preserveStructure?: boolean
}
interface ScenarioConfig {
  enabled: boolean
  strategy: RedactionStrategy
}
interface RedactorConfig {
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
  testData?: string
}
interface Match {
  value: string
  start: number
  end: number
  type: string
  strategy: RedactionStrategy
}
interface RedactionResult {
  redactedText: string
  mapping: Record<string, string>
  matches: Match[]
}
interface Pattern {
  name: string
  regex: RegExp
  strategy: RedactionStrategy
  enabled: boolean
  test: (text: string) => boolean
  findAll: (text: string) => Match[]
}
interface ExpectedMatch {
  value: string
  shouldMatch: boolean
  startIndex: number
  endIndex: number
  reason?: string
}
interface TestSample {
  id: string
  name: string
  content: string
  expectedMatches: ExpectedMatch[]
  category: 'logs' | 'config' | 'network' | 'support-ticket' | 'code'
}
interface PatternTestResult {
  patternName: string
  sampleId: string
  passed: boolean
  expectedCount: number
  actualCount: number
  falsePositives: string[]
  falseNegatives: string[]
  accuracy: number
}
interface EdgeCaseReport {
  id: string
  patternName: string
  reportType: 'false-positive' | 'false-negative' | 'performance'
  fullSampleText: string
  problematicValue: string
  expectedBehavior: string
  context?: string
  submittedBy?: string
  timestamp: number
  votes: number
  status: 'open' | 'fixed' | 'wont-fix'
}

declare class DataRedactor {
  private config
  private patterns
  private scenarios
  private context
  private strategies
  constructor(config?: Partial<RedactorConfig> | string)
  private initializePatterns
  private initializeScenarios
  redact(text: string): RedactionResult
  private removeOverlaps
  reset(): void
  getConfig(): RedactorConfig
  updateConfig(config: Partial<RedactorConfig>): void
}

declare const DEFAULT_CONFIG: RedactorConfig
declare class ConfigLoader {
  static loadFromFile(path: string): RedactorConfig
  static loadFromObject(config: Partial<RedactorConfig>): RedactorConfig
  static getDefault(): RedactorConfig
  private static mergeWithDefaults
  static validateConfig(config: RedactorConfig): {
    valid: boolean
    errors: string[]
  }
}

/**
 * Pre-defined configuration presets for common use cases
 */
declare const PRESETS: {
  /**
   * Strict AI Compliance Preset
   * Maximum protection for data sent to AI/LLM systems
   * Enables all patterns and scenarios with token replacement
   */
  readonly 'strict-ai': {
    readonly formatOptions: {
      readonly tokenFormat: '[REDACTED_{TYPE}_{INDEX}]'
      readonly maskChar: '*'
      readonly preserveStructure: false
    }
    readonly patterns: {
      readonly email: {
        readonly enabled: true
        readonly strategy: 'token'
      }
      readonly phone: {
        readonly enabled: true
        readonly strategy: 'token'
      }
      readonly ssn: {
        readonly enabled: true
        readonly strategy: 'token'
      }
      readonly name: {
        readonly enabled: true
        readonly strategy: 'token'
      }
      readonly creditCard: {
        readonly enabled: true
        readonly strategy: 'token'
      }
      readonly creditCardLast4: {
        readonly enabled: true
        readonly strategy: 'token'
      }
      readonly uuid: {
        readonly enabled: true
        readonly strategy: 'token'
      }
      readonly filePath: {
        readonly enabled: true
        readonly strategy: 'token'
      }
      readonly ipv4: {
        readonly enabled: true
        readonly strategy: 'token'
      }
      readonly ipv6: {
        readonly enabled: true
        readonly strategy: 'token'
      }
      readonly macAddress: {
        readonly enabled: true
        readonly strategy: 'token'
      }
      readonly hostname: {
        readonly enabled: true
        readonly strategy: 'token'
      }
      readonly ticketNumber: {
        readonly enabled: true
        readonly strategy: 'token'
      }
    }
    readonly scenarios: {
      readonly authHeader: {
        readonly enabled: true
        readonly strategy: 'token'
      }
      readonly password: {
        readonly enabled: true
        readonly strategy: 'token'
      }
      readonly apiKey: {
        readonly enabled: true
        readonly strategy: 'token'
      }
      readonly connectionString: {
        readonly enabled: true
        readonly strategy: 'token'
      }
      readonly privateKey: {
        readonly enabled: true
        readonly strategy: 'token'
      }
      readonly awsCredentials: {
        readonly enabled: true
        readonly strategy: 'token'
      }
    }
  }
  /**
   * Minimal Preset
   * Basic PII protection - only email and phone
   */
  readonly minimal: {
    readonly formatOptions: {
      readonly tokenFormat: '[{TYPE}_{INDEX}]'
      readonly maskChar: '*'
      readonly preserveStructure: true
    }
    readonly patterns: {
      readonly email: {
        readonly enabled: true
        readonly strategy: 'token'
      }
      readonly phone: {
        readonly enabled: true
        readonly strategy: 'token'
      }
      readonly ssn: {
        readonly enabled: false
        readonly strategy: 'token'
      }
      readonly name: {
        readonly enabled: false
        readonly strategy: 'token'
      }
      readonly creditCard: {
        readonly enabled: false
        readonly strategy: 'token'
      }
      readonly creditCardLast4: {
        readonly enabled: false
        readonly strategy: 'token'
      }
      readonly uuid: {
        readonly enabled: false
        readonly strategy: 'token'
      }
      readonly filePath: {
        readonly enabled: false
        readonly strategy: 'token'
      }
      readonly ipv4: {
        readonly enabled: false
        readonly strategy: 'token'
      }
      readonly ipv6: {
        readonly enabled: false
        readonly strategy: 'token'
      }
      readonly macAddress: {
        readonly enabled: false
        readonly strategy: 'token'
      }
      readonly hostname: {
        readonly enabled: false
        readonly strategy: 'token'
      }
      readonly ticketNumber: {
        readonly enabled: false
        readonly strategy: 'token'
      }
    }
    readonly scenarios: {
      readonly authHeader: {
        readonly enabled: false
        readonly strategy: 'token'
      }
      readonly password: {
        readonly enabled: false
        readonly strategy: 'token'
      }
      readonly apiKey: {
        readonly enabled: false
        readonly strategy: 'token'
      }
      readonly connectionString: {
        readonly enabled: false
        readonly strategy: 'token'
      }
      readonly privateKey: {
        readonly enabled: false
        readonly strategy: 'token'
      }
      readonly awsCredentials: {
        readonly enabled: false
        readonly strategy: 'token'
      }
    }
  }
  /**
   * Logs Preset
   * Optimized for log file redaction
   * Uses format-preserving for IPs/hostnames to maintain log readability
   */
  readonly logs: {
    readonly formatOptions: {
      readonly tokenFormat: '[{TYPE}_{INDEX}]'
      readonly maskChar: '*'
      readonly preserveStructure: true
    }
    readonly patterns: {
      readonly email: {
        readonly enabled: true
        readonly strategy: 'token'
      }
      readonly phone: {
        readonly enabled: false
        readonly strategy: 'token'
      }
      readonly ssn: {
        readonly enabled: false
        readonly strategy: 'token'
      }
      readonly name: {
        readonly enabled: false
        readonly strategy: 'token'
      }
      readonly creditCard: {
        readonly enabled: false
        readonly strategy: 'token'
      }
      readonly creditCardLast4: {
        readonly enabled: false
        readonly strategy: 'token'
      }
      readonly uuid: {
        readonly enabled: true
        readonly strategy: 'token'
      }
      readonly filePath: {
        readonly enabled: true
        readonly strategy: 'token'
      }
      readonly ipv4: {
        readonly enabled: true
        readonly strategy: 'formatPreserving'
      }
      readonly ipv6: {
        readonly enabled: true
        readonly strategy: 'formatPreserving'
      }
      readonly macAddress: {
        readonly enabled: true
        readonly strategy: 'formatPreserving'
      }
      readonly hostname: {
        readonly enabled: true
        readonly strategy: 'formatPreserving'
      }
      readonly ticketNumber: {
        readonly enabled: true
        readonly strategy: 'token'
      }
    }
    readonly scenarios: {
      readonly authHeader: {
        readonly enabled: true
        readonly strategy: 'token'
      }
      readonly password: {
        readonly enabled: true
        readonly strategy: 'token'
      }
      readonly apiKey: {
        readonly enabled: true
        readonly strategy: 'token'
      }
      readonly connectionString: {
        readonly enabled: true
        readonly strategy: 'token'
      }
      readonly privateKey: {
        readonly enabled: true
        readonly strategy: 'token'
      }
      readonly awsCredentials: {
        readonly enabled: true
        readonly strategy: 'token'
      }
    }
  }
  /**
   * Financial Preset
   * Focus on financial data protection
   */
  readonly financial: {
    readonly formatOptions: {
      readonly tokenFormat: '[{TYPE}_{INDEX}]'
      readonly maskChar: '*'
      readonly preserveStructure: true
    }
    readonly patterns: {
      readonly email: {
        readonly enabled: true
        readonly strategy: 'token'
      }
      readonly phone: {
        readonly enabled: true
        readonly strategy: 'token'
      }
      readonly ssn: {
        readonly enabled: true
        readonly strategy: 'token'
      }
      readonly name: {
        readonly enabled: true
        readonly strategy: 'token'
      }
      readonly creditCard: {
        readonly enabled: true
        readonly strategy: 'mask'
      }
      readonly creditCardLast4: {
        readonly enabled: true
        readonly strategy: 'token'
      }
      readonly uuid: {
        readonly enabled: false
        readonly strategy: 'token'
      }
      readonly filePath: {
        readonly enabled: false
        readonly strategy: 'token'
      }
      readonly ipv4: {
        readonly enabled: false
        readonly strategy: 'token'
      }
      readonly ipv6: {
        readonly enabled: false
        readonly strategy: 'token'
      }
      readonly macAddress: {
        readonly enabled: false
        readonly strategy: 'token'
      }
      readonly hostname: {
        readonly enabled: false
        readonly strategy: 'token'
      }
      readonly ticketNumber: {
        readonly enabled: true
        readonly strategy: 'token'
      }
    }
    readonly scenarios: {
      readonly authHeader: {
        readonly enabled: false
        readonly strategy: 'token'
      }
      readonly password: {
        readonly enabled: false
        readonly strategy: 'token'
      }
      readonly apiKey: {
        readonly enabled: false
        readonly strategy: 'token'
      }
      readonly connectionString: {
        readonly enabled: false
        readonly strategy: 'token'
      }
      readonly privateKey: {
        readonly enabled: false
        readonly strategy: 'token'
      }
      readonly awsCredentials: {
        readonly enabled: false
        readonly strategy: 'token'
      }
    }
  }
  /**
   * Healthcare Preset
   * HIPAA-focused protection
   */
  readonly healthcare: {
    readonly formatOptions: {
      readonly tokenFormat: '[PHI_{TYPE}_{INDEX}]'
      readonly maskChar: '*'
      readonly preserveStructure: false
    }
    readonly patterns: {
      readonly email: {
        readonly enabled: true
        readonly strategy: 'token'
      }
      readonly phone: {
        readonly enabled: true
        readonly strategy: 'token'
      }
      readonly ssn: {
        readonly enabled: true
        readonly strategy: 'token'
      }
      readonly name: {
        readonly enabled: true
        readonly strategy: 'token'
      }
      readonly creditCard: {
        readonly enabled: true
        readonly strategy: 'token'
      }
      readonly creditCardLast4: {
        readonly enabled: true
        readonly strategy: 'token'
      }
      readonly uuid: {
        readonly enabled: true
        readonly strategy: 'token'
      }
      readonly filePath: {
        readonly enabled: true
        readonly strategy: 'token'
      }
      readonly ipv4: {
        readonly enabled: true
        readonly strategy: 'token'
      }
      readonly ipv6: {
        readonly enabled: true
        readonly strategy: 'token'
      }
      readonly macAddress: {
        readonly enabled: true
        readonly strategy: 'token'
      }
      readonly hostname: {
        readonly enabled: true
        readonly strategy: 'token'
      }
      readonly ticketNumber: {
        readonly enabled: true
        readonly strategy: 'token'
      }
    }
    readonly scenarios: {
      readonly authHeader: {
        readonly enabled: true
        readonly strategy: 'token'
      }
      readonly password: {
        readonly enabled: true
        readonly strategy: 'token'
      }
      readonly apiKey: {
        readonly enabled: true
        readonly strategy: 'token'
      }
      readonly connectionString: {
        readonly enabled: true
        readonly strategy: 'token'
      }
      readonly privateKey: {
        readonly enabled: true
        readonly strategy: 'token'
      }
      readonly awsCredentials: {
        readonly enabled: true
        readonly strategy: 'token'
      }
    }
  }
}
type PresetName = keyof typeof PRESETS
/**
 * Get a preset configuration by name
 * @param name The preset name
 * @returns A partial RedactorConfig that can be passed to DataRedactor
 */
declare function getPreset(name: PresetName): Partial<RedactorConfig>
/**
 * Get all available preset names
 * @returns Array of preset names
 */
declare function getPresetNames(): PresetName[]
/**
 * Check if a preset exists
 * @param name The preset name to check
 * @returns True if the preset exists
 */
declare function hasPreset(name: string): name is PresetName

declare class BasePattern implements Pattern {
  name: string
  regex: RegExp
  strategy: RedactionStrategy
  enabled: boolean
  constructor(
    name: string,
    regex: RegExp,
    strategy?: RedactionStrategy,
    enabled?: boolean
  )
  test(text: string): boolean
  findAll(text: string): Match[]
  setStrategy(strategy: RedactionStrategy): void
  setEnabled(enabled: boolean): void
}

declare class IPv4Pattern extends BasePattern {
  constructor(strategy?: RedactionStrategy, enabled?: boolean)
}
declare class IPv6Pattern extends BasePattern {
  constructor(strategy?: RedactionStrategy, enabled?: boolean)
  findAll(text: string): Match[]
  private isValidIPv6
  private expandIPv6
}
declare class MACAddressPattern extends BasePattern {
  constructor(strategy?: RedactionStrategy, enabled?: boolean)
}
declare class HostnamePattern extends BasePattern {
  constructor(strategy?: RedactionStrategy, enabled?: boolean)
}

declare class EmailPattern extends BasePattern {
  constructor(strategy?: RedactionStrategy, enabled?: boolean)
}
declare class PhonePattern extends BasePattern {
  constructor(strategy?: RedactionStrategy, enabled?: boolean)
}
declare class SSNPattern extends BasePattern {
  constructor(strategy?: RedactionStrategy, enabled?: boolean)
}
declare class NamePattern extends BasePattern {
  constructor(strategy?: RedactionStrategy, enabled?: boolean)
}

declare class CreditCardPattern extends BasePattern {
  constructor(strategy?: RedactionStrategy, enabled?: boolean)
}
declare class CreditCardLast4Pattern extends BasePattern {
  constructor(strategy?: RedactionStrategy, enabled?: boolean)
}

declare class TicketNumberPattern extends BasePattern {
  constructor(strategy?: RedactionStrategy, enabled?: boolean)
}

/**
 * UUID Pattern - Matches standard UUID format (8-4-4-4-12 hex digits)
 * Examples: 550e8400-e29b-41d4-a716-446655440000
 */
declare class UUIDPattern extends BasePattern {
  constructor(strategy?: RedactionStrategy, enabled?: boolean)
}
/**
 * File Path Pattern - Matches Windows and Unix file paths
 * Windows: C:\Users\name\file.txt, D:\folder\subfolder\
 * Unix: /home/user/file.txt, /var/log/syslog
 */
declare class FilePathPattern extends BasePattern {
  constructor(strategy?: RedactionStrategy, enabled?: boolean)
}

interface IRedactionStrategy {
  redact(value: string, type: string, counter: number): string
}
declare class RedactionContext {
  private valueMap
  private counters
  getOrCreateRedaction(
    value: string,
    type: string,
    strategy: IRedactionStrategy
  ): string
  getMapping(): Record<string, string>
  clear(): void
}

declare class TokenStrategy implements IRedactionStrategy {
  private tokenFormat
  constructor(formatOptions?: FormatOptions)
  redact(value: string, type: string, counter: number): string
}

declare class MaskStrategy implements IRedactionStrategy {
  private maskChar
  private preserveStructure
  constructor(formatOptions?: FormatOptions)
  redact(value: string, type: string, counter: number): string
}

declare class FormatPreservingStrategy implements IRedactionStrategy {
  private seed
  constructor(formatOptions?: FormatOptions)
  redact(value: string, type: string, counter: number): string
  private hashString
  private seededRandom
  private generateIPv4
  private generateMAC
  private generateEmail
  private generatePhone
  private generateSSN
  private generateCreditCard
  private generateHostname
  private generateRandomString
}

interface Scenario {
  name: string
  pattern: RegExp
  captureGroup: number
  strategy: RedactionStrategy
  enabled: boolean
  findAll: (text: string) => Match[]
}
/**
 * BaseScenario - Context-aware pattern matching
 *
 * Unlike regular patterns that match standalone values,
 * scenarios match values only when they appear in a specific context.
 *
 * Example: "password = secretValue" matches "secretValue" only because
 * it follows "password ="
 */
declare class BaseScenario implements Scenario {
  name: string
  pattern: RegExp
  captureGroup: number
  strategy: RedactionStrategy
  enabled: boolean
  constructor(
    name: string,
    pattern: RegExp,
    captureGroup?: number,
    strategy?: RedactionStrategy,
    enabled?: boolean
  )
  findAll(text: string): Match[]
  setStrategy(strategy: RedactionStrategy): void
  setEnabled(enabled: boolean): void
}
/**
 * Authorization Header Scenario
 * Matches: "Authorization: Bearer <token>" or "Authorization: Basic <token>"
 */
declare class AuthorizationHeaderScenario extends BaseScenario {
  constructor(strategy?: RedactionStrategy, enabled?: boolean)
}
/**
 * Password Scenario
 * Matches: "password = value", "passwd: value", "pwd=value"
 */
declare class PasswordScenario extends BaseScenario {
  constructor(strategy?: RedactionStrategy, enabled?: boolean)
}
/**
 * API Key Scenario
 * Matches: "api_key = value", "apikey: value", "secret_key=value"
 */
declare class ApiKeyScenario extends BaseScenario {
  constructor(strategy?: RedactionStrategy, enabled?: boolean)
}
/**
 * Connection String Scenario
 * Matches database connection strings with passwords
 */
declare class ConnectionStringScenario extends BaseScenario {
  constructor(strategy?: RedactionStrategy, enabled?: boolean)
}
/**
 * Private Key Scenario
 * Matches: "-----BEGIN PRIVATE KEY-----...-----END PRIVATE KEY-----"
 */
declare class PrivateKeyScenario extends BaseScenario {
  constructor(strategy?: RedactionStrategy, enabled?: boolean)
}
/**
 * AWS Credentials Scenario
 * Matches AWS access keys and secret keys
 */
declare class AWSCredentialsScenario extends BaseScenario {
  constructor(strategy?: RedactionStrategy, enabled?: boolean)
}

/**
 * Tokenizer for Regex Builder
 *
 * Breaks down sample text into classified tokens for pattern detection
 */
declare enum TokenType {
  DIGIT = 'DIGIT',
  LOWER = 'LOWER',
  UPPER = 'UPPER',
  HEX_LOWER = 'HEX_LOWER',
  HEX_UPPER = 'HEX_UPPER',
  WHITESPACE = 'WHITESPACE',
  NEWLINE = 'NEWLINE',
  SPECIAL = 'SPECIAL',
}
interface Token {
  type: TokenType
  value: string
  position: number
  length: number
}
/**
 * Tokenize input string into classified tokens
 * Adjacent characters of compatible types are merged
 */
declare function tokenize(input: string): Token[]

/**
 * Pattern Detector for Regex Builder
 *
 * Analyzes tokens to detect common patterns and generate regex segments
 */

interface PatternSegment {
  regex: string
  description: string
  type:
    | 'digit'
    | 'lower'
    | 'upper'
    | 'hex'
    | 'whitespace'
    | 'literal'
    | 'uuid'
    | 'ipv4'
    | 'mac'
    | 'unknown'
  isVariable: boolean
  minLength: number
  maxLength: number
  originalValue: string
}
/**
 * Detect patterns in tokens and convert to regex segments
 */
declare function detectPatterns(tokens: Token[]): PatternSegment[]
/**
 * Merge adjacent pattern segments of the same type
 * For example: [a-z]{3}[a-z]{2} -> [a-z]{5}
 */
declare function mergeAdjacentPatterns(
  segments: PatternSegment[]
): PatternSegment[]

/**
 * Regex Optimizer for Regex Builder
 *
 * Optimizes and simplifies generated regex patterns
 */

/**
 * Apply optimization rules to a regex string
 */
declare function optimizeRegex(regex: string): string
/**
 * Build final regex from pattern segments
 */
declare function buildRegex(segments: PatternSegment[]): string
/**
 * Add word boundaries if appropriate
 * Word boundaries only work between word (\w) and non-word (\W) characters
 * They should NOT be added if pattern starts/ends with non-word characters like [ ] { } etc.
 */
declare function addWordBoundaries(
  regex: string,
  addBoundaries?: boolean
): string
/**
 * Validate that a regex compiles and matches the original sample
 */
declare function validateRegex(
  regex: string,
  sample: string
): {
  valid: boolean
  error?: string
  matches: boolean
}
/**
 * Escape a string for use in a regex
 */
declare function escapeRegex(str: string): string
/**
 * Check if a regex pattern is too broad (potentially dangerous)
 * Returns warnings about overly permissive patterns
 */
declare function analyzePattern(regex: string): string[]

/**
 * Regex Builder - Custom Pattern Generation Engine
 *
 * Generates regex patterns from sample text input using
 * tokenization, pattern detection, and optimization.
 *
 * No external dependencies - built from scratch.
 */

interface GeneratedPattern {
  /** The generated regex pattern string */
  regex: string
  /** Whether the pattern is valid and compiles */
  valid: boolean
  /** Whether the pattern matches the original sample */
  matchesSample: boolean
  /** Any warnings about the pattern */
  warnings: string[]
  /** The detected pattern segments */
  segments: PatternSegment[]
  /** Suggested name for the pattern */
  suggestedName: string
  /** Error message if pattern is invalid */
  error?: string
}
interface GenerateOptions {
  /** Add word boundaries to the pattern */
  addWordBoundaries?: boolean
  /** Make the pattern case insensitive */
  caseInsensitive?: boolean
  /** Generate a more permissive pattern */
  permissive?: boolean
}
/**
 * Generate a regex pattern from a sample text
 *
 * @param sample - The sample text to generate a pattern from
 * @param options - Generation options
 * @returns The generated pattern with metadata
 */
declare function generateFromSample(
  sample: string,
  options?: GenerateOptions
): GeneratedPattern
/**
 * Test a regex pattern against multiple samples
 *
 * @param regex - The regex pattern to test
 * @param samples - Array of sample strings to test against
 * @returns Test results for each sample
 */
declare function testPattern(
  regex: string,
  samples: string[]
): Array<{
  sample: string
  matches: boolean
  matchedText?: string
}>
/**
 * Refine a pattern by providing additional samples
 * Finds common structure between multiple samples
 *
 * @param samples - Array of sample strings
 * @param options - Generation options
 * @returns The refined pattern
 */
declare function refineFromSamples(
  samples: string[],
  options?: GenerateOptions
): GeneratedPattern

/**
 * Pattern Testing Engine
 *
 * Executes test samples against patterns and validates results
 */

declare class PatternTestEngine {
  /**
   * Execute a pattern against a test sample
   *
   * @param pattern - The pattern to test
   * @param sample - The test sample to run
   * @returns Test result with accuracy metrics
   */
  static executeTest(pattern: Pattern, sample: TestSample): PatternTestResult
  /**
   * Execute all test samples for a pattern
   *
   * @param pattern - The pattern to test
   * @param samples - Array of test samples
   * @returns Array of test results
   */
  static executeAllTests(
    pattern: Pattern,
    samples: TestSample[]
  ): PatternTestResult[]
  /**
   * Get summary statistics for test results
   */
  static getSummary(results: PatternTestResult[]): {
    totalTests: number
    passed: number
    failed: number
    averageAccuracy: number
    totalFalsePositives: number
    totalFalseNegatives: number
  }
}

/**
 * Quality Score Calculator
 *
 * Calculates a 0-100 quality score for patterns based on:
 * - Test coverage (50 points max)
 * - Accuracy (30 points max)
 * - Edge case handling (20 points max)
 */

interface QualityScoreBreakdown {
  totalScore: number
  coverageScore: number
  accuracyScore: number
  edgeCaseScore: number
  details: {
    testCount: number
    averageAccuracy: number
    knownIssues: number
  }
}
/**
 * Calculate quality score for a pattern
 *
 * @param testResults - Array of test results
 * @param knownIssues - Number of open edge case reports (default 0)
 * @returns Quality score breakdown
 */
declare function calculateQualityScore(
  testResults: PatternTestResult[],
  knownIssues?: number
): QualityScoreBreakdown
/**
 * Get quality tier based on score
 */
declare function getQualityTier(
  score: number
): 'excellent' | 'good' | 'fair' | 'poor' | 'untested'
/**
 * Get quality tier color for UI display
 */
declare function getQualityTierColor(
  tier: ReturnType<typeof getQualityTier>
): string
/**
 * Get quality tier badge label
 */
declare function getQualityTierLabel(
  tier: ReturnType<typeof getQualityTier>
): string
/**
 * Get recommendations based on quality score breakdown
 */
declare function getRecommendations(breakdown: QualityScoreBreakdown): string[]

/**
 * Test Samples Index
 *
 * Central export point for all 60 test samples (5 per pattern × 12 patterns)
 */

/**
 * All test samples indexed by ID
 */
declare const ALL_TEST_SAMPLES: Record<string, TestSample>
/**
 * Get a test sample by ID
 */
declare function getTestSample(id: string): TestSample | undefined
/**
 * Get all test samples for a specific pattern
 */
declare function getTestSamplesForPattern(patternName: string): TestSample[]
/**
 * Get all test sample IDs
 */
declare function getAllTestSampleIds(): string[]
/**
 * Get test samples by category
 */
declare function getTestSamplesByCategory(
  category: TestSample['category']
): TestSample[]

export {
  ALL_TEST_SAMPLES,
  AWSCredentialsScenario,
  ApiKeyScenario,
  AuthorizationHeaderScenario,
  BasePattern,
  BaseScenario,
  ConfigLoader,
  ConnectionStringScenario,
  CreditCardLast4Pattern,
  CreditCardPattern,
  type CustomPattern,
  DEFAULT_CONFIG,
  DataRedactor,
  type EdgeCaseReport,
  EmailPattern,
  type ExpectedMatch,
  FilePathPattern,
  type FormatOptions,
  FormatPreservingStrategy,
  type GenerateOptions,
  type GeneratedPattern,
  HostnamePattern,
  IPv4Pattern,
  IPv6Pattern,
  type IRedactionStrategy,
  MACAddressPattern,
  MaskStrategy,
  type Match,
  NamePattern,
  PRESETS,
  PasswordScenario,
  type Pattern,
  type PatternConfig,
  type PatternSegment,
  PatternTestEngine,
  type PatternTestResult,
  PhonePattern,
  type PresetName,
  PrivateKeyScenario,
  type QualityScoreBreakdown,
  RedactionContext,
  type RedactionResult,
  type RedactionStrategy,
  type RedactorConfig,
  SSNPattern,
  type Scenario,
  type ScenarioConfig,
  type TestSample,
  TicketNumberPattern,
  type Token,
  TokenStrategy,
  TokenType,
  UUIDPattern,
  addWordBoundaries,
  analyzePattern,
  buildRegex,
  calculateQualityScore,
  detectPatterns,
  escapeRegex,
  generateFromSample,
  getAllTestSampleIds,
  getPreset,
  getPresetNames,
  getQualityTier,
  getQualityTierColor,
  getQualityTierLabel,
  getRecommendations,
  getTestSample,
  getTestSamplesByCategory,
  getTestSamplesForPattern,
  hasPreset,
  mergeAdjacentPatterns,
  optimizeRegex,
  refineFromSamples,
  testPattern,
  tokenize,
  validateRegex,
}
