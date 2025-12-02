/**
 * Pattern Testing Engine
 *
 * Executes test samples against patterns and validates results
 */

import { Pattern, TestSample, PatternTestResult, ExpectedMatch } from '../types'

export class PatternTestEngine {
  /**
   * Execute a pattern against a test sample
   *
   * @param pattern - The pattern to test
   * @param sample - The test sample to run
   * @returns Test result with accuracy metrics
   */
  static executeTest(pattern: Pattern, sample: TestSample): PatternTestResult {
    // Find all matches in the sample content
    const matches = pattern.findAll(sample.content)
    const matchedValues = matches.map(m => m.value)

    // Find false positives (matched but shouldn't have)
    const falsePositives: string[] = []
    matchedValues.forEach(value => {
      const expected = sample.expectedMatches.find(e => e.value === value)
      if (expected && !expected.shouldMatch) {
        falsePositives.push(value)
      } else if (!expected) {
        // Matched something not in expected list - check if it overlaps with any expected match
        const hasExpectedMatch = sample.expectedMatches.some(e => e.shouldMatch)
        if (hasExpectedMatch) {
          // Only count as false positive if we have positive expectations
          falsePositives.push(value)
        }
      }
    })

    // Find false negatives (missed but should have matched)
    const falseNegatives: string[] = []
    sample.expectedMatches.forEach(expected => {
      if (expected.shouldMatch && !matchedValues.includes(expected.value)) {
        falseNegatives.push(expected.value)
      }
    })

    // Calculate accuracy
    const totalExpected = sample.expectedMatches.filter(
      e => e.shouldMatch
    ).length
    const totalNegatives = sample.expectedMatches.filter(
      e => !e.shouldMatch
    ).length

    let accuracy = 100

    if (totalExpected > 0 || totalNegatives > 0) {
      // Correct matches = total positive expectations - false negatives
      const correctMatches = Math.max(0, totalExpected - falseNegatives.length)

      // Correct non-matches = total negative expectations - false positives (of negatives)
      const falsePositivesOfNegatives = falsePositives.filter(fp => {
        const expected = sample.expectedMatches.find(e => e.value === fp)
        return expected && !expected.shouldMatch
      }).length
      const correctNonMatches = Math.max(
        0,
        totalNegatives - falsePositivesOfNegatives
      )

      // Calculate overall accuracy
      const totalTests = totalExpected + totalNegatives
      const correctTests = correctMatches + correctNonMatches
      accuracy =
        totalTests > 0 ? Math.round((correctTests / totalTests) * 100) : 100
    }

    const passed = falsePositives.length === 0 && falseNegatives.length === 0

    return {
      patternName: pattern.name,
      sampleId: sample.id,
      passed,
      expectedCount: totalExpected,
      actualCount: matchedValues.length,
      falsePositives,
      falseNegatives,
      accuracy,
    }
  }

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
  ): PatternTestResult[] {
    return samples.map(sample => this.executeTest(pattern, sample))
  }

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
  } {
    if (results.length === 0) {
      return {
        totalTests: 0,
        passed: 0,
        failed: 0,
        averageAccuracy: 0,
        totalFalsePositives: 0,
        totalFalseNegatives: 0,
      }
    }

    const totalTests = results.length
    const passed = results.filter(r => r.passed).length
    const failed = totalTests - passed
    const averageAccuracy =
      results.reduce((sum, r) => sum + r.accuracy, 0) / totalTests
    const totalFalsePositives = results.reduce(
      (sum, r) => sum + r.falsePositives.length,
      0
    )
    const totalFalseNegatives = results.reduce(
      (sum, r) => sum + r.falseNegatives.length,
      0
    )

    return {
      totalTests,
      passed,
      failed,
      averageAccuracy: Math.round(averageAccuracy),
      totalFalsePositives,
      totalFalseNegatives,
    }
  }
}
