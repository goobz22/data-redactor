/**
 * Regex Optimizer for Regex Builder
 *
 * Optimizes and simplifies generated regex patterns
 */

import { PatternSegment } from './pattern-detector'

/**
 * Optimization rules to apply to the generated regex
 */
const OPTIMIZATIONS: Array<{
  name: string
  pattern: RegExp
  replacement: string | ((match: string, ...groups: string[]) => string)
}> = [
  // Combine adjacent identical character classes
  {
    name: 'Combine adjacent digits',
    pattern: /\\d\{(\d+)\}\\d\{(\d+)\}/g,
    replacement: (_, a, b) => `\\d{${parseInt(a) + parseInt(b)}}`,
  },
  {
    name: 'Combine single and counted digits',
    pattern: /\\d\\d\{(\d+)\}/g,
    replacement: (_, n) => `\\d{${parseInt(n) + 1}}`,
  },
  {
    name: 'Combine counted and single digits',
    pattern: /\\d\{(\d+)\}\\d(?!\{)/g,
    replacement: (_, n) => `\\d{${parseInt(n) + 1}}`,
  },
  {
    name: 'Combine two single digits',
    pattern: /\\d\\d(?!\{|\d)/g,
    replacement: '\\d{2}',
  },

  // Simplify single-count quantifiers
  {
    name: 'Remove {1} quantifier',
    pattern: /\{1\}/g,
    replacement: '',
  },

  // Combine whitespace
  {
    name: 'Combine adjacent whitespace',
    pattern: /\\s\{(\d+)\}\\s\{(\d+)\}/g,
    replacement: (_, a, b) => `\\s{${parseInt(a) + parseInt(b)}}`,
  },

  // Simplify alternation with common prefix/suffix
  // This is more complex and would require AST parsing

  // Combine character class ranges
  {
    name: 'Combine [a-z] classes',
    pattern: /\[a-z\]\{(\d+)\}\[a-z\]\{(\d+)\}/g,
    replacement: (_, a, b) => `[a-z]{${parseInt(a) + parseInt(b)}}`,
  },
  {
    name: 'Combine [A-Z] classes',
    pattern: /\[A-Z\]\{(\d+)\}\[A-Z\]\{(\d+)\}/g,
    replacement: (_, a, b) => `[A-Z]{${parseInt(a) + parseInt(b)}}`,
  },
  {
    name: 'Combine [0-9a-f] classes',
    pattern: /\[0-9a-f\]\{(\d+)\}\[0-9a-f\]\{(\d+)\}/g,
    replacement: (_, a, b) => `[0-9a-f]{${parseInt(a) + parseInt(b)}}`,
  },
  {
    name: 'Combine [0-9A-F] classes',
    pattern: /\[0-9A-F\]\{(\d+)\}\[0-9A-F\]\{(\d+)\}/g,
    replacement: (_, a, b) => `[0-9A-F]{${parseInt(a) + parseInt(b)}}`,
  },
]

/**
 * Apply optimization rules to a regex string
 */
export function optimizeRegex(regex: string): string {
  let optimized = regex
  let changed = true
  let iterations = 0
  const maxIterations = 10 // Prevent infinite loops

  while (changed && iterations < maxIterations) {
    changed = false
    iterations++

    for (const rule of OPTIMIZATIONS) {
      const before = optimized
      optimized = optimized.replace(rule.pattern, rule.replacement as string)

      if (before !== optimized) {
        changed = true
      }
    }
  }

  return optimized
}

/**
 * Build final regex from pattern segments
 */
export function buildRegex(segments: PatternSegment[]): string {
  const raw = segments.map(s => s.regex).join('')
  return optimizeRegex(raw)
}

/**
 * Add word boundaries if appropriate
 * Word boundaries only work between word (\w) and non-word (\W) characters
 * They should NOT be added if pattern starts/ends with non-word characters like [ ] { } etc.
 */
export function addWordBoundaries(
  regex: string,
  addBoundaries: boolean = true
): string {
  if (!addBoundaries) return regex

  // Check if regex starts with a word character pattern
  // Word chars: \d (digits), \w, [a-z], [A-Z], [0-9...], or literal alphanumeric
  // NOT word chars: escaped special chars like \[, \], \{, \}, \", etc.
  const startsWithWord = /^(?:\\d|\\w|\[[a-zA-Z0-9]|[a-zA-Z0-9_])/.test(regex)

  // Check if regex ends with a word character pattern
  // Must not end with escaped special chars
  const endsWithWord =
    /(?:\\d|\\w|[a-zA-Z0-9_]|\[[a-zA-Z0-9][^\]]*\]|\{[0-9]+\})$/.test(regex)

  let result = regex
  if (startsWithWord) result = '\\b' + result
  if (endsWithWord) result = result + '\\b'

  return result
}

/**
 * Validate that a regex compiles and matches the original sample
 */
export function validateRegex(
  regex: string,
  sample: string
): { valid: boolean; error?: string; matches: boolean } {
  try {
    const re = new RegExp(regex)
    const matches = re.test(sample)

    return { valid: true, matches }
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Invalid regex',
      matches: false,
    }
  }
}

/**
 * Escape a string for use in a regex
 */
export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Check if a regex pattern is too broad (potentially dangerous)
 * Returns warnings about overly permissive patterns
 */
export function analyzePattern(regex: string): string[] {
  const warnings: string[] = []

  // Check for very short patterns
  if (regex.length < 3) {
    warnings.push('Pattern is very short and may match too broadly')
  }

  // Check for patterns that match everything
  if (/^\.\*$|^\.\+$/.test(regex)) {
    warnings.push('Pattern matches any text - too broad')
  }

  // Check for unbounded repetitions without anchors
  if (/(?<!\\)[*+]/.test(regex) && !/\\b|^\^|\$$/.test(regex)) {
    warnings.push('Unbounded repetition without anchors may match too much')
  }

  // Check for very permissive character classes
  if (/\.\*|\.\+/.test(regex)) {
    warnings.push('Using .* or .+ matches almost anything')
  }

  // Check for patterns that only match single characters
  if (/^(?:\\d|\[[\w-]+\]|\\w|\\s)$/.test(regex)) {
    warnings.push('Pattern only matches single characters')
  }

  return warnings
}
