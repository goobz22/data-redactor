export { DataRedactor } from './engine'
export { ConfigLoader, DEFAULT_CONFIG } from './config'
export { PRESETS, getPreset, getPresetNames, hasPreset } from './presets'
export type { PresetName } from './presets'
export * from './types'
export * from './patterns'
export * from './strategies'
export * from './scenarios'
export * from './regex-builder'

// Testing & Validation
export * from './testing'
export {
  ALL_TEST_SAMPLES,
  getTestSample,
  getTestSamplesForPattern,
  getAllTestSampleIds,
  getTestSamplesByCategory,
} from './test-samples'
