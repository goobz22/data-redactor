import type { Match, RedactionStrategy } from '../types'

export interface Scenario {
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
export class BaseScenario implements Scenario {
  name: string
  pattern: RegExp
  captureGroup: number
  strategy: RedactionStrategy
  enabled: boolean

  constructor(
    name: string,
    pattern: RegExp,
    captureGroup: number = 1,
    strategy: RedactionStrategy = 'token',
    enabled: boolean = true
  ) {
    this.name = name
    this.pattern = pattern
    this.captureGroup = captureGroup
    this.strategy = strategy
    this.enabled = enabled
  }

  findAll(text: string): Match[] {
    if (!this.enabled) return []

    const matches: Match[] = []
    const regex = new RegExp(
      this.pattern.source,
      'g' + this.pattern.flags.replace('g', '')
    )
    let match

    while ((match = regex.exec(text)) !== null) {
      // Get the captured group (the sensitive value)
      const capturedValue = match[this.captureGroup]
      if (capturedValue) {
        // Calculate the start position of the captured group
        const fullMatch = match[0]
        const captureStart = match.index + fullMatch.indexOf(capturedValue)

        matches.push({
          value: capturedValue,
          start: captureStart,
          end: captureStart + capturedValue.length,
          type: this.name,
          strategy: this.strategy,
        })
      }
    }

    return matches
  }

  setStrategy(strategy: RedactionStrategy): void {
    this.strategy = strategy
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled
  }
}

/**
 * Authorization Header Scenario
 * Matches: "Authorization: Bearer <token>" or "Authorization: Basic <token>"
 */
export class AuthorizationHeaderScenario extends BaseScenario {
  constructor(strategy: RedactionStrategy = 'token', enabled: boolean = true) {
    super(
      'authHeader',
      /Authorization:\s*(?:Bearer|Basic)\s+([^\s\r\n]+)/gi,
      1,
      strategy,
      enabled
    )
  }
}

/**
 * Password Scenario
 * Matches: "password = value", "passwd: value", "pwd=value"
 */
export class PasswordScenario extends BaseScenario {
  constructor(strategy: RedactionStrategy = 'token', enabled: boolean = true) {
    super(
      'password',
      /(?:password|passwd|pwd)\s*[:=]\s*["']?([^\s"'\r\n,;]+)["']?/gi,
      1,
      strategy,
      enabled
    )
  }
}

/**
 * API Key Scenario
 * Matches: "api_key = value", "apikey: value", "secret_key=value"
 */
export class ApiKeyScenario extends BaseScenario {
  constructor(strategy: RedactionStrategy = 'token', enabled: boolean = true) {
    super(
      'apiKey',
      /(?:api[_-]?key|apikey|secret[_-]?key|access[_-]?key)\s*[:=]\s*["']?([^\s"'\r\n,;]+)["']?/gi,
      1,
      strategy,
      enabled
    )
  }
}

/**
 * Connection String Scenario
 * Matches database connection strings with passwords
 */
export class ConnectionStringScenario extends BaseScenario {
  constructor(strategy: RedactionStrategy = 'token', enabled: boolean = true) {
    super(
      'connectionString',
      /(?:mongodb|postgres|mysql|redis|amqp):\/\/[^:]+:([^@]+)@/gi,
      1,
      strategy,
      enabled
    )
  }
}

/**
 * Private Key Scenario
 * Matches: "-----BEGIN PRIVATE KEY-----...-----END PRIVATE KEY-----"
 */
export class PrivateKeyScenario extends BaseScenario {
  constructor(strategy: RedactionStrategy = 'token', enabled: boolean = true) {
    super(
      'privateKey',
      /(-----BEGIN (?:RSA |EC |DSA )?PRIVATE KEY-----[\s\S]*?-----END (?:RSA |EC |DSA )?PRIVATE KEY-----)/gi,
      1,
      strategy,
      enabled
    )
  }
}

/**
 * AWS Credentials Scenario
 * Matches AWS access keys and secret keys
 */
export class AWSCredentialsScenario extends BaseScenario {
  constructor(strategy: RedactionStrategy = 'token', enabled: boolean = true) {
    super(
      'awsCredentials',
      /(?:aws[_-]?(?:access[_-]?key[_-]?id|secret[_-]?access[_-]?key))\s*[:=]\s*["']?([A-Za-z0-9\/+=]+)["']?/gi,
      1,
      strategy,
      enabled
    )
  }
}
