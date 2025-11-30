/**
 * Pattern Detector for Regex Builder
 *
 * Analyzes tokens to detect common patterns and generate regex segments
 */

import { Token, TokenType } from './tokenizer'

export interface PatternSegment {
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
 * Known pattern signatures for auto-detection
 */
interface PatternSignature {
  name: string
  type: PatternSegment['type']
  test: (tokens: Token[]) => boolean
  toRegex: (tokens: Token[]) => string
}

/**
 * Common pattern signatures for auto-detection
 */
const KNOWN_PATTERNS: PatternSignature[] = [
  {
    name: 'UUID',
    type: 'uuid',
    test: tokens => {
      // 8-4-4-4-12 hex pattern with dashes
      if (tokens.length !== 9) return false
      const lengths = [8, 1, 4, 1, 4, 1, 4, 1, 12]
      return tokens.every((t, i) => {
        if (i % 2 === 1) return t.type === TokenType.SPECIAL && t.value === '-'
        return (
          (t.type === TokenType.HEX_LOWER ||
            t.type === TokenType.HEX_UPPER ||
            t.type === TokenType.DIGIT) &&
          t.length === lengths[i]
        )
      })
    },
    toRegex: () =>
      '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}',
  },
  {
    name: 'IPv4',
    type: 'ipv4',
    test: tokens => {
      // x.x.x.x where x is 1-3 digits
      if (tokens.length !== 7) return false
      return tokens.every((t, i) => {
        if (i % 2 === 1) return t.type === TokenType.SPECIAL && t.value === '.'
        return t.type === TokenType.DIGIT && t.length >= 1 && t.length <= 3
      })
    },
    toRegex: () =>
      '(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)',
  },
  {
    name: 'MAC Address (colon)',
    type: 'mac',
    test: tokens => {
      // xx:xx:xx:xx:xx:xx
      if (tokens.length !== 11) return false
      return tokens.every((t, i) => {
        if (i % 2 === 1) return t.type === TokenType.SPECIAL && t.value === ':'
        return (
          (t.type === TokenType.HEX_LOWER ||
            t.type === TokenType.HEX_UPPER ||
            t.type === TokenType.DIGIT) &&
          t.length === 2
        )
      })
    },
    toRegex: () =>
      '[0-9a-fA-F]{2}:[0-9a-fA-F]{2}:[0-9a-fA-F]{2}:[0-9a-fA-F]{2}:[0-9a-fA-F]{2}:[0-9a-fA-F]{2}',
  },
  {
    name: 'MAC Address (dash)',
    type: 'mac',
    test: tokens => {
      if (tokens.length !== 11) return false
      return tokens.every((t, i) => {
        if (i % 2 === 1) return t.type === TokenType.SPECIAL && t.value === '-'
        return (
          (t.type === TokenType.HEX_LOWER ||
            t.type === TokenType.HEX_UPPER ||
            t.type === TokenType.DIGIT) &&
          t.length === 2
        )
      })
    },
    toRegex: () =>
      '[0-9a-fA-F]{2}-[0-9a-fA-F]{2}-[0-9a-fA-F]{2}-[0-9a-fA-F]{2}-[0-9a-fA-F]{2}-[0-9a-fA-F]{2}',
  },
]

/**
 * Convert a single token to a regex pattern segment
 */
function tokenToRegex(token: Token): PatternSegment {
  const len = token.length

  switch (token.type) {
    case TokenType.DIGIT:
      return {
        regex: len === 1 ? '\\d' : `\\d{${len}}`,
        description: `${len} digit(s)`,
        type: 'digit',
        isVariable: true,
        minLength: len,
        maxLength: len,
        originalValue: token.value,
      }

    case TokenType.LOWER:
      return {
        regex: len === 1 ? '[a-z]' : `[a-z]{${len}}`,
        description: `${len} lowercase letter(s)`,
        type: 'lower',
        isVariable: true,
        minLength: len,
        maxLength: len,
        originalValue: token.value,
      }

    case TokenType.UPPER:
      return {
        regex: len === 1 ? '[A-Z]' : `[A-Z]{${len}}`,
        description: `${len} uppercase letter(s)`,
        type: 'upper',
        isVariable: true,
        minLength: len,
        maxLength: len,
        originalValue: token.value,
      }

    case TokenType.HEX_LOWER:
      return {
        regex: len === 1 ? '[0-9a-f]' : `[0-9a-f]{${len}}`,
        description: `${len} hex char(s) [0-9a-f]`,
        type: 'hex',
        isVariable: true,
        minLength: len,
        maxLength: len,
        originalValue: token.value,
      }

    case TokenType.HEX_UPPER:
      return {
        regex: len === 1 ? '[0-9A-F]' : `[0-9A-F]{${len}}`,
        description: `${len} hex char(s) [0-9A-F]`,
        type: 'hex',
        isVariable: true,
        minLength: len,
        maxLength: len,
        originalValue: token.value,
      }

    case TokenType.WHITESPACE:
      return {
        regex: len === 1 ? '\\s' : `\\s{${len}}`,
        description: `${len} whitespace`,
        type: 'whitespace',
        isVariable: true,
        minLength: len,
        maxLength: len,
        originalValue: token.value,
      }

    case TokenType.NEWLINE:
      return {
        regex: '\\r?\\n',
        description: 'newline',
        type: 'whitespace',
        isVariable: false,
        minLength: 1,
        maxLength: 2,
        originalValue: token.value,
      }

    case TokenType.SPECIAL:
      // Escape regex special characters
      const escaped = token.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      return {
        regex: escaped,
        description: `literal "${token.value}"`,
        type: 'literal',
        isVariable: false,
        minLength: len,
        maxLength: len,
        originalValue: token.value,
      }

    default:
      return {
        regex: token.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
        description: `literal "${token.value}"`,
        type: 'unknown',
        isVariable: false,
        minLength: len,
        maxLength: len,
        originalValue: token.value,
      }
  }
}

/**
 * Detect patterns in tokens and convert to regex segments
 */
export function detectPatterns(tokens: Token[]): PatternSegment[] {
  // First, check for known patterns
  for (const pattern of KNOWN_PATTERNS) {
    if (pattern.test(tokens)) {
      return [
        {
          regex: pattern.toRegex(tokens),
          description: pattern.name,
          type: pattern.type,
          isVariable: true,
          minLength: tokens.reduce((sum, t) => sum + t.length, 0),
          maxLength: tokens.reduce((sum, t) => sum + t.length, 0),
          originalValue: tokens.map(t => t.value).join(''),
        },
      ]
    }
  }

  // Otherwise, convert each token to a segment
  return tokens.map(tokenToRegex)
}

/**
 * Merge adjacent pattern segments of the same type
 * For example: [a-z]{3}[a-z]{2} -> [a-z]{5}
 */
export function mergeAdjacentPatterns(
  segments: PatternSegment[]
): PatternSegment[] {
  if (segments.length <= 1) return segments

  const merged: PatternSegment[] = []

  for (const segment of segments) {
    if (merged.length === 0) {
      merged.push({ ...segment })
      continue
    }

    const last = merged[merged.length - 1]

    // Try to merge alphanumeric patterns
    // [a-z] + [a-z] = [a-z]{n}
    // [A-Z] + [A-Z] = [A-Z]{n}
    // \d + \d = \d{n}

    const alphaPattern = /^\[([a-zA-Z0-9-]+)\](?:\{(\d+)\})?$/
    const digitPattern = /^\\d(?:\{(\d+)\})?$/

    const lastMatch = last.regex.match(alphaPattern)
    const currMatch = segment.regex.match(alphaPattern)

    if (lastMatch && currMatch && lastMatch[1] === currMatch[1]) {
      // Same character class, merge them
      const lastCount = lastMatch[2] ? parseInt(lastMatch[2]) : 1
      const currCount = currMatch[2] ? parseInt(currMatch[2]) : 1
      const total = lastCount + currCount

      last.regex = `[${lastMatch[1]}]{${total}}`
      last.maxLength = total
      last.minLength = total
      last.description = `${total} char(s) [${lastMatch[1]}]`
      last.originalValue += segment.originalValue
      continue
    }

    // Check for digit merging
    const lastDigit = last.regex.match(digitPattern)
    const currDigit = segment.regex.match(digitPattern)

    if (lastDigit && currDigit) {
      const lastCount = lastDigit[1] ? parseInt(lastDigit[1]) : 1
      const currCount = currDigit[1] ? parseInt(currDigit[1]) : 1
      const total = lastCount + currCount

      last.regex = `\\d{${total}}`
      last.maxLength = total
      last.minLength = total
      last.description = `${total} digit(s)`
      last.originalValue += segment.originalValue
      continue
    }

    // Can't merge, add as new segment
    merged.push({ ...segment })
  }

  return merged
}
