/**
 * Regex Builder - Custom Pattern Generation Engine
 *
 * Generates regex patterns from sample text input using
 * tokenization, pattern detection, and optimization.
 *
 * No external dependencies - built from scratch.
 */

import { tokenize, type Token, TokenType } from './tokenizer'
import {
  detectPatterns,
  mergeAdjacentPatterns,
  type PatternSegment,
} from './pattern-detector'
import {
  buildRegex,
  optimizeRegex,
  addWordBoundaries,
  validateRegex,
  analyzePattern,
  escapeRegex,
} from './optimizer'

export interface GeneratedPattern {
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

export interface GenerateOptions {
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
export function generateFromSample(
  sample: string,
  options: GenerateOptions = {}
): GeneratedPattern {
  const {
    addWordBoundaries: withBoundaries = true,
    caseInsensitive = false,
    permissive = false,
  } = options

  // Handle empty input
  if (!sample || sample.trim().length === 0) {
    return {
      regex: '',
      valid: false,
      matchesSample: false,
      warnings: ['Empty sample provided'],
      segments: [],
      suggestedName: 'empty',
      error: 'Sample cannot be empty',
    }
  }

  // Step 1: Tokenize the input
  const tokens = tokenize(sample)

  // Step 2: Detect patterns in tokens
  let segments = detectPatterns(tokens)

  // Step 3: Merge adjacent similar patterns
  segments = mergeAdjacentPatterns(segments)

  // Step 4: Build the regex string
  let regex = buildRegex(segments)

  // Step 5: Apply word boundaries if requested
  if (withBoundaries) {
    regex = addWordBoundaries(regex, true)
  }

  // Step 6: Make case insensitive if requested
  // Note: This is handled at RegExp construction time, not in the pattern

  // Step 7: Validate the pattern
  const validation = validateRegex(regex, sample)

  // Step 8: Analyze for warnings
  const warnings = analyzePattern(regex)

  // Step 9: Generate a suggested name
  const suggestedName = generatePatternName(segments, sample)

  return {
    regex,
    valid: validation.valid,
    matchesSample: validation.matches,
    warnings,
    segments,
    suggestedName,
    error: validation.error,
  }
}

/**
 * Generate a suggested name for the pattern based on detected segments
 */
function generatePatternName(
  segments: PatternSegment[],
  sample: string
): string {
  // Check for known patterns
  const patternTypes = segments
    .map(s => s.type)
    .filter(t => t !== 'literal' && t !== 'unknown')

  if (patternTypes.includes('uuid')) return 'uuid-pattern'
  if (patternTypes.includes('ipv4')) return 'ipv4-pattern'
  if (patternTypes.includes('mac')) return 'mac-address-pattern'
  if (patternTypes.includes('hex')) return 'hex-pattern'

  // Check for common patterns based on content
  if (/^\d{3}-\d{2}-\d{4}$/.test(sample)) return 'ssn-pattern'
  if (/^\d{3}-\d{3}-\d{4}$/.test(sample)) return 'phone-pattern'
  if (/^\d{4}-\d{4}-\d{4}-\d{4}$/.test(sample)) return 'card-pattern'
  if (/^[A-Z]{2}\d{6}$/.test(sample)) return 'license-pattern'

  // Default based on structure
  const hasDigits = segments.some(s => s.type === 'digit')
  const hasLetters = segments.some(
    s => s.type === 'lower' || s.type === 'upper'
  )
  const hasSpecial = segments.some(s => s.type === 'literal')

  if (hasDigits && hasLetters && hasSpecial) return 'alphanumeric-mixed-pattern'
  if (hasDigits && hasLetters) return 'alphanumeric-pattern'
  if (hasDigits) return 'numeric-pattern'
  if (hasLetters) return 'text-pattern'

  return 'custom-pattern'
}

/**
 * Test a regex pattern against multiple samples
 *
 * @param regex - The regex pattern to test
 * @param samples - Array of sample strings to test against
 * @returns Test results for each sample
 */
export function testPattern(
  regex: string,
  samples: string[]
): Array<{ sample: string; matches: boolean; matchedText?: string }> {
  try {
    const re = new RegExp(regex)

    return samples.map(sample => {
      const match = sample.match(re)
      return {
        sample,
        matches: match !== null,
        matchedText: match?.[0],
      }
    })
  } catch {
    return samples.map(sample => ({
      sample,
      matches: false,
    }))
  }
}

/**
 * Refine a pattern by providing additional samples
 * Finds common structure between multiple samples
 *
 * @param samples - Array of sample strings
 * @param options - Generation options
 * @returns The refined pattern
 */
export function refineFromSamples(
  samples: string[],
  options: GenerateOptions = {}
): GeneratedPattern {
  if (samples.length === 0) {
    return generateFromSample('', options)
  }

  if (samples.length === 1) {
    return generateFromSample(samples[0], options)
  }

  // Generate patterns for each sample
  const patterns = samples.map(s =>
    generateFromSample(s, { ...options, addWordBoundaries: false })
  )

  // Find common segment types
  const allValid = patterns.every(p => p.valid)
  if (!allValid) {
    // Fall back to first sample if any are invalid
    return generateFromSample(samples[0], options)
  }

  // Check if all samples have the same structure
  const firstSegments = patterns[0].segments
  const sameStructure = patterns.every(
    p =>
      p.segments.length === firstSegments.length &&
      p.segments.every((seg, i) => seg.type === firstSegments[i].type)
  )

  if (sameStructure) {
    // Use the first pattern as the base
    return generateFromSample(samples[0], options)
  }

  // If structures differ, create alternation
  const regexes = patterns.map(p => `(?:${p.regex.replace(/^\\b|\\b$/g, '')})`)
  const combinedRegex = regexes.join('|')

  const validation = validateRegex(combinedRegex, samples[0])
  const warnings = analyzePattern(combinedRegex)
  warnings.push('Pattern combines multiple sample structures using alternation')

  return {
    regex:
      options.addWordBoundaries !== false
        ? addWordBoundaries(combinedRegex, true)
        : combinedRegex,
    valid: validation.valid,
    matchesSample: samples.every(s => new RegExp(combinedRegex).test(s)),
    warnings,
    segments: patterns[0].segments,
    suggestedName: 'multi-sample-pattern',
    error: validation.error,
  }
}

// Re-export utilities
export { tokenize, TokenType, type Token } from './tokenizer'
export {
  detectPatterns,
  mergeAdjacentPatterns,
  type PatternSegment,
} from './pattern-detector'
export {
  optimizeRegex,
  buildRegex,
  addWordBoundaries,
  validateRegex,
  analyzePattern,
  escapeRegex,
} from './optimizer'
