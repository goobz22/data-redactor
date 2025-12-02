/**
 * Quality Score Calculator
 *
 * Calculates a 0-100 quality score for patterns based on:
 * - Test coverage (50 points max)
 * - Accuracy (30 points max)
 * - Edge case handling (20 points max)
 */

import { PatternTestResult } from '../types'

export interface QualityScoreBreakdown {
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
export function calculateQualityScore(
  testResults: PatternTestResult[],
  knownIssues: number = 0
): QualityScoreBreakdown {
  if (testResults.length === 0) {
    return {
      totalScore: 0,
      coverageScore: 0,
      accuracyScore: 0,
      edgeCaseScore: 0,
      details: {
        testCount: 0,
        averageAccuracy: 0,
        knownIssues,
      },
    }
  }

  // 1. Test Coverage Score (50 points max)
  // Each test adds 10 points, max of 5 tests = 50 points
  const coverageScore = Math.min(testResults.length * 10, 50)

  // 2. Accuracy Score (30 points max)
  // Average accuracy of all tests, scaled to 30 points
  const averageAccuracy =
    testResults.reduce((sum, r) => sum + r.accuracy, 0) / testResults.length
  const accuracyScore = Math.round((averageAccuracy / 100) * 30)

  // 3. Edge Case Score (20 points max)
  // Deduct 5 points per open issue, down to 0
  const issueDeduction = Math.min(knownIssues * 5, 20)
  const edgeCaseScore = 20 - issueDeduction

  // Total Score
  const totalScore = Math.round(coverageScore + accuracyScore + edgeCaseScore)

  return {
    totalScore,
    coverageScore,
    accuracyScore,
    edgeCaseScore,
    details: {
      testCount: testResults.length,
      averageAccuracy: Math.round(averageAccuracy),
      knownIssues,
    },
  }
}

/**
 * Get quality tier based on score
 */
export function getQualityTier(
  score: number
): 'excellent' | 'good' | 'fair' | 'poor' | 'untested' {
  if (score === 0) return 'untested'
  if (score >= 90) return 'excellent'
  if (score >= 75) return 'good'
  if (score >= 60) return 'fair'
  return 'poor'
}

/**
 * Get quality tier color for UI display
 */
export function getQualityTierColor(
  tier: ReturnType<typeof getQualityTier>
): string {
  switch (tier) {
    case 'excellent':
      return 'green'
    case 'good':
      return 'lightgreen'
    case 'fair':
      return 'yellow'
    case 'poor':
      return 'orange'
    case 'untested':
      return 'gray'
  }
}

/**
 * Get quality tier badge label
 */
export function getQualityTierLabel(
  tier: ReturnType<typeof getQualityTier>
): string {
  switch (tier) {
    case 'excellent':
      return '✓ Excellent'
    case 'good':
      return '✓ Good'
    case 'fair':
      return '~ Fair'
    case 'poor':
      return '⚠ Poor'
    case 'untested':
      return '? Untested'
  }
}

/**
 * Get recommendations based on quality score breakdown
 */
export function getRecommendations(breakdown: QualityScoreBreakdown): string[] {
  const recommendations: string[] = []

  // Coverage recommendations
  if (breakdown.details.testCount < 5) {
    recommendations.push(
      `Add ${5 - breakdown.details.testCount} more test samples to improve coverage`
    )
  }

  // Accuracy recommendations
  if (breakdown.details.averageAccuracy < 80) {
    recommendations.push('Review regex pattern - accuracy is below 80%')
  }

  if (breakdown.details.averageAccuracy < 60) {
    recommendations.push(
      'Critical: Pattern has significant accuracy issues - immediate review needed'
    )
  }

  // Edge case recommendations
  if (breakdown.details.knownIssues > 0) {
    recommendations.push(
      `Address ${breakdown.details.knownIssues} open edge case report${breakdown.details.knownIssues > 1 ? 's' : ''}`
    )
  }

  if (breakdown.details.knownIssues > 3) {
    recommendations.push(
      'High number of edge cases - consider pattern redesign'
    )
  }

  // Perfect score
  if (breakdown.totalScore === 100) {
    recommendations.push('Pattern is performing excellently!')
  }

  return recommendations
}
