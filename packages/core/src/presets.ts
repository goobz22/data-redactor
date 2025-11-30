import type { RedactorConfig } from './types'

/**
 * Pre-defined configuration presets for common use cases
 */
export const PRESETS = {
  /**
   * Strict AI Compliance Preset
   * Maximum protection for data sent to AI/LLM systems
   * Enables all patterns and scenarios with token replacement
   */
  'strict-ai': {
    formatOptions: {
      tokenFormat: '[REDACTED_{TYPE}_{INDEX}]',
      maskChar: '*',
      preserveStructure: false,
    },
    patterns: {
      // All PII
      email: { enabled: true, strategy: 'token' as const },
      phone: { enabled: true, strategy: 'token' as const },
      ssn: { enabled: true, strategy: 'token' as const },
      name: { enabled: true, strategy: 'token' as const },
      // All Financial
      creditCard: { enabled: true, strategy: 'token' as const },
      creditCardLast4: { enabled: true, strategy: 'token' as const },
      // All System
      uuid: { enabled: true, strategy: 'token' as const },
      filePath: { enabled: true, strategy: 'token' as const },
      ipv4: { enabled: true, strategy: 'token' as const },
      ipv6: { enabled: true, strategy: 'token' as const },
      macAddress: { enabled: true, strategy: 'token' as const },
      hostname: { enabled: true, strategy: 'token' as const },
      // Business
      ticketNumber: { enabled: true, strategy: 'token' as const },
    },
    scenarios: {
      authHeader: { enabled: true, strategy: 'token' as const },
      password: { enabled: true, strategy: 'token' as const },
      apiKey: { enabled: true, strategy: 'token' as const },
      connectionString: { enabled: true, strategy: 'token' as const },
      privateKey: { enabled: true, strategy: 'token' as const },
      awsCredentials: { enabled: true, strategy: 'token' as const },
    },
  },

  /**
   * Minimal Preset
   * Basic PII protection - only email and phone
   */
  minimal: {
    formatOptions: {
      tokenFormat: '[{TYPE}_{INDEX}]',
      maskChar: '*',
      preserveStructure: true,
    },
    patterns: {
      email: { enabled: true, strategy: 'token' as const },
      phone: { enabled: true, strategy: 'token' as const },
      ssn: { enabled: false, strategy: 'token' as const },
      name: { enabled: false, strategy: 'token' as const },
      creditCard: { enabled: false, strategy: 'token' as const },
      creditCardLast4: { enabled: false, strategy: 'token' as const },
      uuid: { enabled: false, strategy: 'token' as const },
      filePath: { enabled: false, strategy: 'token' as const },
      ipv4: { enabled: false, strategy: 'token' as const },
      ipv6: { enabled: false, strategy: 'token' as const },
      macAddress: { enabled: false, strategy: 'token' as const },
      hostname: { enabled: false, strategy: 'token' as const },
      ticketNumber: { enabled: false, strategy: 'token' as const },
    },
    scenarios: {
      authHeader: { enabled: false, strategy: 'token' as const },
      password: { enabled: false, strategy: 'token' as const },
      apiKey: { enabled: false, strategy: 'token' as const },
      connectionString: { enabled: false, strategy: 'token' as const },
      privateKey: { enabled: false, strategy: 'token' as const },
      awsCredentials: { enabled: false, strategy: 'token' as const },
    },
  },

  /**
   * Logs Preset
   * Optimized for log file redaction
   * Uses format-preserving for IPs/hostnames to maintain log readability
   */
  logs: {
    formatOptions: {
      tokenFormat: '[{TYPE}_{INDEX}]',
      maskChar: '*',
      preserveStructure: true,
    },
    patterns: {
      email: { enabled: true, strategy: 'token' as const },
      phone: { enabled: false, strategy: 'token' as const },
      ssn: { enabled: false, strategy: 'token' as const },
      name: { enabled: false, strategy: 'token' as const },
      creditCard: { enabled: false, strategy: 'token' as const },
      creditCardLast4: { enabled: false, strategy: 'token' as const },
      uuid: { enabled: true, strategy: 'token' as const },
      filePath: { enabled: true, strategy: 'token' as const },
      ipv4: { enabled: true, strategy: 'formatPreserving' as const },
      ipv6: { enabled: true, strategy: 'formatPreserving' as const },
      macAddress: { enabled: true, strategy: 'formatPreserving' as const },
      hostname: { enabled: true, strategy: 'formatPreserving' as const },
      ticketNumber: { enabled: true, strategy: 'token' as const },
    },
    scenarios: {
      authHeader: { enabled: true, strategy: 'token' as const },
      password: { enabled: true, strategy: 'token' as const },
      apiKey: { enabled: true, strategy: 'token' as const },
      connectionString: { enabled: true, strategy: 'token' as const },
      privateKey: { enabled: true, strategy: 'token' as const },
      awsCredentials: { enabled: true, strategy: 'token' as const },
    },
  },

  /**
   * Financial Preset
   * Focus on financial data protection
   */
  financial: {
    formatOptions: {
      tokenFormat: '[{TYPE}_{INDEX}]',
      maskChar: '*',
      preserveStructure: true,
    },
    patterns: {
      email: { enabled: true, strategy: 'token' as const },
      phone: { enabled: true, strategy: 'token' as const },
      ssn: { enabled: true, strategy: 'token' as const },
      name: { enabled: true, strategy: 'token' as const },
      creditCard: { enabled: true, strategy: 'mask' as const },
      creditCardLast4: { enabled: true, strategy: 'token' as const },
      uuid: { enabled: false, strategy: 'token' as const },
      filePath: { enabled: false, strategy: 'token' as const },
      ipv4: { enabled: false, strategy: 'token' as const },
      ipv6: { enabled: false, strategy: 'token' as const },
      macAddress: { enabled: false, strategy: 'token' as const },
      hostname: { enabled: false, strategy: 'token' as const },
      ticketNumber: { enabled: true, strategy: 'token' as const },
    },
    scenarios: {
      authHeader: { enabled: false, strategy: 'token' as const },
      password: { enabled: false, strategy: 'token' as const },
      apiKey: { enabled: false, strategy: 'token' as const },
      connectionString: { enabled: false, strategy: 'token' as const },
      privateKey: { enabled: false, strategy: 'token' as const },
      awsCredentials: { enabled: false, strategy: 'token' as const },
    },
  },

  /**
   * Healthcare Preset
   * HIPAA-focused protection
   */
  healthcare: {
    formatOptions: {
      tokenFormat: '[PHI_{TYPE}_{INDEX}]',
      maskChar: '*',
      preserveStructure: false,
    },
    patterns: {
      email: { enabled: true, strategy: 'token' as const },
      phone: { enabled: true, strategy: 'token' as const },
      ssn: { enabled: true, strategy: 'token' as const },
      name: { enabled: true, strategy: 'token' as const },
      creditCard: { enabled: true, strategy: 'token' as const },
      creditCardLast4: { enabled: true, strategy: 'token' as const },
      uuid: { enabled: true, strategy: 'token' as const },
      filePath: { enabled: true, strategy: 'token' as const },
      ipv4: { enabled: true, strategy: 'token' as const },
      ipv6: { enabled: true, strategy: 'token' as const },
      macAddress: { enabled: true, strategy: 'token' as const },
      hostname: { enabled: true, strategy: 'token' as const },
      ticketNumber: { enabled: true, strategy: 'token' as const },
    },
    scenarios: {
      authHeader: { enabled: true, strategy: 'token' as const },
      password: { enabled: true, strategy: 'token' as const },
      apiKey: { enabled: true, strategy: 'token' as const },
      connectionString: { enabled: true, strategy: 'token' as const },
      privateKey: { enabled: true, strategy: 'token' as const },
      awsCredentials: { enabled: true, strategy: 'token' as const },
    },
  },
} as const

export type PresetName = keyof typeof PRESETS

/**
 * Get a preset configuration by name
 * @param name The preset name
 * @returns A partial RedactorConfig that can be passed to DataRedactor
 */
export function getPreset(name: PresetName): Partial<RedactorConfig> {
  const preset = PRESETS[name]
  // Deep clone to prevent mutation
  return JSON.parse(JSON.stringify(preset))
}

/**
 * Get all available preset names
 * @returns Array of preset names
 */
export function getPresetNames(): PresetName[] {
  return Object.keys(PRESETS) as PresetName[]
}

/**
 * Check if a preset exists
 * @param name The preset name to check
 * @returns True if the preset exists
 */
export function hasPreset(name: string): name is PresetName {
  return name in PRESETS
}
