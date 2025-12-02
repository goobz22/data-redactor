/**
 * Testing Module
 *
 * Exports testing engine, quality score calculator, and utilities
 */

export { PatternTestEngine } from './engine'
export {
  calculateQualityScore,
  getQualityTier,
  getQualityTierColor,
  getQualityTierLabel,
  getRecommendations,
  type QualityScoreBreakdown,
} from './quality-score'
