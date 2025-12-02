var __require = /* @__PURE__ */ (x =>
  typeof require !== 'undefined'
    ? require
    : typeof Proxy !== 'undefined'
      ? new Proxy(x, {
          get: (a, b) => (typeof require !== 'undefined' ? require : a)[b],
        })
      : x)(function (x) {
  if (typeof require !== 'undefined') return require.apply(this, arguments)
  throw Error('Dynamic require of "' + x + '" is not supported')
})

// packages/core/src/config.ts
var DEFAULT_CONFIG = {
  formatOptions: {
    tokenFormat: '[{TYPE}_{INDEX}]',
    maskChar: '*',
    preserveStructure: true,
  },
  patterns: {
    ipv4: {
      enabled: true,
      strategy: 'token',
      regex:
        '(?<![0-9])(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:/\\d{1,2})?(?![0-9])',
      testSampleIds: [
        'ipv4-apache-log',
        'ipv4-cidr-notation',
        'ipv4-false-positives',
        'ipv4-docker-networks',
        'ipv4-kubernetes-pods',
      ],
      qualityScore: 0,
      knownIssues: 0,
      lastTested: void 0,
    },
    ipv6: {
      enabled: true,
      strategy: 'token',
      regex: '(?:[0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}',
      testSampleIds: [
        'ipv6-standard',
        'ipv6-compressed',
        'ipv6-network-config',
        'ipv6-mixed',
        'ipv6-false-positives',
      ],
      qualityScore: 0,
      knownIssues: 0,
      lastTested: void 0,
    },
    macAddress: {
      enabled: true,
      strategy: 'token',
      regex:
        '(?:(?:[0-9A-Fa-f]{2}[:-]){5}[0-9A-Fa-f]{2})|(?:(?:[0-9A-Fa-f]{4}\\.){2}[0-9A-Fa-f]{4})',
      testSampleIds: [
        'mac-address-colon-format',
        'mac-address-dash-format',
        'mac-address-cisco-format',
        'mac-address-lowercase',
        'mac-address-network-config',
      ],
      qualityScore: 0,
      knownIssues: 0,
      lastTested: void 0,
    },
    email: {
      enabled: true,
      strategy: 'token',
      regex: '\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b',
      testSampleIds: [
        'email-standard-formats',
        'email-plus-addressing',
        'email-international',
        'email-false-positives',
        'email-edge-cases',
      ],
      qualityScore: 0,
      knownIssues: 0,
      lastTested: void 0,
    },
    phone: {
      enabled: true,
      strategy: 'token',
      regex:
        '(?<![A-Za-z0-9])(?:\\+?1[-\\.\\s]?)?(?:\\(\\d{3}\\)\\s?\\d{3}[-\\.\\s]?\\d{4}|\\(\\d{3}[-\\.\\s]?\\d{3}[-\\.\\s]?\\d{4}\\)|\\d{3}[-\\.\\s]?\\d{3}[-\\.\\s]?\\d{4}|\\d{3}[-\\.\\s]?[A-Za-z]{7}|\\d{3}[-\\.\\s]?[A-Za-z]{3}[-\\.\\s]?[A-Za-z]{4})(?![A-Za-z0-9])',
      testSampleIds: [
        'phone-us-formats',
        'phone-international',
        'phone-vanity-numbers',
        'phone-false-positives',
        'phone-parentheses',
      ],
      qualityScore: 0,
      knownIssues: 0,
      lastTested: void 0,
    },
    ssn: {
      enabled: true,
      strategy: 'token',
      regex: '\\b\\d{3}-\\d{2}-\\d{4}\\b',
      testSampleIds: [
        'ssn-standard-format',
        'ssn-false-positives',
        'ssn-context-aware',
        'ssn-masked',
        'ssn-edge-cases',
      ],
      qualityScore: 0,
      knownIssues: 0,
      lastTested: void 0,
    },
    creditCard: {
      enabled: true,
      strategy: 'token',
      regex:
        '(?<!\\d)(?:\\d{4}[-\\s]?){3,4}\\d{1,4}(?!\\d)|(?<!\\d)\\d{13,19}(?!\\d)',
      testSampleIds: [
        'credit-card-visa',
        'credit-card-mastercard',
        'credit-card-amex',
        'credit-card-no-spaces',
        'credit-card-false-positives',
      ],
      qualityScore: 0,
      knownIssues: 0,
      lastTested: void 0,
    },
    creditCardLast4: {
      enabled: true,
      strategy: 'token',
      regex:
        '(?:(?:card|payment|account)\\s+)?(?:ending\\s+in\\s+|ends\\s+in\\s+|last\\s+(?:4|four)(?:\\s+digits)?[\\s:]+)\\d{4}(?!\\d)|(?:\\*{4,})\\d{4}(?!\\d)',
      flags: 'i',
    },
    hostname: {
      enabled: true,
      strategy: 'token',
      regex:
        '\\b(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\\.)+[a-zA-Z]{2,}\\b',
      testSampleIds: [
        'hostname-fqdn',
        'hostname-subdomains',
        'hostname-urls',
        'hostname-dns-records',
        'hostname-false-positives',
      ],
      qualityScore: 0,
      knownIssues: 0,
      lastTested: void 0,
    },
    ticketNumber: {
      enabled: true,
      strategy: 'token',
      regex: '(?:ticket|case)\\s*[#:-]?\\s*\\d+',
      flags: 'i',
      testSampleIds: [
        'ticket-case-format',
        'ticket-ticket-hash',
        'ticket-jira-format',
        'ticket-support-logs',
        'ticket-false-positives',
      ],
      qualityScore: 0,
      knownIssues: 0,
      lastTested: void 0,
    },
    name: {
      enabled: true,
      strategy: 'token',
      // No default regex - built dynamically from name databases (8849 names)
      // Custom regex can be provided if needed
      testSampleIds: [
        'name-full-names',
        'name-first-only',
        'name-last-only',
        'name-support-tickets',
        'name-false-positives',
      ],
      qualityScore: 0,
      knownIssues: 0,
      lastTested: void 0,
    },
    uuid: {
      enabled: true,
      strategy: 'token',
      regex:
        '\\b[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\\b',
      testSampleIds: [
        'uuid-standard',
        'uuid-uppercase',
        'uuid-log-files',
        'uuid-api-responses',
        'uuid-false-positives',
      ],
      qualityScore: 0,
      knownIssues: 0,
      lastTested: void 0,
    },
    filePath: {
      enabled: true,
      strategy: 'token',
      regex:
        '(?:[A-Za-z]:\\\\(?:[^\\\\\\/:*?"<>|\\r\\n]+\\\\)*[^\\\\\\/:*?"<>|\\r\\n]*)|(?:\\/(?:[^\\s\\/\\0]+\\/)+[^\\s\\/\\0]*|\\/[^\\s\\/\\0]+)',
      testSampleIds: [
        'file-path-windows',
        'file-path-unix',
        'file-path-relative',
        'file-path-error-logs',
        'file-path-false-positives',
      ],
      qualityScore: 0,
      knownIssues: 0,
      lastTested: void 0,
    },
    custom: [],
  },
  scenarios: {
    authHeader: { enabled: true, strategy: 'token' },
    password: { enabled: true, strategy: 'token' },
    apiKey: { enabled: true, strategy: 'token' },
    connectionString: { enabled: true, strategy: 'token' },
    privateKey: { enabled: true, strategy: 'token' },
    awsCredentials: { enabled: true, strategy: 'token' },
  },
  customEntities: {},
  testData: `Support Ticket #12345

Customer Information:
- Name: John Doe
- Email: john.doe@company.com
- Phone: 555-123-4567
- Alt Phone: (555) 987-6543
- Mobile: 1-555-SUPPORT
- SSN: 123-45-6789

Network Details:
- IPv4: 192.168.1.100
- IPv6: 2001:0db8:85a3:0000:0000:8a2e:0370:7334
- MAC Address: 00-1B-44-11-3A-B8
- Gateway: 10.0.0.1
- DNS Server: 8.8.8.8
- Hostname: mail.example.com

System Details:
- Request ID: 550e8400-e29b-41d4-a716-446655440000
- Session UUID: a1b2c3d4-e5f6-7890-abcd-ef1234567890
- Config File: C:\\Users\\admin\\AppData\\config.json
- Log Path: /var/log/application/error.log
- Script: /home/user/scripts/deploy.sh

Credentials (Context-Aware):
- Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
- password = super_secret_123
- api_key: sk-1234567890abcdef
- DATABASE_URL: postgres://user:p@ssw0rd@localhost:5432/mydb
- AWS_SECRET_ACCESS_KEY = wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY

Payment Information:
- Primary Card: 4532-1234-5678-9010
- Backup Card: 5425233430109903
- Card ending in 9010
- AmEx: 378282246310005

Issue Description:
Customer contacted us from IP 203.0.113.45 regarding server api.internal.company.net connection issues.
Contact support@company.com or call 1-555-FLOWERS for assistance.`,
}
var ConfigLoader = class {
  static loadFromFile(path) {
    if (
      typeof process !== 'undefined' &&
      process.versions &&
      process.versions.node
    ) {
      try {
        const fs = __require('fs')
        const content = fs.readFileSync(path, 'utf-8')
        const config = JSON.parse(content)
        return this.mergeWithDefaults(config)
      } catch (error) {
        throw new Error(`Failed to load config from ${path}: ${error}`)
      }
    } else {
      throw new Error(
        'loadFromFile is only available in Node.js environments. Use loadFromObject instead.'
      )
    }
  }
  static loadFromObject(config) {
    return this.mergeWithDefaults(config)
  }
  static getDefault() {
    return JSON.parse(JSON.stringify(DEFAULT_CONFIG))
  }
  static mergeWithDefaults(config) {
    const merged = {
      patterns: {
        ...DEFAULT_CONFIG.patterns,
        ...config.patterns,
      },
      customEntities: {
        ...DEFAULT_CONFIG.customEntities,
        ...config.customEntities,
      },
    }
    return merged
  }
  static validateConfig(config) {
    const errors = []
    if (config.patterns) {
      const validStrategies = ['token', 'mask', 'formatPreserving']
      Object.entries(config.patterns).forEach(([key, value]) => {
        if (key === 'custom') {
          const customPatterns = value
          customPatterns?.forEach((pattern, index) => {
            if (!pattern.name) {
              errors.push(`Custom pattern at index ${index} is missing 'name'`)
            }
            if (!pattern.regex) {
              errors.push(`Custom pattern '${pattern.name}' is missing 'regex'`)
            }
            if (!validStrategies.includes(pattern.strategy)) {
              errors.push(
                `Custom pattern '${pattern.name}' has invalid strategy: ${pattern.strategy}`
              )
            }
            try {
              new RegExp(pattern.regex, pattern.flags || '')
            } catch (e) {
              errors.push(
                `Custom pattern '${pattern.name}' has invalid regex: ${e}`
              )
            }
          })
        } else {
          const patternConfig = value
          if (
            patternConfig &&
            !validStrategies.includes(patternConfig.strategy)
          ) {
            errors.push(
              `Pattern '${key}' has invalid strategy: ${patternConfig.strategy}`
            )
          }
        }
      })
    }
    return {
      valid: errors.length === 0,
      errors,
    }
  }
}

// packages/core/src/patterns/base.ts
var BasePattern = class {
  name
  regex
  strategy
  enabled
  constructor(name, regex, strategy = 'token', enabled = true) {
    this.name = name
    this.regex = regex
    this.strategy = strategy
    this.enabled = enabled
  }
  test(text) {
    return this.regex.test(text)
  }
  findAll(text) {
    if (!this.enabled) return []
    const matches = []
    const regex = new RegExp(
      this.regex.source,
      'g' + this.regex.flags.replace('g', '')
    )
    let match
    while ((match = regex.exec(text)) !== null) {
      matches.push({
        value: match[0],
        start: match.index,
        end: match.index + match[0].length,
        type: this.name,
        strategy: this.strategy,
      })
    }
    return matches
  }
  setStrategy(strategy) {
    this.strategy = strategy
  }
  setEnabled(enabled) {
    this.enabled = enabled
  }
}

// packages/core/src/patterns/network.ts
var IPv4Pattern = class extends BasePattern {
  constructor(strategy = 'token', enabled = true) {
    const regex =
      /(?<![0-9])(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:\/\d{1,2})?(?![0-9])/
    super('ipv4', regex, strategy, enabled)
  }
}
var IPv6Pattern = class extends BasePattern {
  constructor(strategy = 'token', enabled = true) {
    const regex = /(?:[0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}/
    super('ipv6', regex, strategy, enabled)
  }
  // Override findAll to expand :: shorthand before validating
  findAll(text) {
    console.log(
      '[IPv6Pattern] findAll called with text:',
      text.substring(0, 200)
    )
    const matches = []
    const regex = new RegExp(this.regex.source, 'g')
    let match
    while ((match = regex.exec(text)) !== null) {
      const potential = match[0]
      console.log(
        '[IPv6Pattern] Found potential match:',
        potential,
        'at index:',
        match.index
      )
      const isValid = this.isValidIPv6(potential)
      console.log('[IPv6Pattern] isValid:', isValid, 'for:', potential)
      if (isValid) {
        matches.push({
          value: potential,
          start: match.index,
          end: match.index + potential.length,
          type: this.name,
          strategy: this.strategy,
        })
        console.log('[IPv6Pattern] Added valid match:', potential)
      } else {
        console.log('[IPv6Pattern] Rejected invalid match:', potential)
      }
    }
    console.log('[IPv6Pattern] Total valid matches:', matches.length)
    return matches
  }
  isValidIPv6(addr) {
    console.log('[IPv6Pattern] Validating:', addr)
    const colonCount = (addr.match(/:/g) || []).length
    console.log('[IPv6Pattern] Colon count:', colonCount)
    if (colonCount < 2) {
      console.log('[IPv6Pattern] Validation failed: too few colons')
      return false
    }
    const doubleColonCount = (addr.match(/::/g) || []).length
    console.log('[IPv6Pattern] Double colon count:', doubleColonCount)
    if (doubleColonCount > 1) {
      console.log('[IPv6Pattern] Validation failed: multiple ::')
      return false
    }
    try {
      const expanded = this.expandIPv6(addr)
      console.log('[IPv6Pattern] Expanded to:', expanded)
      const groups = expanded.split(':')
      console.log('[IPv6Pattern] Groups:', groups, 'count:', groups.length)
      if (groups.length !== 8) {
        console.log('[IPv6Pattern] Validation failed: not 8 groups')
        return false
      }
      const allValid = groups.every(g => /^[0-9a-fA-F]{1,4}$/.test(g))
      console.log('[IPv6Pattern] All groups valid hex:', allValid)
      return allValid
    } catch (e) {
      console.log('[IPv6Pattern] Validation failed with error:', e)
      return false
    }
  }
  expandIPv6(addr) {
    console.log('[IPv6Pattern] Expanding:', addr)
    if (!addr.includes('::')) {
      console.log('[IPv6Pattern] No :: found, returning as-is')
      return addr
    }
    const sides = addr.split('::')
    console.log('[IPv6Pattern] Split on ::', sides)
    if (sides.length !== 2) {
      console.log('[IPv6Pattern] Invalid split length:', sides.length)
      return addr
    }
    const left = sides[0] ? sides[0].split(':') : []
    const right = sides[1] ? sides[1].split(':') : []
    console.log('[IPv6Pattern] Left groups:', left, 'Right groups:', right)
    const totalGroups = 8
    const existingGroups = left.length + right.length
    const zeroGroups = totalGroups - existingGroups
    console.log(
      '[IPv6Pattern] Existing groups:',
      existingGroups,
      'Zero groups needed:',
      zeroGroups
    )
    const zeros = Array(zeroGroups).fill('0')
    const expanded = [...left, ...zeros, ...right]
    console.log('[IPv6Pattern] Expanded array:', expanded)
    const result = expanded.join(':')
    console.log('[IPv6Pattern] Final expanded result:', result)
    return result
  }
}
var MACAddressPattern = class extends BasePattern {
  constructor(strategy = 'token', enabled = true) {
    const regex =
      /(?:(?:[0-9A-Fa-f]{2}[:-]){5}[0-9A-Fa-f]{2})|(?:(?:[0-9A-Fa-f]{4}\.){2}[0-9A-Fa-f]{4})/
    super('macAddress', regex, strategy, enabled)
  }
}
var HostnamePattern = class extends BasePattern {
  constructor(strategy = 'token', enabled = true) {
    const regex =
      /\b(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}\b/
    super('hostname', regex, strategy, enabled)
  }
}

// packages/core/src/patterns/personal.ts
import maleNamesData from 'datasets-male-first-names-en'
import femaleNamesData from 'datasets-female-first-names-en'
import * as lastNamesModule from 'common-last-names'
var maleNames = maleNamesData || []
var femaleNames = femaleNamesData || []
var lastNames = lastNamesModule.all || []
var EmailPattern = class extends BasePattern {
  constructor(strategy = 'token', enabled = true) {
    const regex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/
    super('email', regex, strategy, enabled)
  }
}
var PhonePattern = class extends BasePattern {
  constructor(strategy = 'token', enabled = true) {
    const regex =
      /(?<![A-Za-z0-9])(?:\+?1[-.\s]?)?(?:\(\d{3}\)\s?\d{3}[-.\s]?\d{4}|\(\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\)|\d{3}[-.\s]?\d{3}[-.\s]?\d{4}|\d{3}[-.\s]?[A-Za-z]{7}|\d{3}[-.\s]?[A-Za-z]{3}[-.\s]?[A-Za-z]{4})(?![A-Za-z0-9])/
    super('phone', regex, strategy, enabled)
  }
}
var SSNPattern = class extends BasePattern {
  constructor(strategy = 'token', enabled = true) {
    const regex = /\b\d{3}-\d{2}-\d{4}\b/
    super('ssn', regex, strategy, enabled)
  }
}
var NamePattern = class extends BasePattern {
  constructor(strategy = 'token', enabled = true) {
    const allFirstNames = [...maleNames, ...femaleNames]
    const allNames = [...allFirstNames, ...lastNames]
    const escapedNames = allNames.map(name =>
      name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    )
    escapedNames.sort((a, b) => b.length - a.length)
    const namesPattern = escapedNames.join('|')
    const regex = new RegExp(
      `\\b(?:${namesPattern})(?:\\s+(?:${namesPattern}))?\\b`,
      'i'
    )
    super('name', regex, strategy, enabled)
  }
}

// packages/core/src/patterns/financial.ts
var CreditCardPattern = class extends BasePattern {
  constructor(strategy = 'token', enabled = true) {
    const regex =
      /(?<!\d)(?:\d{4}[-\s]?){3,4}\d{1,4}(?!\d)|(?<!\d)\d{13,19}(?!\d)/
    super('creditCard', regex, strategy, enabled)
  }
}
var CreditCardLast4Pattern = class extends BasePattern {
  constructor(strategy = 'token', enabled = true) {
    const regex =
      /(?:(?:card|payment|account)\s+)?(?:ending\s+in\s+|ends\s+in\s+|last\s+(?:4|four)(?:\s+digits)?[\s:]+)\d{4}(?!\d)|(?:\*{4,})\d{4}(?!\d)/i
    super('creditCardLast4', regex, strategy, enabled)
  }
}

// packages/core/src/patterns/business.ts
var TicketNumberPattern = class extends BasePattern {
  constructor(strategy = 'token', enabled = true) {
    const regex = /(?:ticket|case)\s*[#:-]?\s*\d+/i
    super('ticketNumber', regex, strategy, enabled)
  }
}

// packages/core/src/patterns/system.ts
var UUIDPattern = class extends BasePattern {
  constructor(strategy = 'token', enabled = true) {
    const regex =
      /\b[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\b/g
    super('uuid', regex, strategy, enabled)
  }
}
var FilePathPattern = class extends BasePattern {
  constructor(strategy = 'token', enabled = true) {
    const regex =
      /(?:[A-Za-z]:\\(?:[^\\\/:*?"<>|\r\n]+\\)*[^\\\/:*?"<>|\r\n]*)|(?:\/(?:[^\s\/\0]+\/)+[^\s\/\0]*|\/[^\s\/\0]+)/g
    super('filePath', regex, strategy, enabled)
  }
}

// packages/core/src/strategies/base.ts
var RedactionContext = class {
  valueMap = /* @__PURE__ */ new Map()
  counters = /* @__PURE__ */ new Map()
  getOrCreateRedaction(value, type, strategy) {
    const key = `${type}:${value}`
    if (this.valueMap.has(key)) {
      return this.valueMap.get(key)
    }
    const counter = (this.counters.get(type) || 0) + 1
    this.counters.set(type, counter)
    const redacted = strategy.redact(value, type, counter)
    this.valueMap.set(key, redacted)
    return redacted
  }
  getMapping() {
    const mapping = {}
    this.valueMap.forEach((redacted, key) => {
      const [, original] = key.split(':', 2)
      mapping[original] = redacted
    })
    return mapping
  }
  clear() {
    this.valueMap.clear()
    this.counters.clear()
  }
}

// packages/core/src/strategies/token.ts
var TokenStrategy = class {
  tokenFormat
  constructor(formatOptions) {
    this.tokenFormat = formatOptions?.tokenFormat || '[{TYPE}_{INDEX}]'
  }
  redact(value, type, counter) {
    const typeUpper = type
      .toUpperCase()
      .replace(/([A-Z])/g, '_$1')
      .replace(/^_/, '')
    return this.tokenFormat
      .replace(/\{TYPE\}/g, typeUpper)
      .replace(/\{INDEX\}/g, counter.toString())
  }
}

// packages/core/src/strategies/mask.ts
var MaskStrategy = class {
  maskChar
  preserveStructure
  constructor(formatOptions) {
    this.maskChar = formatOptions?.maskChar || '*'
    this.preserveStructure = formatOptions?.preserveStructure !== false
  }
  redact(value, type, counter) {
    if (!this.preserveStructure) {
      return this.maskChar.repeat(value.length)
    }
    return value.replace(/[a-zA-Z0-9]/g, this.maskChar)
  }
}

// packages/core/src/strategies/formatPreserving.ts
var FormatPreservingStrategy = class {
  seed = 12345
  constructor(formatOptions) {}
  redact(value, type, counter) {
    const hash = this.hashString(value + counter)
    switch (type) {
      case 'ipv4':
        return this.generateIPv4(hash)
      case 'macAddress':
        return this.generateMAC(hash, value)
      case 'email':
        return this.generateEmail(hash)
      case 'phone':
        return this.generatePhone(hash)
      case 'ssn':
        return this.generateSSN(hash)
      case 'creditCard':
        return this.generateCreditCard(hash)
      case 'hostname':
        return this.generateHostname(hash)
      default:
        return `REDACTED_${counter}`
    }
  }
  hashString(str) {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash
    }
    return Math.abs(hash)
  }
  seededRandom(seed) {
    const x = Math.sin(seed++) * 1e4
    return x - Math.floor(x)
  }
  generateIPv4(seed) {
    const octets = [10]
    for (let i = 0; i < 3; i++) {
      octets.push(Math.floor(this.seededRandom(seed + i) * 256))
    }
    return octets.join('.')
  }
  generateMAC(seed, original) {
    let separator = ':'
    if (original.includes('-')) separator = '-'
    else if (original.includes('.')) separator = '.'
    const hex = '0123456789ABCDEF'
    const parts = []
    if (separator === '.') {
      for (let i = 0; i < 3; i++) {
        let part = ''
        for (let j = 0; j < 4; j++) {
          part += hex[Math.floor(this.seededRandom(seed + i * 4 + j) * 16)]
        }
        parts.push(part)
      }
      return parts.join('.')
    } else {
      for (let i = 0; i < 6; i++) {
        let part = ''
        for (let j = 0; j < 2; j++) {
          part += hex[Math.floor(this.seededRandom(seed + i * 2 + j) * 16)]
        }
        parts.push(part)
      }
      return parts.join(separator)
    }
  }
  generateEmail(seed) {
    const userLength = 5 + Math.floor(this.seededRandom(seed) * 8)
    const user = this.generateRandomString(seed, userLength)
    const domains = ['example.com', 'test.com', 'sample.org', 'demo.net']
    const domain =
      domains[Math.floor(this.seededRandom(seed + 1e3) * domains.length)]
    return `${user}@${domain}`
  }
  generatePhone(seed) {
    const area = 200 + Math.floor(this.seededRandom(seed) * 800)
    const exchange = 200 + Math.floor(this.seededRandom(seed + 1) * 800)
    const number = Math.floor(this.seededRandom(seed + 2) * 1e4)
    return `${area}-${exchange}-${number.toString().padStart(4, '0')}`
  }
  generateSSN(seed) {
    const area = 100 + Math.floor(this.seededRandom(seed) * 900)
    const group = 10 + Math.floor(this.seededRandom(seed + 1) * 90)
    const serial = 1e3 + Math.floor(this.seededRandom(seed + 2) * 9e3)
    return `${area}-${group.toString().padStart(2, '0')}-${serial}`
  }
  generateCreditCard(seed) {
    let card = '4'
    for (let i = 0; i < 15; i++) {
      card += Math.floor(this.seededRandom(seed + i) * 10)
    }
    return card.match(/.{1,4}/g)?.join(' ') || card
  }
  generateHostname(seed) {
    const length = 5 + Math.floor(this.seededRandom(seed) * 8)
    const name = this.generateRandomString(seed, length)
    const tlds = ['com', 'net', 'org', 'io']
    const tld = tlds[Math.floor(this.seededRandom(seed + 1e3) * tlds.length)]
    return `${name}.${tld}`
  }
  generateRandomString(seed, length) {
    const chars = 'abcdefghijklmnopqrstuvwxyz'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars[Math.floor(this.seededRandom(seed + i) * chars.length)]
    }
    return result
  }
}

// packages/core/src/scenarios/base.ts
var BaseScenario = class {
  name
  pattern
  captureGroup
  strategy
  enabled
  constructor(
    name,
    pattern,
    captureGroup = 1,
    strategy = 'token',
    enabled = true
  ) {
    this.name = name
    this.pattern = pattern
    this.captureGroup = captureGroup
    this.strategy = strategy
    this.enabled = enabled
  }
  findAll(text) {
    if (!this.enabled) return []
    const matches = []
    const regex = new RegExp(
      this.pattern.source,
      'g' + this.pattern.flags.replace('g', '')
    )
    let match
    while ((match = regex.exec(text)) !== null) {
      const capturedValue = match[this.captureGroup]
      if (capturedValue) {
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
  setStrategy(strategy) {
    this.strategy = strategy
  }
  setEnabled(enabled) {
    this.enabled = enabled
  }
}
var AuthorizationHeaderScenario = class extends BaseScenario {
  constructor(strategy = 'token', enabled = true) {
    super(
      'authHeader',
      /Authorization:\s*(?:Bearer|Basic)\s+([^\s\r\n]+)/gi,
      1,
      strategy,
      enabled
    )
  }
}
var PasswordScenario = class extends BaseScenario {
  constructor(strategy = 'token', enabled = true) {
    super(
      'password',
      /(?:password|passwd|pwd)\s*[:=]\s*["']?([^\s"'\r\n,;]+)["']?/gi,
      1,
      strategy,
      enabled
    )
  }
}
var ApiKeyScenario = class extends BaseScenario {
  constructor(strategy = 'token', enabled = true) {
    super(
      'apiKey',
      /(?:api[_-]?key|apikey|secret[_-]?key|access[_-]?key)\s*[:=]\s*["']?([^\s"'\r\n,;]+)["']?/gi,
      1,
      strategy,
      enabled
    )
  }
}
var ConnectionStringScenario = class extends BaseScenario {
  constructor(strategy = 'token', enabled = true) {
    super(
      'connectionString',
      /(?:mongodb|postgres|mysql|redis|amqp):\/\/[^:]+:([^@]+)@/gi,
      1,
      strategy,
      enabled
    )
  }
}
var PrivateKeyScenario = class extends BaseScenario {
  constructor(strategy = 'token', enabled = true) {
    super(
      'privateKey',
      /(-----BEGIN (?:RSA |EC |DSA )?PRIVATE KEY-----[\s\S]*?-----END (?:RSA |EC |DSA )?PRIVATE KEY-----)/gi,
      1,
      strategy,
      enabled
    )
  }
}
var AWSCredentialsScenario = class extends BaseScenario {
  constructor(strategy = 'token', enabled = true) {
    super(
      'awsCredentials',
      /(?:aws[_-]?(?:access[_-]?key[_-]?id|secret[_-]?access[_-]?key))\s*[:=]\s*["']?([A-Za-z0-9\/+=]+)["']?/gi,
      1,
      strategy,
      enabled
    )
  }
}

// packages/core/src/engine.ts
var DataRedactor = class {
  config
  patterns = []
  scenarios = []
  context
  strategies
  constructor(config) {
    console.log('[DataRedactor] Constructor called - VERSION WITH LOGGING')
    if (typeof config === 'string') {
      this.config = ConfigLoader.loadFromFile(config)
    } else if (config) {
      this.config = ConfigLoader.loadFromObject(config)
    } else {
      this.config = ConfigLoader.getDefault()
    }
    console.log('[DataRedactor] Config loaded:', this.config)
    const validation = ConfigLoader.validateConfig(this.config)
    if (!validation.valid) {
      throw new Error(`Invalid configuration: ${validation.errors.join(', ')}`)
    }
    const formatOptions = this.config.formatOptions
    this.strategies = /* @__PURE__ */ new Map([
      ['token', new TokenStrategy(formatOptions)],
      ['mask', new MaskStrategy(formatOptions)],
      ['formatPreserving', new FormatPreservingStrategy(formatOptions)],
    ])
    this.context = new RedactionContext()
    this.initializePatterns()
    this.initializeScenarios()
  }
  initializePatterns() {
    const { patterns } = this.config
    if (!patterns) return
    if (patterns.ipv4) {
      if (patterns.ipv4.regex) {
        const regex = new RegExp(patterns.ipv4.regex, patterns.ipv4.flags || '')
        this.patterns.push(
          new BasePattern(
            'ipv4',
            regex,
            patterns.ipv4.strategy,
            patterns.ipv4.enabled
          )
        )
      } else {
        this.patterns.push(
          new IPv4Pattern(patterns.ipv4.strategy, patterns.ipv4.enabled)
        )
      }
    }
    if (patterns.ipv6) {
      if (patterns.ipv6.regex) {
        const regex = new RegExp(patterns.ipv6.regex, patterns.ipv6.flags || '')
        this.patterns.push(
          new BasePattern(
            'ipv6',
            regex,
            patterns.ipv6.strategy,
            patterns.ipv6.enabled
          )
        )
      } else {
        this.patterns.push(
          new IPv6Pattern(patterns.ipv6.strategy, patterns.ipv6.enabled)
        )
      }
    }
    if (patterns.macAddress) {
      if (patterns.macAddress.regex) {
        const regex = new RegExp(
          patterns.macAddress.regex,
          patterns.macAddress.flags || ''
        )
        this.patterns.push(
          new BasePattern(
            'macAddress',
            regex,
            patterns.macAddress.strategy,
            patterns.macAddress.enabled
          )
        )
      } else {
        this.patterns.push(
          new MACAddressPattern(
            patterns.macAddress.strategy,
            patterns.macAddress.enabled
          )
        )
      }
    }
    if (patterns.email) {
      if (patterns.email.regex) {
        const regex = new RegExp(
          patterns.email.regex,
          patterns.email.flags || ''
        )
        this.patterns.push(
          new BasePattern(
            'email',
            regex,
            patterns.email.strategy,
            patterns.email.enabled
          )
        )
      } else {
        this.patterns.push(
          new EmailPattern(patterns.email.strategy, patterns.email.enabled)
        )
      }
    }
    if (patterns.phone) {
      if (patterns.phone.regex) {
        const regex = new RegExp(
          patterns.phone.regex,
          patterns.phone.flags || ''
        )
        this.patterns.push(
          new BasePattern(
            'phone',
            regex,
            patterns.phone.strategy,
            patterns.phone.enabled
          )
        )
      } else {
        this.patterns.push(
          new PhonePattern(patterns.phone.strategy, patterns.phone.enabled)
        )
      }
    }
    if (patterns.ssn) {
      if (patterns.ssn.regex) {
        const regex = new RegExp(patterns.ssn.regex, patterns.ssn.flags || '')
        this.patterns.push(
          new BasePattern(
            'ssn',
            regex,
            patterns.ssn.strategy,
            patterns.ssn.enabled
          )
        )
      } else {
        this.patterns.push(
          new SSNPattern(patterns.ssn.strategy, patterns.ssn.enabled)
        )
      }
    }
    if (patterns.creditCard) {
      if (patterns.creditCard.regex) {
        const regex = new RegExp(
          patterns.creditCard.regex,
          patterns.creditCard.flags || ''
        )
        this.patterns.push(
          new BasePattern(
            'creditCard',
            regex,
            patterns.creditCard.strategy,
            patterns.creditCard.enabled
          )
        )
      } else {
        this.patterns.push(
          new CreditCardPattern(
            patterns.creditCard.strategy,
            patterns.creditCard.enabled
          )
        )
      }
    }
    if (patterns.creditCardLast4) {
      if (patterns.creditCardLast4.regex) {
        const regex = new RegExp(
          patterns.creditCardLast4.regex,
          patterns.creditCardLast4.flags || ''
        )
        this.patterns.push(
          new BasePattern(
            'creditCardLast4',
            regex,
            patterns.creditCardLast4.strategy,
            patterns.creditCardLast4.enabled
          )
        )
      } else {
        this.patterns.push(
          new CreditCardLast4Pattern(
            patterns.creditCardLast4.strategy,
            patterns.creditCardLast4.enabled
          )
        )
      }
    }
    if (patterns.hostname) {
      if (patterns.hostname.regex) {
        const regex = new RegExp(
          patterns.hostname.regex,
          patterns.hostname.flags || ''
        )
        this.patterns.push(
          new BasePattern(
            'hostname',
            regex,
            patterns.hostname.strategy,
            patterns.hostname.enabled
          )
        )
      } else {
        this.patterns.push(
          new HostnamePattern(
            patterns.hostname.strategy,
            patterns.hostname.enabled
          )
        )
      }
    }
    if (patterns.ticketNumber) {
      if (patterns.ticketNumber.regex) {
        const regex = new RegExp(
          patterns.ticketNumber.regex,
          patterns.ticketNumber.flags || ''
        )
        this.patterns.push(
          new BasePattern(
            'ticketNumber',
            regex,
            patterns.ticketNumber.strategy,
            patterns.ticketNumber.enabled
          )
        )
      } else {
        this.patterns.push(
          new TicketNumberPattern(
            patterns.ticketNumber.strategy,
            patterns.ticketNumber.enabled
          )
        )
      }
    }
    if (patterns.name) {
      if (patterns.name.regex) {
        const regex = new RegExp(patterns.name.regex, patterns.name.flags || '')
        this.patterns.push(
          new BasePattern(
            'name',
            regex,
            patterns.name.strategy,
            patterns.name.enabled
          )
        )
      } else {
        this.patterns.push(
          new NamePattern(patterns.name.strategy, patterns.name.enabled)
        )
      }
    }
    if (patterns.uuid) {
      if (patterns.uuid.regex) {
        const regex = new RegExp(patterns.uuid.regex, patterns.uuid.flags || '')
        this.patterns.push(
          new BasePattern(
            'uuid',
            regex,
            patterns.uuid.strategy,
            patterns.uuid.enabled
          )
        )
      } else {
        this.patterns.push(
          new UUIDPattern(patterns.uuid.strategy, patterns.uuid.enabled)
        )
      }
    }
    if (patterns.filePath) {
      if (patterns.filePath.regex) {
        const regex = new RegExp(
          patterns.filePath.regex,
          patterns.filePath.flags || ''
        )
        this.patterns.push(
          new BasePattern(
            'filePath',
            regex,
            patterns.filePath.strategy,
            patterns.filePath.enabled
          )
        )
      } else {
        this.patterns.push(
          new FilePathPattern(
            patterns.filePath.strategy,
            patterns.filePath.enabled
          )
        )
      }
    }
    if (patterns.custom) {
      patterns.custom.forEach(customPattern => {
        const regex = new RegExp(customPattern.regex, customPattern.flags || '')
        this.patterns.push(
          new BasePattern(
            customPattern.name,
            regex,
            customPattern.strategy,
            true
          )
        )
      })
    }
    if (this.config.customEntities) {
      Object.entries(this.config.customEntities).forEach(([type, values]) => {
        if (values && values.length > 0) {
          const escapedValues = values.map(v =>
            v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
          )
          const regex = new RegExp(`\\b(${escapedValues.join('|')})\\b`, 'gi')
          this.patterns.push(new BasePattern(type, regex, 'token', true))
        }
      })
    }
  }
  initializeScenarios() {
    const { scenarios } = this.config
    if (!scenarios) return
    if (scenarios.authHeader) {
      this.scenarios.push(
        new AuthorizationHeaderScenario(
          scenarios.authHeader.strategy,
          scenarios.authHeader.enabled
        )
      )
    }
    if (scenarios.password) {
      this.scenarios.push(
        new PasswordScenario(
          scenarios.password.strategy,
          scenarios.password.enabled
        )
      )
    }
    if (scenarios.apiKey) {
      this.scenarios.push(
        new ApiKeyScenario(scenarios.apiKey.strategy, scenarios.apiKey.enabled)
      )
    }
    if (scenarios.connectionString) {
      this.scenarios.push(
        new ConnectionStringScenario(
          scenarios.connectionString.strategy,
          scenarios.connectionString.enabled
        )
      )
    }
    if (scenarios.privateKey) {
      this.scenarios.push(
        new PrivateKeyScenario(
          scenarios.privateKey.strategy,
          scenarios.privateKey.enabled
        )
      )
    }
    if (scenarios.awsCredentials) {
      this.scenarios.push(
        new AWSCredentialsScenario(
          scenarios.awsCredentials.strategy,
          scenarios.awsCredentials.enabled
        )
      )
    }
  }
  redact(text) {
    console.log(
      '[DataRedactor] redact() called with text:',
      text.substring(0, 200)
    )
    console.log('[DataRedactor] Number of patterns:', this.patterns.length)
    const allMatches = []
    this.patterns.forEach(pattern => {
      console.log(
        '[DataRedactor] Checking pattern:',
        pattern.name,
        'enabled:',
        pattern.enabled
      )
      if (pattern.enabled) {
        const matches = pattern.findAll(text)
        console.log(
          '[DataRedactor] Pattern',
          pattern.name,
          'found',
          matches.length,
          'matches'
        )
        allMatches.push(...matches)
      }
    })
    this.scenarios.forEach(scenario => {
      if (scenario.enabled) {
        const matches = scenario.findAll(text)
        console.log(
          '[DataRedactor] Scenario',
          scenario.name,
          'found',
          matches.length,
          'matches'
        )
        allMatches.push(...matches)
      }
    })
    const nonOverlappingMatches = this.removeOverlaps(allMatches)
    nonOverlappingMatches.sort((a, b) => b.start - a.start)
    let redactedText = text
    nonOverlappingMatches.forEach(match => {
      const strategy = this.strategies.get(match.strategy)
      if (strategy) {
        const replacement = this.context.getOrCreateRedaction(
          match.value,
          match.type,
          strategy
        )
        redactedText =
          redactedText.substring(0, match.start) +
          replacement +
          redactedText.substring(match.end)
      }
    })
    return {
      redactedText,
      mapping: this.context.getMapping(),
      matches: nonOverlappingMatches.reverse(),
      // Return in original order
    }
  }
  removeOverlaps(matches) {
    const result = []
    const sorted = [...matches].sort((a, b) => a.start - b.start)
    sorted.forEach(match => {
      const overlaps = result.some(existing => {
        return (
          (match.start >= existing.start && match.start < existing.end) ||
          (match.end > existing.start && match.end <= existing.end) ||
          (match.start <= existing.start && match.end >= existing.end)
        )
      })
      if (!overlaps) {
        result.push(match)
      }
    })
    return result
  }
  reset() {
    this.context.clear()
  }
  getConfig() {
    return JSON.parse(JSON.stringify(this.config))
  }
  updateConfig(config) {
    this.config = ConfigLoader.loadFromObject({
      ...this.config,
      ...config,
    })
    const formatOptions = this.config.formatOptions
    this.strategies = /* @__PURE__ */ new Map([
      ['token', new TokenStrategy(formatOptions)],
      ['mask', new MaskStrategy(formatOptions)],
      ['formatPreserving', new FormatPreservingStrategy(formatOptions)],
    ])
    this.patterns = []
    this.scenarios = []
    this.initializePatterns()
    this.initializeScenarios()
    this.reset()
  }
}

// packages/core/src/presets.ts
var PRESETS = {
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
      email: { enabled: true, strategy: 'token' },
      phone: { enabled: true, strategy: 'token' },
      ssn: { enabled: true, strategy: 'token' },
      name: { enabled: true, strategy: 'token' },
      // All Financial
      creditCard: { enabled: true, strategy: 'token' },
      creditCardLast4: { enabled: true, strategy: 'token' },
      // All System
      uuid: { enabled: true, strategy: 'token' },
      filePath: { enabled: true, strategy: 'token' },
      ipv4: { enabled: true, strategy: 'token' },
      ipv6: { enabled: true, strategy: 'token' },
      macAddress: { enabled: true, strategy: 'token' },
      hostname: { enabled: true, strategy: 'token' },
      // Business
      ticketNumber: { enabled: true, strategy: 'token' },
    },
    scenarios: {
      authHeader: { enabled: true, strategy: 'token' },
      password: { enabled: true, strategy: 'token' },
      apiKey: { enabled: true, strategy: 'token' },
      connectionString: { enabled: true, strategy: 'token' },
      privateKey: { enabled: true, strategy: 'token' },
      awsCredentials: { enabled: true, strategy: 'token' },
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
      email: { enabled: true, strategy: 'token' },
      phone: { enabled: true, strategy: 'token' },
      ssn: { enabled: false, strategy: 'token' },
      name: { enabled: false, strategy: 'token' },
      creditCard: { enabled: false, strategy: 'token' },
      creditCardLast4: { enabled: false, strategy: 'token' },
      uuid: { enabled: false, strategy: 'token' },
      filePath: { enabled: false, strategy: 'token' },
      ipv4: { enabled: false, strategy: 'token' },
      ipv6: { enabled: false, strategy: 'token' },
      macAddress: { enabled: false, strategy: 'token' },
      hostname: { enabled: false, strategy: 'token' },
      ticketNumber: { enabled: false, strategy: 'token' },
    },
    scenarios: {
      authHeader: { enabled: false, strategy: 'token' },
      password: { enabled: false, strategy: 'token' },
      apiKey: { enabled: false, strategy: 'token' },
      connectionString: { enabled: false, strategy: 'token' },
      privateKey: { enabled: false, strategy: 'token' },
      awsCredentials: { enabled: false, strategy: 'token' },
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
      email: { enabled: true, strategy: 'token' },
      phone: { enabled: false, strategy: 'token' },
      ssn: { enabled: false, strategy: 'token' },
      name: { enabled: false, strategy: 'token' },
      creditCard: { enabled: false, strategy: 'token' },
      creditCardLast4: { enabled: false, strategy: 'token' },
      uuid: { enabled: true, strategy: 'token' },
      filePath: { enabled: true, strategy: 'token' },
      ipv4: { enabled: true, strategy: 'formatPreserving' },
      ipv6: { enabled: true, strategy: 'formatPreserving' },
      macAddress: { enabled: true, strategy: 'formatPreserving' },
      hostname: { enabled: true, strategy: 'formatPreserving' },
      ticketNumber: { enabled: true, strategy: 'token' },
    },
    scenarios: {
      authHeader: { enabled: true, strategy: 'token' },
      password: { enabled: true, strategy: 'token' },
      apiKey: { enabled: true, strategy: 'token' },
      connectionString: { enabled: true, strategy: 'token' },
      privateKey: { enabled: true, strategy: 'token' },
      awsCredentials: { enabled: true, strategy: 'token' },
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
      email: { enabled: true, strategy: 'token' },
      phone: { enabled: true, strategy: 'token' },
      ssn: { enabled: true, strategy: 'token' },
      name: { enabled: true, strategy: 'token' },
      creditCard: { enabled: true, strategy: 'mask' },
      creditCardLast4: { enabled: true, strategy: 'token' },
      uuid: { enabled: false, strategy: 'token' },
      filePath: { enabled: false, strategy: 'token' },
      ipv4: { enabled: false, strategy: 'token' },
      ipv6: { enabled: false, strategy: 'token' },
      macAddress: { enabled: false, strategy: 'token' },
      hostname: { enabled: false, strategy: 'token' },
      ticketNumber: { enabled: true, strategy: 'token' },
    },
    scenarios: {
      authHeader: { enabled: false, strategy: 'token' },
      password: { enabled: false, strategy: 'token' },
      apiKey: { enabled: false, strategy: 'token' },
      connectionString: { enabled: false, strategy: 'token' },
      privateKey: { enabled: false, strategy: 'token' },
      awsCredentials: { enabled: false, strategy: 'token' },
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
      email: { enabled: true, strategy: 'token' },
      phone: { enabled: true, strategy: 'token' },
      ssn: { enabled: true, strategy: 'token' },
      name: { enabled: true, strategy: 'token' },
      creditCard: { enabled: true, strategy: 'token' },
      creditCardLast4: { enabled: true, strategy: 'token' },
      uuid: { enabled: true, strategy: 'token' },
      filePath: { enabled: true, strategy: 'token' },
      ipv4: { enabled: true, strategy: 'token' },
      ipv6: { enabled: true, strategy: 'token' },
      macAddress: { enabled: true, strategy: 'token' },
      hostname: { enabled: true, strategy: 'token' },
      ticketNumber: { enabled: true, strategy: 'token' },
    },
    scenarios: {
      authHeader: { enabled: true, strategy: 'token' },
      password: { enabled: true, strategy: 'token' },
      apiKey: { enabled: true, strategy: 'token' },
      connectionString: { enabled: true, strategy: 'token' },
      privateKey: { enabled: true, strategy: 'token' },
      awsCredentials: { enabled: true, strategy: 'token' },
    },
  },
}
function getPreset(name) {
  const preset = PRESETS[name]
  return JSON.parse(JSON.stringify(preset))
}
function getPresetNames() {
  return Object.keys(PRESETS)
}
function hasPreset(name) {
  return name in PRESETS
}

// packages/core/src/regex-builder/tokenizer.ts
var TokenType = /* @__PURE__ */ (TokenType3 => {
  TokenType3['DIGIT'] = 'DIGIT'
  TokenType3['LOWER'] = 'LOWER'
  TokenType3['UPPER'] = 'UPPER'
  TokenType3['HEX_LOWER'] = 'HEX_LOWER'
  TokenType3['HEX_UPPER'] = 'HEX_UPPER'
  TokenType3['WHITESPACE'] = 'WHITESPACE'
  TokenType3['NEWLINE'] = 'NEWLINE'
  TokenType3['SPECIAL'] = 'SPECIAL'
  return TokenType3
})(TokenType || {})
function classifyChar(char) {
  if (/\d/.test(char)) return 'DIGIT' /* DIGIT */
  if (/[a-f]/.test(char)) return 'HEX_LOWER' /* HEX_LOWER */
  if (/[A-F]/.test(char)) return 'HEX_UPPER' /* HEX_UPPER */
  if (/[a-z]/.test(char)) return 'LOWER' /* LOWER */
  if (/[A-Z]/.test(char)) return 'UPPER' /* UPPER */
  if (/[\r\n]/.test(char)) return 'NEWLINE' /* NEWLINE */
  if (/\s/.test(char)) return 'WHITESPACE' /* WHITESPACE */
  return 'SPECIAL' /* SPECIAL */
}
function canMerge(type1, type2) {
  if (type1 === type2) return true
  if (
    (type1 === 'DIGIT' /* DIGIT */ ||
      type1 === 'HEX_LOWER' /* HEX_LOWER */ ||
      type1 === 'HEX_UPPER') /* HEX_UPPER */ &&
    (type2 === 'DIGIT' /* DIGIT */ ||
      type2 === 'HEX_LOWER' /* HEX_LOWER */ ||
      type2 === 'HEX_UPPER') /* HEX_UPPER */
  ) {
    return true
  }
  if (
    (type1 === 'HEX_LOWER' /* HEX_LOWER */ && type2 === 'LOWER') /* LOWER */ ||
    (type1 === 'LOWER' /* LOWER */ && type2 === 'HEX_LOWER') /* HEX_LOWER */
  ) {
    return true
  }
  if (
    (type1 === 'HEX_UPPER' /* HEX_UPPER */ && type2 === 'UPPER') /* UPPER */ ||
    (type1 === 'UPPER' /* UPPER */ && type2 === 'HEX_UPPER') /* HEX_UPPER */
  ) {
    return true
  }
  return false
}
function getMergedType(type1, type2) {
  if (type1 === type2) return type1
  const hexTypes = [
    'DIGIT' /* DIGIT */,
    'HEX_LOWER' /* HEX_LOWER */,
    'HEX_UPPER' /* HEX_UPPER */,
  ]
  if (hexTypes.includes(type1) && hexTypes.includes(type2)) {
    if (
      type1 === 'HEX_LOWER' /* HEX_LOWER */ ||
      type2 === 'HEX_LOWER' /* HEX_LOWER */
    ) {
      return 'HEX_LOWER' /* HEX_LOWER */
    }
    if (
      type1 === 'HEX_UPPER' /* HEX_UPPER */ ||
      type2 === 'HEX_UPPER' /* HEX_UPPER */
    ) {
      return 'HEX_UPPER' /* HEX_UPPER */
    }
    return 'DIGIT' /* DIGIT */
  }
  if (
    (type1 === 'HEX_LOWER' /* HEX_LOWER */ || type1 === 'LOWER') /* LOWER */ &&
    (type2 === 'HEX_LOWER' /* HEX_LOWER */ || type2 === 'LOWER') /* LOWER */
  ) {
    return 'LOWER' /* LOWER */
  }
  if (
    (type1 === 'HEX_UPPER' /* HEX_UPPER */ || type1 === 'UPPER') /* UPPER */ &&
    (type2 === 'HEX_UPPER' /* HEX_UPPER */ || type2 === 'UPPER') /* UPPER */
  ) {
    return 'UPPER' /* UPPER */
  }
  return type1
}
function tokenize(input) {
  if (!input) return []
  const tokens = []
  let pos = 0
  while (pos < input.length) {
    const char = input[pos]
    const charType = classifyChar(char)
    if (tokens.length > 0) {
      const lastToken = tokens[tokens.length - 1]
      if (
        charType !== 'SPECIAL' /* SPECIAL */ &&
        lastToken.type !== 'SPECIAL' /* SPECIAL */
      ) {
        if (canMerge(lastToken.type, charType)) {
          lastToken.value += char
          lastToken.length++
          lastToken.type = getMergedType(lastToken.type, charType)
          pos++
          continue
        }
      }
    }
    tokens.push({
      type: charType,
      value: char,
      position: pos,
      length: 1,
    })
    pos++
  }
  return tokens
}

// packages/core/src/regex-builder/pattern-detector.ts
var KNOWN_PATTERNS = [
  {
    name: 'UUID',
    type: 'uuid',
    test: tokens => {
      if (tokens.length !== 9) return false
      const lengths = [8, 1, 4, 1, 4, 1, 4, 1, 12]
      return tokens.every((t, i) => {
        if (i % 2 === 1)
          return t.type === 'SPECIAL' /* SPECIAL */ && t.value === '-'
        return (
          (t.type === 'HEX_LOWER' /* HEX_LOWER */ ||
            t.type === 'HEX_UPPER' /* HEX_UPPER */ ||
            t.type === 'DIGIT') /* DIGIT */ &&
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
      if (tokens.length !== 7) return false
      return tokens.every((t, i) => {
        if (i % 2 === 1)
          return t.type === 'SPECIAL' /* SPECIAL */ && t.value === '.'
        return t.type === 'DIGIT' /* DIGIT */ && t.length >= 1 && t.length <= 3
      })
    },
    toRegex: () =>
      '(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)',
  },
  {
    name: 'MAC Address (colon)',
    type: 'mac',
    test: tokens => {
      if (tokens.length !== 11) return false
      return tokens.every((t, i) => {
        if (i % 2 === 1)
          return t.type === 'SPECIAL' /* SPECIAL */ && t.value === ':'
        return (
          (t.type === 'HEX_LOWER' /* HEX_LOWER */ ||
            t.type === 'HEX_UPPER' /* HEX_UPPER */ ||
            t.type === 'DIGIT') /* DIGIT */ &&
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
        if (i % 2 === 1)
          return t.type === 'SPECIAL' /* SPECIAL */ && t.value === '-'
        return (
          (t.type === 'HEX_LOWER' /* HEX_LOWER */ ||
            t.type === 'HEX_UPPER' /* HEX_UPPER */ ||
            t.type === 'DIGIT') /* DIGIT */ &&
          t.length === 2
        )
      })
    },
    toRegex: () =>
      '[0-9a-fA-F]{2}-[0-9a-fA-F]{2}-[0-9a-fA-F]{2}-[0-9a-fA-F]{2}-[0-9a-fA-F]{2}-[0-9a-fA-F]{2}',
  },
]
function tokenToRegex(token) {
  const len = token.length
  switch (token.type) {
    case 'DIGIT' /* DIGIT */:
      return {
        regex: len === 1 ? '\\d' : `\\d{${len}}`,
        description: `${len} digit(s)`,
        type: 'digit',
        isVariable: true,
        minLength: len,
        maxLength: len,
        originalValue: token.value,
      }
    case 'LOWER' /* LOWER */:
      return {
        regex: len === 1 ? '[a-z]' : `[a-z]{${len}}`,
        description: `${len} lowercase letter(s)`,
        type: 'lower',
        isVariable: true,
        minLength: len,
        maxLength: len,
        originalValue: token.value,
      }
    case 'UPPER' /* UPPER */:
      return {
        regex: len === 1 ? '[A-Z]' : `[A-Z]{${len}}`,
        description: `${len} uppercase letter(s)`,
        type: 'upper',
        isVariable: true,
        minLength: len,
        maxLength: len,
        originalValue: token.value,
      }
    case 'HEX_LOWER' /* HEX_LOWER */:
      return {
        regex: len === 1 ? '[0-9a-f]' : `[0-9a-f]{${len}}`,
        description: `${len} hex char(s) [0-9a-f]`,
        type: 'hex',
        isVariable: true,
        minLength: len,
        maxLength: len,
        originalValue: token.value,
      }
    case 'HEX_UPPER' /* HEX_UPPER */:
      return {
        regex: len === 1 ? '[0-9A-F]' : `[0-9A-F]{${len}}`,
        description: `${len} hex char(s) [0-9A-F]`,
        type: 'hex',
        isVariable: true,
        minLength: len,
        maxLength: len,
        originalValue: token.value,
      }
    case 'WHITESPACE' /* WHITESPACE */:
      return {
        regex: len === 1 ? '\\s' : `\\s{${len}}`,
        description: `${len} whitespace`,
        type: 'whitespace',
        isVariable: true,
        minLength: len,
        maxLength: len,
        originalValue: token.value,
      }
    case 'NEWLINE' /* NEWLINE */:
      return {
        regex: '\\r?\\n',
        description: 'newline',
        type: 'whitespace',
        isVariable: false,
        minLength: 1,
        maxLength: 2,
        originalValue: token.value,
      }
    case 'SPECIAL' /* SPECIAL */:
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
function detectPatterns(tokens) {
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
  return tokens.map(tokenToRegex)
}
function mergeAdjacentPatterns(segments) {
  if (segments.length <= 1) return segments
  const merged = []
  for (const segment of segments) {
    if (merged.length === 0) {
      merged.push({ ...segment })
      continue
    }
    const last = merged[merged.length - 1]
    const alphaPattern = /^\[([a-zA-Z0-9-]+)\](?:\{(\d+)\})?$/
    const digitPattern = /^\\d(?:\{(\d+)\})?$/
    const lastMatch = last.regex.match(alphaPattern)
    const currMatch = segment.regex.match(alphaPattern)
    if (lastMatch && currMatch && lastMatch[1] === currMatch[1]) {
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
    merged.push({ ...segment })
  }
  return merged
}

// packages/core/src/regex-builder/optimizer.ts
var OPTIMIZATIONS = [
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
function optimizeRegex(regex) {
  let optimized = regex
  let changed = true
  let iterations = 0
  const maxIterations = 10
  while (changed && iterations < maxIterations) {
    changed = false
    iterations++
    for (const rule of OPTIMIZATIONS) {
      const before = optimized
      optimized = optimized.replace(rule.pattern, rule.replacement)
      if (before !== optimized) {
        changed = true
      }
    }
  }
  return optimized
}
function buildRegex(segments) {
  const raw = segments.map(s => s.regex).join('')
  return optimizeRegex(raw)
}
function addWordBoundaries(regex, addBoundaries = true) {
  if (!addBoundaries) return regex
  const startsWithWord = /^(?:\\d|\\w|\[[a-zA-Z0-9]|[a-zA-Z0-9_])/.test(regex)
  const endsWithWord =
    /(?:\\d|\\w|[a-zA-Z0-9_]|\[[a-zA-Z0-9][^\]]*\]|\{[0-9]+\})$/.test(regex)
  let result = regex
  if (startsWithWord) result = '\\b' + result
  if (endsWithWord) result = result + '\\b'
  return result
}
function validateRegex(regex, sample) {
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
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
function analyzePattern(regex) {
  const warnings = []
  if (regex.length < 3) {
    warnings.push('Pattern is very short and may match too broadly')
  }
  if (/^\.\*$|^\.\+$/.test(regex)) {
    warnings.push('Pattern matches any text - too broad')
  }
  if (/(?<!\\)[*+]/.test(regex) && !/\\b|^\^|\$$/.test(regex)) {
    warnings.push('Unbounded repetition without anchors may match too much')
  }
  if (/\.\*|\.\+/.test(regex)) {
    warnings.push('Using .* or .+ matches almost anything')
  }
  if (/^(?:\\d|\[[\w-]+\]|\\w|\\s)$/.test(regex)) {
    warnings.push('Pattern only matches single characters')
  }
  return warnings
}

// packages/core/src/regex-builder/index.ts
function generateFromSample(sample, options = {}) {
  const {
    addWordBoundaries: withBoundaries = true,
    caseInsensitive = false,
    permissive = false,
  } = options
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
  const tokens = tokenize(sample)
  let segments = detectPatterns(tokens)
  segments = mergeAdjacentPatterns(segments)
  let regex = buildRegex(segments)
  if (withBoundaries) {
    regex = addWordBoundaries(regex, true)
  }
  const validation = validateRegex(regex, sample)
  const warnings = analyzePattern(regex)
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
function generatePatternName(segments, sample) {
  const patternTypes = segments
    .map(s => s.type)
    .filter(t => t !== 'literal' && t !== 'unknown')
  if (patternTypes.includes('uuid')) return 'uuid-pattern'
  if (patternTypes.includes('ipv4')) return 'ipv4-pattern'
  if (patternTypes.includes('mac')) return 'mac-address-pattern'
  if (patternTypes.includes('hex')) return 'hex-pattern'
  if (/^\d{3}-\d{2}-\d{4}$/.test(sample)) return 'ssn-pattern'
  if (/^\d{3}-\d{3}-\d{4}$/.test(sample)) return 'phone-pattern'
  if (/^\d{4}-\d{4}-\d{4}-\d{4}$/.test(sample)) return 'card-pattern'
  if (/^[A-Z]{2}\d{6}$/.test(sample)) return 'license-pattern'
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
function testPattern(regex, samples) {
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
function refineFromSamples(samples, options = {}) {
  if (samples.length === 0) {
    return generateFromSample('', options)
  }
  if (samples.length === 1) {
    return generateFromSample(samples[0], options)
  }
  const patterns = samples.map(s =>
    generateFromSample(s, { ...options, addWordBoundaries: false })
  )
  const allValid = patterns.every(p => p.valid)
  if (!allValid) {
    return generateFromSample(samples[0], options)
  }
  const firstSegments = patterns[0].segments
  const sameStructure = patterns.every(
    p =>
      p.segments.length === firstSegments.length &&
      p.segments.every((seg, i) => seg.type === firstSegments[i].type)
  )
  if (sameStructure) {
    return generateFromSample(samples[0], options)
  }
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

// packages/core/src/testing/engine.ts
var PatternTestEngine = class {
  /**
   * Execute a pattern against a test sample
   *
   * @param pattern - The pattern to test
   * @param sample - The test sample to run
   * @returns Test result with accuracy metrics
   */
  static executeTest(pattern, sample) {
    const matches = pattern.findAll(sample.content)
    const matchedValues = matches.map(m => m.value)
    const falsePositives = []
    matchedValues.forEach(value => {
      const expected = sample.expectedMatches.find(e => e.value === value)
      if (expected && !expected.shouldMatch) {
        falsePositives.push(value)
      } else if (!expected) {
        const hasExpectedMatch = sample.expectedMatches.some(e => e.shouldMatch)
        if (hasExpectedMatch) {
          falsePositives.push(value)
        }
      }
    })
    const falseNegatives = []
    sample.expectedMatches.forEach(expected => {
      if (expected.shouldMatch && !matchedValues.includes(expected.value)) {
        falseNegatives.push(expected.value)
      }
    })
    const totalExpected = sample.expectedMatches.filter(
      e => e.shouldMatch
    ).length
    const totalNegatives = sample.expectedMatches.filter(
      e => !e.shouldMatch
    ).length
    let accuracy = 100
    if (totalExpected > 0 || totalNegatives > 0) {
      const correctMatches = Math.max(0, totalExpected - falseNegatives.length)
      const falsePositivesOfNegatives = falsePositives.filter(fp => {
        const expected = sample.expectedMatches.find(e => e.value === fp)
        return expected && !expected.shouldMatch
      }).length
      const correctNonMatches = Math.max(
        0,
        totalNegatives - falsePositivesOfNegatives
      )
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
  static executeAllTests(pattern, samples) {
    return samples.map(sample => this.executeTest(pattern, sample))
  }
  /**
   * Get summary statistics for test results
   */
  static getSummary(results) {
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

// packages/core/src/testing/quality-score.ts
function calculateQualityScore(testResults, knownIssues = 0) {
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
  const coverageScore = Math.min(testResults.length * 10, 50)
  const averageAccuracy =
    testResults.reduce((sum, r) => sum + r.accuracy, 0) / testResults.length
  const accuracyScore = Math.round((averageAccuracy / 100) * 30)
  const issueDeduction = Math.min(knownIssues * 5, 20)
  const edgeCaseScore = 20 - issueDeduction
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
function getQualityTier(score) {
  if (score === 0) return 'untested'
  if (score >= 90) return 'excellent'
  if (score >= 75) return 'good'
  if (score >= 60) return 'fair'
  return 'poor'
}
function getQualityTierColor(tier) {
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
function getQualityTierLabel(tier) {
  switch (tier) {
    case 'excellent':
      return '\u2713 Excellent'
    case 'good':
      return '\u2713 Good'
    case 'fair':
      return '~ Fair'
    case 'poor':
      return '\u26A0 Poor'
    case 'untested':
      return '? Untested'
  }
}
function getRecommendations(breakdown) {
  const recommendations = []
  if (breakdown.details.testCount < 5) {
    recommendations.push(
      `Add ${5 - breakdown.details.testCount} more test samples to improve coverage`
    )
  }
  if (breakdown.details.averageAccuracy < 80) {
    recommendations.push('Review regex pattern - accuracy is below 80%')
  }
  if (breakdown.details.averageAccuracy < 60) {
    recommendations.push(
      'Critical: Pattern has significant accuracy issues - immediate review needed'
    )
  }
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
  if (breakdown.totalScore === 100) {
    recommendations.push('Pattern is performing excellently!')
  }
  return recommendations
}

// packages/core/src/test-samples/ipv4/apache-log.ts
var ipv4ApacheLog = {
  id: 'ipv4-apache-log',
  name: 'Apache Access Log',
  content: `192.168.1.100 - - [28/Nov/2024:12:34:56 +0000] "GET /api/v1/users HTTP/1.1" 200 1234
10.0.0.45 - admin [28/Nov/2024:12:35:01 +0000] "POST /login HTTP/1.1" 302 0
172.16.254.1 - - [28/Nov/2024:12:35:12 +0000] "GET /static/app.js HTTP/1.1" 304 -
203.0.113.15 - user1 [28/Nov/2024:12:35:20 +0000] "GET /dashboard HTTP/1.1" 200 4567
198.51.100.88 - - [28/Nov/2024:12:35:45 +0000] "POST /api/v1/orders HTTP/1.1" 201 892`,
  expectedMatches: [
    {
      value: '192.168.1.100',
      shouldMatch: true,
      startIndex: 0,
      endIndex: 13,
      reason: 'Valid private IP (Class C)',
    },
    {
      value: '10.0.0.45',
      shouldMatch: true,
      startIndex: 91,
      endIndex: 100,
      reason: 'Valid private IP (Class A)',
    },
    {
      value: '172.16.254.1',
      shouldMatch: true,
      startIndex: 181,
      endIndex: 193,
      reason: 'Valid private IP (Class B)',
    },
    {
      value: '203.0.113.15',
      shouldMatch: true,
      startIndex: 281,
      endIndex: 293,
      reason: 'Valid public IP (TEST-NET-3)',
    },
    {
      value: '198.51.100.88',
      shouldMatch: true,
      startIndex: 380,
      endIndex: 393,
      reason: 'Valid public IP (TEST-NET-2)',
    },
  ],
  category: 'logs',
}

// packages/core/src/test-samples/ipv4/cidr-notation.ts
var ipv4CidrNotation = {
  id: 'ipv4-cidr-notation',
  name: 'Network Configuration with CIDR',
  content: `# Network Configuration
subnet = 10.0.0.0/24
gateway = 10.0.0.1
dns_primary = 8.8.8.8
dns_secondary = 8.8.4.4

# VPN Settings
vpn_network = 192.168.100.0/24
vpn_gateway = 192.168.100.1

# Docker Networks
bridge_network = 172.17.0.0/16
container_ip = 172.17.0.2`,
  expectedMatches: [
    {
      value: '10.0.0.0',
      shouldMatch: true,
      startIndex: 33,
      endIndex: 41,
      reason: 'Network address in CIDR notation',
    },
    {
      value: '10.0.0.1',
      shouldMatch: true,
      startIndex: 55,
      endIndex: 63,
      reason: 'Gateway IP',
    },
    {
      value: '8.8.8.8',
      shouldMatch: true,
      startIndex: 81,
      endIndex: 88,
      reason: 'DNS server IP',
    },
    {
      value: '8.8.4.4',
      shouldMatch: true,
      startIndex: 109,
      endIndex: 116,
      reason: 'DNS server IP',
    },
    {
      value: '192.168.100.0',
      shouldMatch: true,
      startIndex: 149,
      endIndex: 162,
      reason: 'VPN network address',
    },
    {
      value: '192.168.100.1',
      shouldMatch: true,
      startIndex: 180,
      endIndex: 193,
      reason: 'VPN gateway',
    },
    {
      value: '172.17.0.0',
      shouldMatch: true,
      startIndex: 232,
      endIndex: 242,
      reason: 'Docker bridge network',
    },
    {
      value: '172.17.0.2',
      shouldMatch: true,
      startIndex: 263,
      endIndex: 273,
      reason: 'Container IP',
    },
  ],
  category: 'config',
}

// packages/core/src/test-samples/ipv4/false-positives.ts
var ipv4FalsePositives = {
  id: 'ipv4-false-positives',
  name: 'Version Numbers (False Positives)',
  content: `Application version: 1.2.3.4
Docker image: myapp:2.5.10.3
Node.js version: 18.0.0.0
Invalid IP: 999.999.999.999
Edge case: 255.255.255.256
Also invalid: 300.168.1.1

Valid IPs that should match:
Server IP: 10.0.0.5
Load balancer: 172.31.45.67`,
  expectedMatches: [
    {
      value: '1.2.3.4',
      shouldMatch: false,
      startIndex: 22,
      endIndex: 29,
      reason: 'Application version, not an IP',
    },
    {
      value: '2.5.10.3',
      shouldMatch: false,
      startIndex: 48,
      endIndex: 56,
      reason: 'Docker image version tag',
    },
    {
      value: '18.0.0.0',
      shouldMatch: false,
      startIndex: 75,
      endIndex: 83,
      reason: 'Node.js version number',
    },
    {
      value: '999.999.999.999',
      shouldMatch: false,
      startIndex: 97,
      endIndex: 112,
      reason: 'Invalid IP - octets > 255',
    },
    {
      value: '255.255.255.256',
      shouldMatch: false,
      startIndex: 125,
      endIndex: 140,
      reason: 'Invalid IP - last octet > 255',
    },
    {
      value: '300.168.1.1',
      shouldMatch: false,
      startIndex: 156,
      endIndex: 167,
      reason: 'Invalid IP - first octet > 255',
    },
    {
      value: '10.0.0.5',
      shouldMatch: true,
      startIndex: 206,
      endIndex: 214,
      reason: 'Valid private IP',
    },
    {
      value: '172.31.45.67',
      shouldMatch: true,
      startIndex: 232,
      endIndex: 244,
      reason: 'Valid private IP',
    },
  ],
  category: 'code',
}

// packages/core/src/test-samples/ipv4/docker-networks.ts
var ipv4DockerNetworks = {
  id: 'ipv4-docker-networks',
  name: 'Docker Network Inspection',
  content: `CONTAINER ID   IMAGE          STATUS    PORTS                    NETWORKS
a1b2c3d4e5f6   nginx:latest   Up 5min   0.0.0.0:8080->80/tcp    bridge
Container IP: 172.17.0.2
Gateway: 172.17.0.1

CONTAINER ID   IMAGE          STATUS    PORTS                    NETWORKS
b6c7d8e9f0a1   postgres:14    Up 10min  0.0.0.0:5432->5432/tcp  app-net
Container IP: 172.18.0.3
Gateway: 172.18.0.1

Host bridge interface: 172.17.0.1/16`,
  expectedMatches: [
    {
      value: '0.0.0.0',
      shouldMatch: true,
      startIndex: 104,
      endIndex: 111,
      reason: 'Bind address for port mapping',
    },
    {
      value: '172.17.0.2',
      shouldMatch: true,
      startIndex: 164,
      endIndex: 174,
      reason: 'Container bridge IP',
    },
    {
      value: '172.17.0.1',
      shouldMatch: true,
      startIndex: 185,
      endIndex: 195,
      reason: 'Bridge gateway IP',
    },
    {
      value: '0.0.0.0',
      shouldMatch: true,
      startIndex: 295,
      endIndex: 302,
      reason: 'Bind address for port mapping',
    },
    {
      value: '172.18.0.3',
      shouldMatch: true,
      startIndex: 361,
      endIndex: 371,
      reason: 'Container custom network IP',
    },
    {
      value: '172.18.0.1',
      shouldMatch: true,
      startIndex: 382,
      endIndex: 392,
      reason: 'Custom network gateway',
    },
    {
      value: '172.17.0.1',
      shouldMatch: true,
      startIndex: 420,
      endIndex: 430,
      reason: 'Host bridge interface IP',
    },
  ],
  category: 'network',
}

// packages/core/src/test-samples/ipv4/kubernetes-pods.ts
var ipv4KubernetesPods = {
  id: 'ipv4-kubernetes-pods',
  name: 'Kubernetes Pod IPs',
  content: `NAME                     READY   STATUS    RESTARTS   AGE   IP            NODE
web-app-7d8f9c-xk2qp     1/1     Running   0          5d    10.244.1.15   worker-1
api-service-5b6c7d-p9w3  1/1     Running   0          3d    10.244.2.23   worker-2
database-8e9f0a-r5t7     1/1     Running   0          10d   10.244.1.45   worker-1

Service ClusterIP: 10.96.0.1
Pod CIDR: 10.244.0.0/16
Node Internal IP: 192.168.1.50`,
  expectedMatches: [
    {
      value: '10.244.1.15',
      shouldMatch: true,
      startIndex: 142,
      endIndex: 153,
      reason: 'Pod IP on worker-1',
    },
    {
      value: '10.244.2.23',
      shouldMatch: true,
      startIndex: 230,
      endIndex: 241,
      reason: 'Pod IP on worker-2',
    },
    {
      value: '10.244.1.45',
      shouldMatch: true,
      startIndex: 317,
      endIndex: 328,
      reason: 'Database pod IP',
    },
    {
      value: '10.96.0.1',
      shouldMatch: true,
      startIndex: 363,
      endIndex: 372,
      reason: 'Kubernetes service cluster IP',
    },
    {
      value: '10.244.0.0',
      shouldMatch: true,
      startIndex: 385,
      endIndex: 395,
      reason: 'Pod CIDR network address',
    },
    {
      value: '192.168.1.50',
      shouldMatch: true,
      startIndex: 419,
      endIndex: 431,
      reason: 'Node internal IP',
    },
  ],
  category: 'network',
}

// packages/core/src/test-samples/email/standard-formats.ts
var emailStandardFormats = {
  id: 'email-standard-formats',
  name: 'Standard Email Formats',
  content: `From: john.doe@example.com
To: jane_smith@company.co.uk
CC: support@helpdesk.io, admin@system.net

Customer email: customer123@shop-online.com
Reply to: noreply@notifications.service.gov

Technical contact: tech.support@sub.domain.example.org`,
  expectedMatches: [
    {
      value: 'john.doe@example.com',
      shouldMatch: true,
      startIndex: 6,
      endIndex: 27,
      reason: 'Standard email with dot in local part',
    },
    {
      value: 'jane_smith@company.co.uk',
      shouldMatch: true,
      startIndex: 32,
      endIndex: 57,
      reason: 'Email with underscore and .co.uk TLD',
    },
    {
      value: 'support@helpdesk.io',
      shouldMatch: true,
      startIndex: 62,
      endIndex: 82,
      reason: 'Simple email with .io TLD',
    },
    {
      value: 'admin@system.net',
      shouldMatch: true,
      startIndex: 84,
      endIndex: 100,
      reason: 'Simple email with .net TLD',
    },
    {
      value: 'customer123@shop-online.com',
      shouldMatch: true,
      startIndex: 118,
      endIndex: 145,
      reason: 'Email with numbers and hyphen in domain',
    },
    {
      value: 'noreply@notifications.service.gov',
      shouldMatch: true,
      startIndex: 157,
      endIndex: 191,
      reason: 'Email with .gov TLD and subdomain',
    },
    {
      value: 'tech.support@sub.domain.example.org',
      shouldMatch: true,
      startIndex: 213,
      endIndex: 249,
      reason: 'Email with dots in local part and multiple subdomains',
    },
  ],
  category: 'support-ticket',
}

// packages/core/src/test-samples/email/plus-addressing.ts
var emailPlusAddressing = {
  id: 'email-plus-addressing',
  name: 'Email Plus Addressing',
  content: `User signed up with: john+newsletter@example.com
Another signup: jane+shopping@store.com
Tracking email: user+campaign2024@marketing.io
Filter test: admin+test123@company.net

Standard email for comparison: support@example.com`,
  expectedMatches: [
    {
      value: 'john+newsletter@example.com',
      shouldMatch: true,
      startIndex: 22,
      endIndex: 49,
      reason: 'Email with plus addressing for newsletter',
    },
    {
      value: 'jane+shopping@store.com',
      shouldMatch: true,
      startIndex: 66,
      endIndex: 89,
      reason: 'Email with plus addressing for shopping',
    },
    {
      value: 'user+campaign2024@marketing.io',
      shouldMatch: true,
      startIndex: 106,
      endIndex: 136,
      reason: 'Email with plus and numbers',
    },
    {
      value: 'admin+test123@company.net',
      shouldMatch: true,
      startIndex: 150,
      endIndex: 175,
      reason: 'Email with plus and alphanumeric tag',
    },
    {
      value: 'support@example.com',
      shouldMatch: true,
      startIndex: 212,
      endIndex: 231,
      reason: 'Standard email without plus',
    },
  ],
  category: 'logs',
}

// packages/core/src/test-samples/email/international.ts
var emailInternational = {
  id: 'email-international',
  name: 'International Email Formats',
  content: `UK contact: support@company.co.uk
Australian: info@business.com.au
German office: kontakt@firma.de
French branch: contact@entreprise.fr
Canadian: service@organization.ca
Indian office: help@company.co.in

Multi-level domain: admin@subdomain.company.co.uk`,
  expectedMatches: [
    {
      value: 'support@company.co.uk',
      shouldMatch: true,
      startIndex: 12,
      endIndex: 34,
      reason: 'UK domain with .co.uk',
    },
    {
      value: 'info@business.com.au',
      shouldMatch: true,
      startIndex: 48,
      endIndex: 68,
      reason: 'Australian domain with .com.au',
    },
    {
      value: 'kontakt@firma.de',
      shouldMatch: true,
      startIndex: 84,
      endIndex: 100,
      reason: 'German domain with .de',
    },
    {
      value: 'contact@entreprise.fr',
      shouldMatch: true,
      startIndex: 116,
      endIndex: 137,
      reason: 'French domain with .fr',
    },
    {
      value: 'service@organization.ca',
      shouldMatch: true,
      startIndex: 149,
      endIndex: 172,
      reason: 'Canadian domain with .ca',
    },
    {
      value: 'help@company.co.in',
      shouldMatch: true,
      startIndex: 188,
      endIndex: 206,
      reason: 'Indian domain with .co.in',
    },
    {
      value: 'admin@subdomain.company.co.uk',
      shouldMatch: true,
      startIndex: 230,
      endIndex: 260,
      reason: 'Multi-level UK domain',
    },
  ],
  category: 'support-ticket',
}

// packages/core/src/test-samples/email/false-positives.ts
var emailFalsePositives = {
  id: 'email-false-positives',
  name: 'URLs That Look Like Emails',
  content: `Website URL: https://example.com/contact
File path: /home/user@hostname/file.txt
Not an email: user@localhost
Also not: test@192.168.1.1

Valid emails to catch:
Contact: admin@example.com
Support: help@company.org`,
  expectedMatches: [
    {
      value: 'https://example.com/contact',
      shouldMatch: false,
      startIndex: 13,
      endIndex: 40,
      reason: 'HTTPS URL, not an email',
    },
    {
      value: '/home/user@hostname/file.txt',
      shouldMatch: false,
      startIndex: 52,
      endIndex: 81,
      reason: 'File path with @ symbol',
    },
    {
      value: 'user@localhost',
      shouldMatch: false,
      startIndex: 96,
      endIndex: 110,
      reason: 'Invalid: no TLD',
    },
    {
      value: 'test@192.168.1.1',
      shouldMatch: false,
      startIndex: 122,
      endIndex: 138,
      reason: 'IP address instead of domain',
    },
    {
      value: 'admin@example.com',
      shouldMatch: true,
      startIndex: 170,
      endIndex: 187,
      reason: 'Valid email',
    },
    {
      value: 'help@company.org',
      shouldMatch: true,
      startIndex: 198,
      endIndex: 214,
      reason: 'Valid email',
    },
  ],
  category: 'code',
}

// packages/core/src/test-samples/email/edge-cases.ts
var emailEdgeCases = {
  id: 'email-edge-cases',
  name: 'Email Edge Cases',
  content: `Hyphenated domain: user@my-company.com
Numbered local: user123@example.com
Dots and dashes: first.last@sub-domain.example.com
Percent sign: user%dept@company.com
Multiple dots: very.long.address.name@example.com

In sentence: Contact us at support@example.com for help.
Quoted: "admin@example.com"`,
  expectedMatches: [
    {
      value: 'user@my-company.com',
      shouldMatch: true,
      startIndex: 20,
      endIndex: 39,
      reason: 'Email with hyphenated domain',
    },
    {
      value: 'user123@example.com',
      shouldMatch: true,
      startIndex: 57,
      endIndex: 76,
      reason: 'Email with numbers in local part',
    },
    {
      value: 'first.last@sub-domain.example.com',
      shouldMatch: true,
      startIndex: 94,
      endIndex: 128,
      reason: 'Email with dots and hyphens',
    },
    {
      value: 'user%dept@company.com',
      shouldMatch: true,
      startIndex: 144,
      endIndex: 165,
      reason: 'Email with percent sign',
    },
    {
      value: 'very.long.address.name@example.com',
      shouldMatch: true,
      startIndex: 181,
      endIndex: 215,
      reason: 'Email with multiple dots',
    },
    {
      value: 'support@example.com',
      shouldMatch: true,
      startIndex: 246,
      endIndex: 265,
      reason: 'Email in sentence context',
    },
    {
      value: 'admin@example.com',
      shouldMatch: true,
      startIndex: 285,
      endIndex: 302,
      reason: 'Quoted email',
    },
  ],
  category: 'support-ticket',
}

// packages/core/src/test-samples/phone/us-formats.ts
var phoneUSFormats = {
  id: 'phone-us-formats',
  name: 'US Phone Number Formats',
  content: `Customer phone: (555) 123-4567
Alternative: 555-123-4567
Dots format: 555.123.4567
Spaces: 555 123 4567
With country code: 1-555-123-4567
Also valid: +1-555-123-4567

Contact support at (800) 555-0199 for assistance.`,
  expectedMatches: [
    {
      value: '(555) 123-4567',
      shouldMatch: true,
      startIndex: 16,
      endIndex: 30,
      reason: 'Standard format with parentheses',
    },
    {
      value: '555-123-4567',
      shouldMatch: true,
      startIndex: 45,
      endIndex: 57,
      reason: 'Dashes format',
    },
    {
      value: '555.123.4567',
      shouldMatch: true,
      startIndex: 72,
      endIndex: 84,
      reason: 'Dots format',
    },
    {
      value: '555 123 4567',
      shouldMatch: true,
      startIndex: 93,
      endIndex: 105,
      reason: 'Spaces format',
    },
    {
      value: '1-555-123-4567',
      shouldMatch: true,
      startIndex: 126,
      endIndex: 140,
      reason: 'With country code',
    },
    {
      value: '+1-555-123-4567',
      shouldMatch: true,
      startIndex: 154,
      endIndex: 169,
      reason: 'With plus and country code',
    },
    {
      value: '(800) 555-0199',
      shouldMatch: true,
      startIndex: 190,
      endIndex: 204,
      reason: 'Toll-free number in context',
    },
  ],
  category: 'support-ticket',
}

// packages/core/src/test-samples/phone/international.ts
var phoneInternational = {
  id: 'phone-international',
  name: 'International Phone Formats',
  content: `US: +1-555-123-4567
UK: +44-20-7123-4567
Canada: +1-604-555-0178
Australia: +61-2-9876-5432

Alternate formats:
US with parens: +1 (555) 123-4567
Mixed: 1-800-555-0100`,
  expectedMatches: [
    {
      value: '+1-555-123-4567',
      shouldMatch: true,
      startIndex: 4,
      endIndex: 19,
      reason: 'US number with country code',
    },
    {
      value: '+44-20-7123-4567',
      shouldMatch: false,
      startIndex: 24,
      endIndex: 40,
      reason: 'UK number - non-US format',
    },
    {
      value: '+1-604-555-0178',
      shouldMatch: true,
      startIndex: 50,
      endIndex: 65,
      reason: 'Canadian number (uses +1)',
    },
    {
      value: '+61-2-9876-5432',
      shouldMatch: false,
      startIndex: 78,
      endIndex: 93,
      reason: 'Australian number - non-US format',
    },
    {
      value: '+1 (555) 123-4567',
      shouldMatch: true,
      startIndex: 130,
      endIndex: 147,
      reason: 'US with country code and parens',
    },
    {
      value: '1-800-555-0100',
      shouldMatch: true,
      startIndex: 156,
      endIndex: 170,
      reason: 'US toll-free number',
    },
  ],
  category: 'support-ticket',
}

// packages/core/src/test-samples/phone/vanity-numbers.ts
var phoneVanityNumbers = {
  id: 'phone-vanity-numbers',
  name: 'Vanity Phone Numbers',
  content: `Call 1-800-FLOWERS for delivery
Support: 1-555-SUPPORT
Hotline: 800-CALL-NOW
Alternative: 1-800-GET-HELP

Regular numbers for comparison:
Direct: 555-123-4567
Main: (800) 555-0123`,
  expectedMatches: [
    {
      value: '1-800-FLOWERS',
      shouldMatch: true,
      startIndex: 5,
      endIndex: 18,
      reason: 'Vanity number with letters',
    },
    {
      value: '1-555-SUPPORT',
      shouldMatch: true,
      startIndex: 43,
      endIndex: 56,
      reason: 'Vanity support number',
    },
    {
      value: '800-CALL-NOW',
      shouldMatch: true,
      startIndex: 67,
      endIndex: 79,
      reason: 'Vanity hotline number',
    },
    {
      value: '1-800-GET-HELP',
      shouldMatch: true,
      startIndex: 95,
      endIndex: 109,
      reason: 'Vanity help number with hyphens',
    },
    {
      value: '555-123-4567',
      shouldMatch: true,
      startIndex: 155,
      endIndex: 167,
      reason: 'Regular numeric number',
    },
    {
      value: '(800) 555-0123',
      shouldMatch: true,
      startIndex: 175,
      endIndex: 189,
      reason: 'Regular toll-free with parens',
    },
  ],
  category: 'support-ticket',
}

// packages/core/src/test-samples/phone/false-positives.ts
var phoneFalsePositives = {
  id: 'phone-false-positives',
  name: 'Order Numbers vs Phone Numbers',
  content: `Order number: ORD-555-123-4567
Product code: SKU-800-999-8888
Serial: ABC123-456-7890
Date format: 2024-12-25-1234

Valid phone numbers:
Customer: (555) 123-4567
Support: 1-800-555-0100`,
  expectedMatches: [
    {
      value: 'ORD-555-123-4567',
      shouldMatch: false,
      startIndex: 14,
      endIndex: 30,
      reason: 'Order number, not a phone',
    },
    {
      value: 'SKU-800-999-8888',
      shouldMatch: false,
      startIndex: 46,
      endIndex: 62,
      reason: 'Product SKU, not a phone',
    },
    {
      value: 'ABC123-456-7890',
      shouldMatch: false,
      startIndex: 72,
      endIndex: 87,
      reason: 'Serial number with letters',
    },
    {
      value: '2024-12-25-1234',
      shouldMatch: false,
      startIndex: 102,
      endIndex: 117,
      reason: 'Date format',
    },
    {
      value: '(555) 123-4567',
      shouldMatch: true,
      startIndex: 151,
      endIndex: 165,
      reason: 'Valid phone number',
    },
    {
      value: '1-800-555-0100',
      shouldMatch: true,
      startIndex: 176,
      endIndex: 190,
      reason: 'Valid toll-free number',
    },
  ],
  category: 'logs',
}

// packages/core/src/test-samples/phone/parentheses.ts
var phoneParentheses = {
  id: 'phone-parentheses',
  name: 'Phone Numbers with Parentheses Edge Cases',
  content: `Standard: (555) 123-4567
Full wrap: (555-123-4567)
Area code only: (800)555-1234
With country: 1-(555)-123-4567

No parentheses: 555-123-4567
Mixed format: (555).123.4567`,
  expectedMatches: [
    {
      value: '(555) 123-4567',
      shouldMatch: true,
      startIndex: 10,
      endIndex: 24,
      reason: 'Standard format with area code in parens',
    },
    {
      value: '(555-123-4567)',
      shouldMatch: true,
      startIndex: 37,
      endIndex: 51,
      reason: 'Entire number wrapped in parens',
    },
    {
      value: '(800)555-1234',
      shouldMatch: true,
      startIndex: 69,
      endIndex: 82,
      reason: 'Area code with no space',
    },
    {
      value: '1-(555)-123-4567',
      shouldMatch: true,
      startIndex: 98,
      endIndex: 114,
      reason: 'Country code with area code in parens',
    },
    {
      value: '555-123-4567',
      shouldMatch: true,
      startIndex: 133,
      endIndex: 145,
      reason: 'No parentheses format',
    },
    {
      value: '(555).123.4567',
      shouldMatch: true,
      startIndex: 161,
      endIndex: 175,
      reason: 'Mixed parens and dots',
    },
  ],
  category: 'support-ticket',
}

// packages/core/src/test-samples/ssn/standard-format.ts
var ssnStandardFormat = {
  id: 'ssn-standard-format',
  name: 'Standard SSN Format',
  content: `Employee SSN: 123-45-6789
Applicant: 987-65-4321
Record ID: 555-12-3456

Customer information:
Name: John Doe
SSN: 234-56-7890
DOB: 01/15/1985`,
  expectedMatches: [
    {
      value: '123-45-6789',
      shouldMatch: true,
      startIndex: 15,
      endIndex: 26,
      reason: 'Standard SSN format',
    },
    {
      value: '987-65-4321',
      shouldMatch: true,
      startIndex: 39,
      endIndex: 50,
      reason: 'Standard SSN format',
    },
    {
      value: '555-12-3456',
      shouldMatch: true,
      startIndex: 63,
      endIndex: 74,
      reason: 'Standard SSN format',
    },
    {
      value: '234-56-7890',
      shouldMatch: true,
      startIndex: 119,
      endIndex: 130,
      reason: 'SSN in customer record',
    },
  ],
  category: 'support-ticket',
}

// packages/core/src/test-samples/ssn/false-positives.ts
var ssnFalsePositives = {
  id: 'ssn-false-positives',
  name: 'Date-like Patterns vs SSN',
  content: `Phone extension: 555-12-34567 (extra digit)
Date format: 12-31-2024 (not SSN)
Tracking: TRK-99-8877 (letters prefix)
Version: 10-15-2023

Valid SSNs:
Employee: 123-45-6789
Backup: 987-65-4321`,
  expectedMatches: [
    {
      value: '555-12-34567',
      shouldMatch: false,
      startIndex: 17,
      endIndex: 29,
      reason: 'Too many digits in last group',
    },
    {
      value: '12-31-2024',
      shouldMatch: false,
      startIndex: 55,
      endIndex: 65,
      reason: 'Date format, not SSN',
    },
    {
      value: 'TRK-99-8877',
      shouldMatch: false,
      startIndex: 80,
      endIndex: 91,
      reason: 'Has letter prefix',
    },
    {
      value: '10-15-2023',
      shouldMatch: false,
      startIndex: 116,
      endIndex: 126,
      reason: 'Date format',
    },
    {
      value: '123-45-6789',
      shouldMatch: true,
      startIndex: 151,
      endIndex: 162,
      reason: 'Valid SSN',
    },
    {
      value: '987-65-4321',
      shouldMatch: true,
      startIndex: 172,
      endIndex: 183,
      reason: 'Valid SSN',
    },
  ],
  category: 'logs',
}

// packages/core/src/test-samples/ssn/context-aware.ts
var ssnContextAware = {
  id: 'ssn-context-aware',
  name: 'SSN in Context',
  content: `Application Form:
SSN: 123-45-6789
Social Security Number: 234-56-7890
Tax ID (SSN): 345-67-8901

Please provide your SSN: 456-78-9012 for verification.

Last 4 of SSN: 5678 (partial - shouldn't match as full SSN)`,
  expectedMatches: [
    {
      value: '123-45-6789',
      shouldMatch: true,
      startIndex: 24,
      endIndex: 35,
      reason: 'SSN with label',
    },
    {
      value: '234-56-7890',
      shouldMatch: true,
      startIndex: 61,
      endIndex: 72,
      reason: 'SSN with full label',
    },
    {
      value: '345-67-8901',
      shouldMatch: true,
      startIndex: 88,
      endIndex: 99,
      reason: 'SSN labeled as Tax ID',
    },
    {
      value: '456-78-9012',
      shouldMatch: true,
      startIndex: 125,
      endIndex: 136,
      reason: 'SSN in sentence',
    },
  ],
  category: 'support-ticket',
}

// packages/core/src/test-samples/ssn/masked.ts
var ssnMasked = {
  id: 'ssn-masked',
  name: 'Masked SSN Formats',
  content: `Partially masked: XXX-XX-1234 (shouldn't match)
Also masked: ***-**-5678 (shouldn't match)
Full SSN displayed: 123-45-6789

For security, we show: XXX-XX-9012
Complete number needed: 234-56-7890`,
  expectedMatches: [
    {
      value: 'XXX-XX-1234',
      shouldMatch: false,
      startIndex: 18,
      endIndex: 29,
      reason: 'Partially masked with X',
    },
    {
      value: '***-**-5678',
      shouldMatch: false,
      startIndex: 56,
      endIndex: 67,
      reason: 'Partially masked with asterisks',
    },
    {
      value: '123-45-6789',
      shouldMatch: true,
      startIndex: 104,
      endIndex: 115,
      reason: 'Full unmasked SSN',
    },
    {
      value: 'XXX-XX-9012',
      shouldMatch: false,
      startIndex: 142,
      endIndex: 153,
      reason: 'Partially masked',
    },
    {
      value: '234-56-7890',
      shouldMatch: true,
      startIndex: 178,
      endIndex: 189,
      reason: 'Full unmasked SSN',
    },
  ],
  category: 'support-ticket',
}

// packages/core/src/test-samples/ssn/edge-cases.ts
var ssnEdgeCases = {
  id: 'ssn-edge-cases',
  name: 'SSN Edge Cases',
  content: `With spaces: 123 45 6789 (no dashes - shouldn't match standard pattern)
No separators: 123456789 (no dashes - shouldn't match)
Standard format: 234-56-7890 (should match)

Double dash: 345--67-8901 (invalid)
Correct: 456-78-9012`,
  expectedMatches: [
    {
      value: '123 45 6789',
      shouldMatch: false,
      startIndex: 13,
      endIndex: 24,
      reason: 'Spaces instead of dashes',
    },
    {
      value: '123456789',
      shouldMatch: false,
      startIndex: 76,
      endIndex: 85,
      reason: 'No separators',
    },
    {
      value: '234-56-7890',
      shouldMatch: true,
      startIndex: 133,
      endIndex: 144,
      reason: 'Standard format with dashes',
    },
    {
      value: '345--67-8901',
      shouldMatch: false,
      startIndex: 178,
      endIndex: 190,
      reason: 'Double dash - invalid',
    },
    {
      value: '456-78-9012',
      shouldMatch: true,
      startIndex: 210,
      endIndex: 221,
      reason: 'Standard format',
    },
  ],
  category: 'support-ticket',
}

// packages/core/src/test-samples/credit-card/visa.ts
var creditCardVisa = {
  id: 'credit-card-visa',
  name: 'Visa Card Numbers',
  content: `Visa Card: 4532-1234-5678-9010
Alternative: 4556-7890-1234-5678
No dashes: 4532123456789010
With spaces: 4556 7890 1234 5678

Payment method: Visa ending in 9010
Full number: 4916-5432-1098-7654`,
  expectedMatches: [
    {
      value: '4532-1234-5678-9010',
      shouldMatch: true,
      startIndex: 11,
      endIndex: 30,
      reason: 'Visa card with dashes (starts with 4)',
    },
    {
      value: '4556-7890-1234-5678',
      shouldMatch: true,
      startIndex: 45,
      endIndex: 64,
      reason: 'Visa card with dashes',
    },
    {
      value: '4532123456789010',
      shouldMatch: true,
      startIndex: 76,
      endIndex: 92,
      reason: 'Visa card without separators',
    },
    {
      value: '4556 7890 1234 5678',
      shouldMatch: true,
      startIndex: 106,
      endIndex: 125,
      reason: 'Visa card with spaces',
    },
    {
      value: '4916-5432-1098-7654',
      shouldMatch: true,
      startIndex: 177,
      endIndex: 196,
      reason: 'Visa card number',
    },
  ],
  category: 'support-ticket',
}

// packages/core/src/test-samples/credit-card/mastercard.ts
var creditCardMastercard = {
  id: 'credit-card-mastercard',
  name: 'Mastercard Numbers',
  content: `Mastercard: 5425-2334-3010-9903
Also Mastercard: 5105-1051-0510-5100
No separators: 5425233430109903
With spaces: 5105 1051 0510 5100

Card on file: 5555-5555-5555-4444
Backup card: 5425-1234-5678-9012`,
  expectedMatches: [
    {
      value: '5425-2334-3010-9903',
      shouldMatch: true,
      startIndex: 12,
      endIndex: 31,
      reason: 'Mastercard with dashes (starts with 5)',
    },
    {
      value: '5105-1051-0510-5100',
      shouldMatch: true,
      startIndex: 51,
      endIndex: 70,
      reason: 'Mastercard with dashes',
    },
    {
      value: '5425233430109903',
      shouldMatch: true,
      startIndex: 87,
      endIndex: 103,
      reason: 'Mastercard without separators',
    },
    {
      value: '5105 1051 0510 5100',
      shouldMatch: true,
      startIndex: 117,
      endIndex: 136,
      reason: 'Mastercard with spaces',
    },
    {
      value: '5555-5555-5555-4444',
      shouldMatch: true,
      startIndex: 152,
      endIndex: 171,
      reason: 'Mastercard on file',
    },
    {
      value: '5425-1234-5678-9012',
      shouldMatch: true,
      startIndex: 185,
      endIndex: 204,
      reason: 'Backup Mastercard',
    },
  ],
  category: 'support-ticket',
}

// packages/core/src/test-samples/credit-card/amex.ts
var creditCardAmex = {
  id: 'credit-card-amex',
  name: 'American Express Numbers',
  content: `Amex card: 3782-822463-10005
Alternative: 371449635398431 (no dashes)
With spaces: 3714 496353 98431

Corporate Amex: 3787-344936-71000
Personal: 3400-0000-0000-009`,
  expectedMatches: [
    {
      value: '3782-822463-10005',
      shouldMatch: true,
      startIndex: 11,
      endIndex: 28,
      reason: 'Amex 15-digit format (3-6-5)',
    },
    {
      value: '371449635398431',
      shouldMatch: true,
      startIndex: 43,
      endIndex: 58,
      reason: 'Amex without separators',
    },
    {
      value: '3714 496353 98431',
      shouldMatch: true,
      startIndex: 81,
      endIndex: 98,
      reason: 'Amex with spaces (4-6-5 format)',
    },
    {
      value: '3787-344936-71000',
      shouldMatch: true,
      startIndex: 116,
      endIndex: 133,
      reason: 'Corporate Amex',
    },
    {
      value: '3400-0000-0000-009',
      shouldMatch: true,
      startIndex: 145,
      endIndex: 163,
      reason: 'Amex format (starts with 34)',
    },
  ],
  category: 'support-ticket',
}

// packages/core/src/test-samples/credit-card/no-spaces.ts
var creditCardNoSpaces = {
  id: 'credit-card-no-spaces',
  name: 'Credit Cards Without Separators',
  content: `Visa: 4532123456789010
Mastercard: 5425233430109903
Amex: 371449635398431
Discover: 6011111111111117

For comparison with dashes:
Visa: 4532-1234-5678-9010
Mastercard: 5425-2334-3010-9903`,
  expectedMatches: [
    {
      value: '4532123456789010',
      shouldMatch: true,
      startIndex: 6,
      endIndex: 22,
      reason: 'Visa without separators',
    },
    {
      value: '5425233430109903',
      shouldMatch: true,
      startIndex: 36,
      endIndex: 52,
      reason: 'Mastercard without separators',
    },
    {
      value: '371449635398431',
      shouldMatch: true,
      startIndex: 59,
      endIndex: 74,
      reason: 'Amex 15 digits',
    },
    {
      value: '6011111111111117',
      shouldMatch: true,
      startIndex: 85,
      endIndex: 101,
      reason: 'Discover card',
    },
    {
      value: '4532-1234-5678-9010',
      shouldMatch: true,
      startIndex: 137,
      endIndex: 156,
      reason: 'Visa with dashes',
    },
    {
      value: '5425-2334-3010-9903',
      shouldMatch: true,
      startIndex: 170,
      endIndex: 189,
      reason: 'Mastercard with dashes',
    },
  ],
  category: 'support-ticket',
}

// packages/core/src/test-samples/credit-card/false-positives.ts
var creditCardFalsePositives = {
  id: 'credit-card-false-positives',
  name: 'Long Numbers vs Credit Cards',
  content: `Order ID: 9876-5432-1098-7654 (starts with 9, not valid card)
Account: 1234-5678-9012-3456 (starts with 1, not valid card)
Tracking: 8765-4321-0987-6543 (starts with 8, not valid card)

Valid credit cards:
Visa: 4532-1234-5678-9010
Mastercard: 5425-2334-3010-9903`,
  expectedMatches: [
    {
      value: '9876-5432-1098-7654',
      shouldMatch: false,
      startIndex: 10,
      endIndex: 29,
      reason: 'Not a valid card prefix (9)',
    },
    {
      value: '1234-5678-9012-3456',
      shouldMatch: false,
      startIndex: 73,
      endIndex: 92,
      reason: 'Not a valid card prefix (1)',
    },
    {
      value: '8765-4321-0987-6543',
      shouldMatch: false,
      startIndex: 137,
      endIndex: 156,
      reason: 'Not a valid card prefix (8)',
    },
    {
      value: '4532-1234-5678-9010',
      shouldMatch: true,
      startIndex: 190,
      endIndex: 209,
      reason: 'Valid Visa card',
    },
    {
      value: '5425-2334-3010-9903',
      shouldMatch: true,
      startIndex: 223,
      endIndex: 242,
      reason: 'Valid Mastercard',
    },
  ],
  category: 'logs',
}

// packages/core/src/test-samples/mac-address/colon-format.ts
var macAddressColonFormat = {
  id: 'mac-address-colon-format',
  name: 'MAC Address with Colons',
  content: `Network Interface:
eth0: 00:1B:44:11:3A:B8
wlan0: A4:5E:60:E2:91:3F
eth1: 08:00:27:12:34:56

Router MAC: 00:11:22:33:44:55
Device: FF:FF:FF:FF:FF:FF (broadcast)`,
  expectedMatches: [
    {
      value: '00:1B:44:11:3A:B8',
      shouldMatch: true,
      startIndex: 27,
      endIndex: 44,
      reason: 'Standard MAC with colons',
    },
    {
      value: 'A4:5E:60:E2:91:3F',
      shouldMatch: true,
      startIndex: 53,
      endIndex: 70,
      reason: 'MAC with uppercase letters',
    },
    {
      value: '08:00:27:12:34:56',
      shouldMatch: true,
      startIndex: 79,
      endIndex: 96,
      reason: 'VirtualBox MAC prefix',
    },
    {
      value: '00:11:22:33:44:55',
      shouldMatch: true,
      startIndex: 110,
      endIndex: 127,
      reason: 'Sequential MAC',
    },
    {
      value: 'FF:FF:FF:FF:FF:FF',
      shouldMatch: true,
      startIndex: 137,
      endIndex: 154,
      reason: 'Broadcast MAC address',
    },
  ],
  category: 'network',
}

// packages/core/src/test-samples/mac-address/dash-format.ts
var macAddressDashFormat = {
  id: 'mac-address-dash-format',
  name: 'MAC Address with Dashes',
  content: `Windows format:
Network adapter: 00-1B-44-11-3A-B8
WiFi card: A4-5E-60-E2-91-3F
Ethernet: 08-00-27-12-34-56

Physical Address: 00-11-22-33-44-55
Default gateway MAC: FF-FF-FF-FF-FF-FF`,
  expectedMatches: [
    {
      value: '00-1B-44-11-3A-B8',
      shouldMatch: true,
      startIndex: 34,
      endIndex: 51,
      reason: 'Windows-style MAC with dashes',
    },
    {
      value: 'A4-5E-60-E2-91-3F',
      shouldMatch: true,
      startIndex: 64,
      endIndex: 81,
      reason: 'MAC with uppercase and dashes',
    },
    {
      value: '08-00-27-12-34-56',
      shouldMatch: true,
      startIndex: 93,
      endIndex: 110,
      reason: 'VirtualBox MAC with dashes',
    },
    {
      value: '00-11-22-33-44-55',
      shouldMatch: true,
      startIndex: 130,
      endIndex: 147,
      reason: 'Physical address format',
    },
    {
      value: 'FF-FF-FF-FF-FF-FF',
      shouldMatch: true,
      startIndex: 170,
      endIndex: 187,
      reason: 'Broadcast MAC with dashes',
    },
  ],
  category: 'network',
}

// packages/core/src/test-samples/mac-address/cisco-format.ts
var macAddressCiscoFormat = {
  id: 'mac-address-cisco-format',
  name: 'Cisco MAC Address Format',
  content: `Cisco device output:
MAC Address: 001B.4411.3AB8
Switch port: A45E.60E2.913F
Router: 0800.2712.3456

Interface GigabitEthernet0/1: 0011.2233.4455
VLAN 10: FFFF.FFFF.FFFF`,
  expectedMatches: [
    {
      value: '001B.4411.3AB8',
      shouldMatch: true,
      startIndex: 34,
      endIndex: 48,
      reason: 'Cisco format with dots (4-4-4)',
    },
    {
      value: 'A45E.60E2.913F',
      shouldMatch: true,
      startIndex: 62,
      endIndex: 76,
      reason: 'Cisco format uppercase',
    },
    {
      value: '0800.2712.3456',
      shouldMatch: true,
      startIndex: 86,
      endIndex: 100,
      reason: 'Router MAC in Cisco format',
    },
    {
      value: '0011.2233.4455',
      shouldMatch: true,
      startIndex: 133,
      endIndex: 147,
      reason: 'Interface MAC',
    },
    {
      value: 'FFFF.FFFF.FFFF',
      shouldMatch: true,
      startIndex: 157,
      endIndex: 171,
      reason: 'Broadcast in Cisco format',
    },
  ],
  category: 'network',
}

// packages/core/src/test-samples/mac-address/lowercase.ts
var macAddressLowercase = {
  id: 'mac-address-lowercase',
  name: 'Lowercase MAC Addresses',
  content: `Linux output:
eth0: 00:1b:44:11:3a:b8
wlan0: a4:5e:60:e2:91:3f
docker0: 08:00:27:12:34:56

Mixed case for comparison:
Interface: 00:1B:44:11:3A:B8
Device: A4:5e:60:E2:91:3f`,
  expectedMatches: [
    {
      value: '00:1b:44:11:3a:b8',
      shouldMatch: true,
      startIndex: 21,
      endIndex: 38,
      reason: 'Lowercase MAC address',
    },
    {
      value: 'a4:5e:60:e2:91:3f',
      shouldMatch: true,
      startIndex: 47,
      endIndex: 64,
      reason: 'All lowercase letters',
    },
    {
      value: '08:00:27:12:34:56',
      shouldMatch: true,
      startIndex: 76,
      endIndex: 93,
      reason: 'Numeric and lowercase',
    },
    {
      value: '00:1B:44:11:3A:B8',
      shouldMatch: true,
      startIndex: 130,
      endIndex: 147,
      reason: 'Uppercase MAC for comparison',
    },
    {
      value: 'A4:5e:60:E2:91:3f',
      shouldMatch: true,
      startIndex: 157,
      endIndex: 174,
      reason: 'Mixed case MAC',
    },
  ],
  category: 'network',
}

// packages/core/src/test-samples/mac-address/network-config.ts
var macAddressNetworkConfig = {
  id: 'mac-address-network-config',
  name: 'MAC Addresses in Network Config',
  content: `# Network Configuration
iface eth0 inet static
  address 192.168.1.10
  hwaddr 00:1B:44:11:3A:B8

# DHCP Reservations
host server1 {
  hardware ethernet A4:5E:60:E2:91:3F;
  fixed-address 10.0.0.50;
}

# ARP Table
10.0.0.100 at 08:00:27:12:34:56 on en0`,
  expectedMatches: [
    {
      value: '192.168.1.10',
      shouldMatch: true,
      startIndex: 58,
      endIndex: 70,
      reason: 'IP address in config',
    },
    {
      value: '00:1B:44:11:3A:B8',
      shouldMatch: true,
      startIndex: 82,
      endIndex: 99,
      reason: 'Hardware address (MAC)',
    },
    {
      value: 'A4:5E:60:E2:91:3F',
      shouldMatch: true,
      startIndex: 161,
      endIndex: 178,
      reason: 'MAC in DHCP reservation',
    },
    {
      value: '10.0.0.50',
      shouldMatch: true,
      startIndex: 196,
      endIndex: 205,
      reason: 'Fixed IP address',
    },
    {
      value: '10.0.0.100',
      shouldMatch: true,
      startIndex: 222,
      endIndex: 232,
      reason: 'IP in ARP table',
    },
    {
      value: '08:00:27:12:34:56',
      shouldMatch: true,
      startIndex: 236,
      endIndex: 253,
      reason: 'MAC in ARP table',
    },
  ],
  category: 'config',
}

// packages/core/src/test-samples/hostname/fqdn.ts
var hostnameFQDN = {
  id: 'hostname-fqdn',
  name: 'Fully Qualified Domain Names',
  content: `Mail server: mail.example.com
Web server: www.company.org
API endpoint: api.service.net
Database: db.internal.local

FTP server: ftp.downloads.example.com
Admin portal: admin.secure.company.co.uk`,
  expectedMatches: [
    {
      value: 'mail.example.com',
      shouldMatch: true,
      startIndex: 13,
      endIndex: 29,
      reason: 'Mail server FQDN',
    },
    {
      value: 'www.company.org',
      shouldMatch: true,
      startIndex: 43,
      endIndex: 58,
      reason: 'Web server FQDN',
    },
    {
      value: 'api.service.net',
      shouldMatch: true,
      startIndex: 74,
      endIndex: 89,
      reason: 'API endpoint FQDN',
    },
    {
      value: 'db.internal.local',
      shouldMatch: true,
      startIndex: 101,
      endIndex: 118,
      reason: 'Internal database hostname',
    },
    {
      value: 'ftp.downloads.example.com',
      shouldMatch: true,
      startIndex: 133,
      endIndex: 158,
      reason: 'FTP server with subdomain',
    },
    {
      value: 'admin.secure.company.co.uk',
      shouldMatch: true,
      startIndex: 174,
      endIndex: 200,
      reason: 'Admin portal with .co.uk TLD',
    },
  ],
  category: 'config',
}

// packages/core/src/test-samples/hostname/subdomains.ts
var hostnameSubdomains = {
  id: 'hostname-subdomains',
  name: 'Multi-level Subdomains',
  content: `API staging: api.staging.internal.company.net
Production DB: db.prod.us-east-1.cloud.example.com
Dev environment: app.dev.local.test.org

Microservice: user-service.v2.api.company.io
CDN: static.cdn.global.example.com`,
  expectedMatches: [
    {
      value: 'api.staging.internal.company.net',
      shouldMatch: true,
      startIndex: 13,
      endIndex: 46,
      reason: 'Multi-level staging hostname',
    },
    {
      value: 'db.prod.us-east-1.cloud.example.com',
      shouldMatch: true,
      startIndex: 63,
      endIndex: 99,
      reason: 'Cloud database with region',
    },
    {
      value: 'app.dev.local.test.org',
      shouldMatch: true,
      startIndex: 117,
      endIndex: 139,
      reason: 'Development environment',
    },
    {
      value: 'user-service.v2.api.company.io',
      shouldMatch: true,
      startIndex: 155,
      endIndex: 186,
      reason: 'Versioned microservice hostname',
    },
    {
      value: 'static.cdn.global.example.com',
      shouldMatch: true,
      startIndex: 192,
      endIndex: 221,
      reason: 'CDN hostname',
    },
  ],
  category: 'network',
}

// packages/core/src/test-samples/hostname/urls.ts
var hostnameURLs = {
  id: 'hostname-urls',
  name: 'Hostnames in URL Context',
  content: `Visit https://www.example.com for more info
API call to http://api.service.net/v1/users
Documentation: https://docs.company.org/guide

Internal: http://admin.internal.local:8080
Secure: https://secure.payment.company.co.uk/checkout`,
  expectedMatches: [
    {
      value: 'www.example.com',
      shouldMatch: true,
      startIndex: 14,
      endIndex: 29,
      reason: 'Hostname in HTTPS URL',
    },
    {
      value: 'api.service.net',
      shouldMatch: true,
      startIndex: 61,
      endIndex: 76,
      reason: 'Hostname in API URL',
    },
    {
      value: 'docs.company.org',
      shouldMatch: true,
      startIndex: 109,
      endIndex: 125,
      reason: 'Documentation hostname',
    },
    {
      value: 'admin.internal.local',
      shouldMatch: true,
      startIndex: 149,
      endIndex: 169,
      reason: 'Internal hostname with port',
    },
    {
      value: 'secure.payment.company.co.uk',
      shouldMatch: true,
      startIndex: 189,
      endIndex: 217,
      reason: 'Secure payment hostname',
    },
  ],
  category: 'logs',
}

// packages/core/src/test-samples/hostname/dns-records.ts
var hostnameDNSRecords = {
  id: 'hostname-dns-records',
  name: 'DNS Record Output',
  content: `DNS Query Results:
mail.example.com.      300 IN A     192.0.2.1
www.company.org.       3600 IN A    198.51.100.1
api.service.net.       1800 IN CNAME lb.service.net.

MX Records:
example.com.           3600 IN MX   10 mail.example.com.`,
  expectedMatches: [
    {
      value: 'mail.example.com',
      shouldMatch: true,
      startIndex: 19,
      endIndex: 35,
      reason: 'Mail server in DNS A record',
    },
    {
      value: '192.0.2.1',
      shouldMatch: true,
      startIndex: 52,
      endIndex: 61,
      reason: 'IP address in A record',
    },
    {
      value: 'www.company.org',
      shouldMatch: true,
      startIndex: 62,
      endIndex: 77,
      reason: 'Web server in DNS A record',
    },
    {
      value: '198.51.100.1',
      shouldMatch: true,
      startIndex: 96,
      endIndex: 108,
      reason: 'IP in A record',
    },
    {
      value: 'api.service.net',
      shouldMatch: true,
      startIndex: 109,
      endIndex: 124,
      reason: 'API hostname in CNAME',
    },
    {
      value: 'lb.service.net',
      shouldMatch: true,
      startIndex: 141,
      endIndex: 155,
      reason: 'Load balancer CNAME target',
    },
    {
      value: 'example.com',
      shouldMatch: true,
      startIndex: 173,
      endIndex: 184,
      reason: 'Domain in MX record',
    },
    {
      value: 'mail.example.com',
      shouldMatch: true,
      startIndex: 206,
      endIndex: 222,
      reason: 'Mail server in MX record',
    },
  ],
  category: 'network',
}

// packages/core/src/test-samples/hostname/false-positives.ts
var hostnameFalsePositives = {
  id: 'hostname-false-positives',
  name: 'File Paths vs Hostnames',
  content: `File path: /var/www/html/index.html (not a hostname)
Local path: C:\\Users\\admin\\file.txt (not a hostname)
Relative: ../config/settings.json (not a hostname)

Valid hostnames:
Web: www.example.com
API: api.service.net`,
  expectedMatches: [
    {
      value: '/var/www/html/index.html',
      shouldMatch: false,
      startIndex: 11,
      endIndex: 35,
      reason: 'Unix file path',
    },
    {
      value: 'C:\\Users\\admin\\file.txt',
      shouldMatch: false,
      startIndex: 63,
      endIndex: 86,
      reason: 'Windows file path',
    },
    {
      value: '../config/settings.json',
      shouldMatch: false,
      startIndex: 113,
      endIndex: 136,
      reason: 'Relative path',
    },
    {
      value: 'www.example.com',
      shouldMatch: true,
      startIndex: 173,
      endIndex: 188,
      reason: 'Valid hostname',
    },
    {
      value: 'api.service.net',
      shouldMatch: true,
      startIndex: 195,
      endIndex: 210,
      reason: 'Valid hostname',
    },
  ],
  category: 'code',
}

// packages/core/src/test-samples/ticket/case-format.ts
var ticketCaseFormat = {
  id: 'ticket-case-format',
  name: 'CASE Ticket Numbers',
  content: `Support ticket: CASE-123456
Follow-up on CASE-789012
Related to case CASE-345678

Customer inquiry: CASE-901234
Resolved: CASE-567890`,
  expectedMatches: [
    {
      value: 'CASE-123456',
      shouldMatch: true,
      startIndex: 16,
      endIndex: 27,
      reason: 'Support ticket in CASE format',
    },
    {
      value: 'CASE-789012',
      shouldMatch: true,
      startIndex: 40,
      endIndex: 51,
      reason: 'Follow-up ticket',
    },
    {
      value: 'CASE-345678',
      shouldMatch: true,
      startIndex: 68,
      endIndex: 79,
      reason: 'Related ticket',
    },
    {
      value: 'CASE-901234',
      shouldMatch: true,
      startIndex: 100,
      endIndex: 111,
      reason: 'Customer inquiry ticket',
    },
    {
      value: 'CASE-567890',
      shouldMatch: true,
      startIndex: 123,
      endIndex: 134,
      reason: 'Resolved ticket',
    },
  ],
  category: 'support-ticket',
}

// packages/core/src/test-samples/ticket/ticket-hash.ts
var ticketHashFormat = {
  id: 'ticket-ticket-hash',
  name: 'Ticket # Format',
  content: `Please reference Ticket #12345
Following up on Ticket #67890
Support Ticket #11111 has been resolved

Issue number: Ticket #99999
See Ticket #54321 for details`,
  expectedMatches: [
    {
      value: 'Ticket #12345',
      shouldMatch: true,
      startIndex: 19,
      endIndex: 32,
      reason: 'Ticket with hash number',
    },
    {
      value: 'Ticket #67890',
      shouldMatch: true,
      startIndex: 49,
      endIndex: 62,
      reason: 'Follow-up ticket with hash',
    },
    {
      value: 'Ticket #11111',
      shouldMatch: true,
      startIndex: 71,
      endIndex: 84,
      reason: 'Resolved ticket with hash',
    },
    {
      value: 'Ticket #99999',
      shouldMatch: true,
      startIndex: 117,
      endIndex: 130,
      reason: 'Issue ticket with hash',
    },
    {
      value: 'Ticket #54321',
      shouldMatch: true,
      startIndex: 136,
      endIndex: 149,
      reason: 'Reference ticket with hash',
    },
  ],
  category: 'support-ticket',
}

// packages/core/src/test-samples/ticket/jira-format.ts
var ticketJiraFormat = {
  id: 'ticket-jira-format',
  name: 'JIRA Ticket Format',
  content: `Working on PROJ-1234 today
Bug fix in WEBAPP-5678
Feature request: API-9012

Dependencies: CORE-3456, AUTH-7890
Blocked by INFRA-1111`,
  expectedMatches: [
    {
      value: 'PROJ-1234',
      shouldMatch: true,
      startIndex: 11,
      endIndex: 20,
      reason: 'JIRA project ticket',
    },
    {
      value: 'WEBAPP-5678',
      shouldMatch: true,
      startIndex: 39,
      endIndex: 50,
      reason: 'Web app JIRA ticket',
    },
    {
      value: 'API-9012',
      shouldMatch: true,
      startIndex: 70,
      endIndex: 78,
      reason: 'API feature JIRA ticket',
    },
    {
      value: 'CORE-3456',
      shouldMatch: true,
      startIndex: 94,
      endIndex: 103,
      reason: 'Core dependency ticket',
    },
    {
      value: 'AUTH-7890',
      shouldMatch: true,
      startIndex: 105,
      endIndex: 114,
      reason: 'Auth dependency ticket',
    },
    {
      value: 'INFRA-1111',
      shouldMatch: true,
      startIndex: 127,
      endIndex: 137,
      reason: 'Infrastructure blocker',
    },
  ],
  category: 'support-ticket',
}

// packages/core/src/test-samples/ticket/support-logs.ts
var ticketSupportLogs = {
  id: 'ticket-support-logs',
  name: 'Ticket Numbers in Support Logs',
  content: `[2024-11-28 10:30:15] Ticket #12345 created by customer
[2024-11-28 10:45:22] CASE-67890 assigned to agent Smith
[2024-11-28 11:00:10] PROJ-1111 updated with new comment
[2024-11-28 11:15:45] Ticket #99999 marked as resolved
[2024-11-28 11:30:00] WEBAPP-5555 moved to in-progress`,
  expectedMatches: [
    {
      value: 'Ticket #12345',
      shouldMatch: true,
      startIndex: 22,
      endIndex: 35,
      reason: 'Ticket created in log',
    },
    {
      value: 'CASE-67890',
      shouldMatch: true,
      startIndex: 76,
      endIndex: 86,
      reason: 'CASE assigned in log',
    },
    {
      value: 'PROJ-1111',
      shouldMatch: true,
      startIndex: 127,
      endIndex: 136,
      reason: 'Project ticket updated',
    },
    {
      value: 'Ticket #99999',
      shouldMatch: true,
      startIndex: 177,
      endIndex: 190,
      reason: 'Ticket resolved in log',
    },
    {
      value: 'WEBAPP-5555',
      shouldMatch: true,
      startIndex: 230,
      endIndex: 241,
      reason: 'Webapp ticket status change',
    },
  ],
  category: 'logs',
}

// packages/core/src/test-samples/ticket/false-positives.ts
var ticketFalsePositives = {
  id: 'ticket-false-positives',
  name: 'Random Text vs Ticket Numbers',
  content: `Product code: SKU-12345 (not a ticket)
Tracking number: TRK-67890 (not a ticket)
Random text: ABC-XYZ-999 (not a ticket)

Valid tickets:
Issue: CASE-123456
Bug: PROJ-7890`,
  expectedMatches: [
    {
      value: 'SKU-12345',
      shouldMatch: false,
      startIndex: 14,
      endIndex: 23,
      reason: 'Product SKU, not a ticket',
    },
    {
      value: 'TRK-67890',
      shouldMatch: false,
      startIndex: 57,
      endIndex: 66,
      reason: 'Tracking number, not a ticket',
    },
    {
      value: 'ABC-XYZ-999',
      shouldMatch: false,
      startIndex: 95,
      endIndex: 106,
      reason: 'Random text pattern',
    },
    {
      value: 'CASE-123456',
      shouldMatch: true,
      startIndex: 142,
      endIndex: 153,
      reason: 'Valid CASE ticket',
    },
    {
      value: 'PROJ-7890',
      shouldMatch: true,
      startIndex: 160,
      endIndex: 169,
      reason: 'Valid PROJ ticket',
    },
  ],
  category: 'logs',
}

// packages/core/src/test-samples/name/full-names.ts
var nameFullNames = {
  id: 'name-full-names',
  name: 'Full Names',
  content: `Customer: John Doe
Agent: Jane Smith
Manager: Michael Johnson

Contact information:
Name: Sarah Williams
Account holder: Robert Brown`,
  expectedMatches: [
    {
      value: 'John Doe',
      shouldMatch: true,
      startIndex: 10,
      endIndex: 18,
      reason: 'Full name - first and last',
    },
    {
      value: 'Jane Smith',
      shouldMatch: true,
      startIndex: 27,
      endIndex: 37,
      reason: 'Agent full name',
    },
    {
      value: 'Michael Johnson',
      shouldMatch: true,
      startIndex: 48,
      endIndex: 63,
      reason: 'Manager full name',
    },
    {
      value: 'Sarah Williams',
      shouldMatch: true,
      startIndex: 92,
      endIndex: 106,
      reason: 'Customer full name',
    },
    {
      value: 'Robert Brown',
      shouldMatch: true,
      startIndex: 124,
      endIndex: 136,
      reason: 'Account holder name',
    },
  ],
  category: 'support-ticket',
}

// packages/core/src/test-samples/name/first-only.ts
var nameFirstOnly = {
  id: 'name-first-only',
  name: 'First Names Only',
  content: `Hi John, thanks for contacting us.
Hello Sarah, we received your request.
Dear Michael, your order is ready.

Customer John called about billing.
Agent Jane will assist you.`,
  expectedMatches: [
    {
      value: 'John',
      shouldMatch: true,
      startIndex: 3,
      endIndex: 7,
      reason: 'First name in greeting',
    },
    {
      value: 'Sarah',
      shouldMatch: true,
      startIndex: 40,
      endIndex: 45,
      reason: 'First name in hello',
    },
    {
      value: 'Michael',
      shouldMatch: true,
      startIndex: 74,
      endIndex: 81,
      reason: 'First name in letter',
    },
    {
      value: 'John',
      shouldMatch: true,
      startIndex: 113,
      endIndex: 117,
      reason: 'First name in context',
    },
    {
      value: 'Jane',
      shouldMatch: true,
      startIndex: 149,
      endIndex: 153,
      reason: 'Agent first name',
    },
  ],
  category: 'support-ticket',
}

// packages/core/src/test-samples/name/last-only.ts
var nameLastOnly = {
  id: 'name-last-only',
  name: 'Last Names Only',
  content: `Mr. Smith will handle your case.
Contact Ms. Johnson for assistance.
Dr. Williams is available today.

Account managed by Anderson.
Report submitted by Davis.`,
  expectedMatches: [
    {
      value: 'Smith',
      shouldMatch: true,
      startIndex: 4,
      endIndex: 9,
      reason: 'Last name with title',
    },
    {
      value: 'Johnson',
      shouldMatch: true,
      startIndex: 44,
      endIndex: 51,
      reason: 'Last name with Ms.',
    },
    {
      value: 'Williams',
      shouldMatch: true,
      startIndex: 73,
      endIndex: 81,
      reason: 'Last name with Dr.',
    },
    {
      value: 'Anderson',
      shouldMatch: true,
      startIndex: 121,
      endIndex: 129,
      reason: 'Last name without title',
    },
    {
      value: 'Davis',
      shouldMatch: true,
      startIndex: 151,
      endIndex: 156,
      reason: 'Last name in context',
    },
  ],
  category: 'support-ticket',
}

// packages/core/src/test-samples/name/support-tickets.ts
var nameSupportTickets = {
  id: 'name-support-tickets',
  name: 'Names in Support Tickets',
  content: `Ticket #12345
Customer: John Doe
Email: john.doe@example.com
Issue: Billing question

Ticket #67890
Customer: Jane Smith
Phone: (555) 123-4567
Issue: Technical support request`,
  expectedMatches: [
    {
      value: 'Ticket #12345',
      shouldMatch: true,
      startIndex: 0,
      endIndex: 13,
      reason: 'Ticket number',
    },
    {
      value: 'John Doe',
      shouldMatch: true,
      startIndex: 25,
      endIndex: 33,
      reason: 'Customer name',
    },
    {
      value: 'john.doe@example.com',
      shouldMatch: true,
      startIndex: 42,
      endIndex: 62,
      reason: 'Customer email',
    },
    {
      value: 'Ticket #67890',
      shouldMatch: true,
      startIndex: 83,
      endIndex: 96,
      reason: 'Ticket number',
    },
    {
      value: 'Jane Smith',
      shouldMatch: true,
      startIndex: 108,
      endIndex: 118,
      reason: 'Customer name',
    },
    {
      value: '(555) 123-4567',
      shouldMatch: true,
      startIndex: 127,
      endIndex: 141,
      reason: 'Customer phone',
    },
  ],
  category: 'support-ticket',
}

// packages/core/src/test-samples/name/false-positives.ts
var nameFalsePositives = {
  id: 'name-false-positives',
  name: 'Brand Names vs People Names',
  content: `Company: Apple Computer
Brand: Amazon Web Services
Product: Microsoft Office

Valid person names:
Customer: John Smith
Contact: Sarah Johnson`,
  expectedMatches: [
    {
      value: 'Apple',
      shouldMatch: false,
      startIndex: 9,
      endIndex: 14,
      reason: 'Brand name, not a person',
    },
    {
      value: 'Amazon',
      shouldMatch: false,
      startIndex: 33,
      endIndex: 39,
      reason: 'Company name, not a person',
    },
    {
      value: 'Microsoft',
      shouldMatch: false,
      startIndex: 63,
      endIndex: 72,
      reason: 'Company name, not a person',
    },
    {
      value: 'John Smith',
      shouldMatch: true,
      startIndex: 109,
      endIndex: 119,
      reason: 'Valid person name',
    },
    {
      value: 'Sarah Johnson',
      shouldMatch: true,
      startIndex: 130,
      endIndex: 143,
      reason: 'Valid person name',
    },
  ],
  category: 'support-ticket',
}

// packages/core/src/test-samples/uuid/standard.ts
var uuidStandard = {
  id: 'uuid-standard',
  name: 'Standard UUID Format',
  content: `User ID: 550e8400-e29b-41d4-a716-446655440000
Session: 6ba7b810-9dad-11d1-80b4-00c04fd430c8
Request ID: 7c9e6679-7425-40de-944b-e07fc1f90ae7

Transaction: 3f4e5d6c-7b8a-9c0d-1e2f-3a4b5c6d7e8f
Entity: 8a7b6c5d-4e3f-2a1b-9c8d-7e6f5a4b3c2d`,
  expectedMatches: [
    {
      value: '550e8400-e29b-41d4-a716-446655440000',
      shouldMatch: true,
      startIndex: 9,
      endIndex: 45,
      reason: 'Standard UUID v4',
    },
    {
      value: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
      shouldMatch: true,
      startIndex: 55,
      endIndex: 91,
      reason: 'UUID v1 format',
    },
    {
      value: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
      shouldMatch: true,
      startIndex: 104,
      endIndex: 140,
      reason: 'Request tracking UUID',
    },
    {
      value: '3f4e5d6c-7b8a-9c0d-1e2f-3a4b5c6d7e8f',
      shouldMatch: true,
      startIndex: 155,
      endIndex: 191,
      reason: 'Transaction UUID',
    },
    {
      value: '8a7b6c5d-4e3f-2a1b-9c8d-7e6f5a4b3c2d',
      shouldMatch: true,
      startIndex: 201,
      endIndex: 237,
      reason: 'Entity UUID',
    },
  ],
  category: 'logs',
}

// packages/core/src/test-samples/uuid/uppercase.ts
var uuidUppercase = {
  id: 'uuid-uppercase',
  name: 'Uppercase UUID Variants',
  content: `ID: 550E8400-E29B-41D4-A716-446655440000
Ref: 6BA7B810-9DAD-11D1-80B4-00C04FD430C8
Mixed case: 7c9E6679-7425-40DE-944b-e07FC1f90ae7

Lowercase for comparison:
ID: 550e8400-e29b-41d4-a716-446655440000`,
  expectedMatches: [
    {
      value: '550E8400-E29B-41D4-A716-446655440000',
      shouldMatch: true,
      startIndex: 4,
      endIndex: 40,
      reason: 'Uppercase UUID',
    },
    {
      value: '6BA7B810-9DAD-11D1-80B4-00C04FD430C8',
      shouldMatch: true,
      startIndex: 46,
      endIndex: 82,
      reason: 'All uppercase UUID',
    },
    {
      value: '7c9E6679-7425-40DE-944b-e07FC1f90ae7',
      shouldMatch: true,
      startIndex: 95,
      endIndex: 131,
      reason: 'Mixed case UUID',
    },
    {
      value: '550e8400-e29b-41d4-a716-446655440000',
      shouldMatch: true,
      startIndex: 161,
      endIndex: 197,
      reason: 'Lowercase UUID',
    },
  ],
  category: 'logs',
}

// packages/core/src/test-samples/uuid/log-files.ts
var uuidLogFiles = {
  id: 'uuid-log-files',
  name: 'UUIDs in Application Logs',
  content: `[2024-11-28 10:30:15] INFO User login: user_id=550e8400-e29b-41d4-a716-446655440000
[2024-11-28 10:30:16] DEBUG Session created: session_id=6ba7b810-9dad-11d1-80b4-00c04fd430c8
[2024-11-28 10:30:17] INFO Request received: request_id=7c9e6679-7425-40de-944b-e07fc1f90ae7
[2024-11-28 10:30:18] ERROR Transaction failed: tx_id=3f4e5d6c-7b8a-9c0d-1e2f-3a4b5c6d7e8f`,
  expectedMatches: [
    {
      value: '550e8400-e29b-41d4-a716-446655440000',
      shouldMatch: true,
      startIndex: 47,
      endIndex: 83,
      reason: 'User ID UUID in log',
    },
    {
      value: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
      shouldMatch: true,
      startIndex: 142,
      endIndex: 178,
      reason: 'Session ID UUID',
    },
    {
      value: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
      shouldMatch: true,
      startIndex: 238,
      endIndex: 274,
      reason: 'Request ID UUID',
    },
    {
      value: '3f4e5d6c-7b8a-9c0d-1e2f-3a4b5c6d7e8f',
      shouldMatch: true,
      startIndex: 334,
      endIndex: 370,
      reason: 'Transaction ID UUID',
    },
  ],
  category: 'logs',
}

// packages/core/src/test-samples/uuid/api-responses.ts
var uuidAPIResponses = {
  id: 'uuid-api-responses',
  name: 'UUIDs in API Responses',
  content: `{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
  "session_token": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  "created_at": "2024-11-28T10:30:15Z"
}`,
  expectedMatches: [
    {
      value: '550e8400-e29b-41d4-a716-446655440000',
      shouldMatch: true,
      startIndex: 11,
      endIndex: 47,
      reason: 'ID field UUID',
    },
    {
      value: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
      shouldMatch: true,
      startIndex: 64,
      endIndex: 100,
      reason: 'User ID UUID in JSON',
    },
    {
      value: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
      shouldMatch: true,
      startIndex: 122,
      endIndex: 158,
      reason: 'Session token UUID',
    },
  ],
  category: 'logs',
}

// packages/core/src/test-samples/uuid/false-positives.ts
var uuidFalsePositives = {
  id: 'uuid-false-positives',
  name: 'Similar Patterns vs UUIDs',
  content: `Not UUID: 12345678-1234-1234-1234-123456789012 (too short segments)
Not UUID: gggggggg-hhhh-iiii-jjjj-kkkkkkkkkkkk (invalid hex)
Invalid: 550e8400-e29b-41d4-a716 (incomplete)

Valid UUIDs:
ID: 550e8400-e29b-41d4-a716-446655440000
Ref: 6ba7b810-9dad-11d1-80b4-00c04fd430c8`,
  expectedMatches: [
    {
      value: '12345678-1234-1234-1234-123456789012',
      shouldMatch: false,
      startIndex: 10,
      endIndex: 46,
      reason: 'Wrong format - all digits',
    },
    {
      value: 'gggggggg-hhhh-iiii-jjjj-kkkkkkkkkkkk',
      shouldMatch: false,
      startIndex: 78,
      endIndex: 114,
      reason: 'Invalid hex characters',
    },
    {
      value: '550e8400-e29b-41d4-a716',
      shouldMatch: false,
      startIndex: 151,
      endIndex: 175,
      reason: 'Incomplete UUID',
    },
    {
      value: '550e8400-e29b-41d4-a716-446655440000',
      shouldMatch: true,
      startIndex: 198,
      endIndex: 234,
      reason: 'Valid UUID',
    },
    {
      value: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
      shouldMatch: true,
      startIndex: 241,
      endIndex: 277,
      reason: 'Valid UUID',
    },
  ],
  category: 'logs',
}

// packages/core/src/test-samples/file-path/windows.ts
var filePathWindows = {
  id: 'file-path-windows',
  name: 'Windows File Paths',
  content: `Config file: C:\\Users\\admin\\config.json
Log file: D:\\Logs\\application\\app.log
Program: C:\\Program Files\\MyApp\\bin\\app.exe

Network path: \\\\server\\share\\documents\\file.txt
Relative: .\\local\\data\\settings.ini`,
  expectedMatches: [
    {
      value: 'C:\\Users\\admin\\config.json',
      shouldMatch: true,
      startIndex: 13,
      endIndex: 40,
      reason: 'Windows absolute path',
    },
    {
      value: 'D:\\Logs\\application\\app.log',
      shouldMatch: true,
      startIndex: 52,
      endIndex: 79,
      reason: 'Log file path',
    },
    {
      value: 'C:\\Program Files\\MyApp\\bin\\app.exe',
      shouldMatch: true,
      startIndex: 90,
      endIndex: 124,
      reason: 'Program path with spaces',
    },
    {
      value: '\\\\server\\share\\documents\\file.txt',
      shouldMatch: true,
      startIndex: 140,
      endIndex: 172,
      reason: 'UNC network path',
    },
    {
      value: '.\\local\\data\\settings.ini',
      shouldMatch: true,
      startIndex: 184,
      endIndex: 209,
      reason: 'Relative Windows path',
    },
  ],
  category: 'logs',
}

// packages/core/src/test-samples/file-path/unix.ts
var filePathUnix = {
  id: 'file-path-unix',
  name: 'Unix/Linux File Paths',
  content: `Config: /etc/nginx/nginx.conf
Log: /var/log/application/app.log
Binary: /usr/local/bin/myapp

Home directory: /home/user/documents/file.txt
Tmp file: /tmp/upload_abc123.tmp`,
  expectedMatches: [
    {
      value: '/etc/nginx/nginx.conf',
      shouldMatch: true,
      startIndex: 8,
      endIndex: 29,
      reason: 'Config file in /etc',
    },
    {
      value: '/var/log/application/app.log',
      shouldMatch: true,
      startIndex: 35,
      endIndex: 64,
      reason: 'Log file path',
    },
    {
      value: '/usr/local/bin/myapp',
      shouldMatch: true,
      startIndex: 74,
      endIndex: 94,
      reason: 'Binary executable path',
    },
    {
      value: '/home/user/documents/file.txt',
      shouldMatch: true,
      startIndex: 113,
      endIndex: 143,
      reason: 'User home directory path',
    },
    {
      value: '/tmp/upload_abc123.tmp',
      shouldMatch: true,
      startIndex: 155,
      endIndex: 177,
      reason: 'Temporary file path',
    },
  ],
  category: 'logs',
}

// packages/core/src/test-samples/file-path/relative.ts
var filePathRelative = {
  id: 'file-path-relative',
  name: 'Relative File Paths',
  content: `Config: ../config/settings.json
Data: ./data/users.db
Parent: ../../shared/lib/utils.js

Current dir: ./index.html
Nested: ../../../root/file.txt`,
  expectedMatches: [
    {
      value: '../config/settings.json',
      shouldMatch: true,
      startIndex: 8,
      endIndex: 31,
      reason: 'Parent directory relative path',
    },
    {
      value: './data/users.db',
      shouldMatch: true,
      startIndex: 39,
      endIndex: 55,
      reason: 'Current directory relative path',
    },
    {
      value: '../../shared/lib/utils.js',
      shouldMatch: true,
      startIndex: 65,
      endIndex: 90,
      reason: 'Two levels up relative path',
    },
    {
      value: './index.html',
      shouldMatch: true,
      startIndex: 105,
      endIndex: 117,
      reason: 'Current directory file',
    },
    {
      value: '../../../root/file.txt',
      shouldMatch: true,
      startIndex: 127,
      endIndex: 149,
      reason: 'Multiple levels up',
    },
  ],
  category: 'code',
}

// packages/core/src/test-samples/file-path/error-logs.ts
var filePathErrorLogs = {
  id: 'file-path-error-logs',
  name: 'File Paths in Stack Traces',
  content: `Error: Cannot read file
  at readFile (/usr/local/app/lib/fileReader.js:45:12)
  at process (/usr/local/app/controllers/dataController.js:123:8)
  at main (/usr/local/app/index.js:10:3)

Windows stack trace:
  at loadConfig (C:\\App\\lib\\config.js:67:15)`,
  expectedMatches: [
    {
      value: '/usr/local/app/lib/fileReader.js',
      shouldMatch: true,
      startIndex: 41,
      endIndex: 73,
      reason: 'File path in Unix stack trace',
    },
    {
      value: '/usr/local/app/controllers/dataController.js',
      shouldMatch: true,
      startIndex: 95,
      endIndex: 140,
      reason: 'Controller file in stack trace',
    },
    {
      value: '/usr/local/app/index.js',
      shouldMatch: true,
      startIndex: 159,
      endIndex: 182,
      reason: 'Entry file in stack trace',
    },
    {
      value: 'C:\\App\\lib\\config.js',
      shouldMatch: true,
      startIndex: 226,
      endIndex: 246,
      reason: 'Windows path in stack trace',
    },
  ],
  category: 'logs',
}

// packages/core/src/test-samples/file-path/false-positives.ts
var filePathFalsePositives = {
  id: 'file-path-false-positives',
  name: 'URLs vs File Paths',
  content: `URL: https://example.com/path/to/page (not a file path)
Email path-like: user/admin@example.com (not a file path)
Math: 10/5/2 = 1 (not a path)

Valid file paths:
Unix: /var/log/app.log
Windows: C:\\Users\\admin\\file.txt`,
  expectedMatches: [
    {
      value: 'https://example.com/path/to/page',
      shouldMatch: false,
      startIndex: 5,
      endIndex: 38,
      reason: 'HTTP URL, not a file path',
    },
    {
      value: 'user/admin@example.com',
      shouldMatch: false,
      startIndex: 74,
      endIndex: 96,
      reason: 'Email address, not a path',
    },
    {
      value: '10/5/2',
      shouldMatch: false,
      startIndex: 121,
      endIndex: 127,
      reason: 'Math expression',
    },
    {
      value: '/var/log/app.log',
      shouldMatch: true,
      startIndex: 166,
      endIndex: 182,
      reason: 'Valid Unix file path',
    },
    {
      value: 'C:\\Users\\admin\\file.txt',
      shouldMatch: true,
      startIndex: 193,
      endIndex: 216,
      reason: 'Valid Windows file path',
    },
  ],
  category: 'code',
}

// packages/core/src/test-samples/ipv6/standard.ts
var ipv6Standard = {
  id: 'ipv6-standard',
  name: 'Standard IPv6 Addresses',
  content: `Server: 2001:0db8:85a3:0000:0000:8a2e:0370:7334
Client: 2001:0db8:0001:0000:0000:0ab9:C0A8:0102
Gateway: fe80:0000:0000:0000:0202:b3ff:fe1e:8329

DNS: 2606:4700:4700:0000:0000:0000:0000:1111
CDN: 2400:cb00:2048:0001:0000:0000:6ca2:c344`,
  expectedMatches: [
    {
      value: '2001:0db8:85a3:0000:0000:8a2e:0370:7334',
      shouldMatch: true,
      startIndex: 8,
      endIndex: 47,
      reason: 'Full IPv6 address',
    },
    {
      value: '2001:0db8:0001:0000:0000:0ab9:C0A8:0102',
      shouldMatch: true,
      startIndex: 56,
      endIndex: 95,
      reason: 'IPv6 with uppercase hex',
    },
    {
      value: 'fe80:0000:0000:0000:0202:b3ff:fe1e:8329',
      shouldMatch: true,
      startIndex: 105,
      endIndex: 144,
      reason: 'Link-local IPv6 address',
    },
    {
      value: '2606:4700:4700:0000:0000:0000:0000:1111',
      shouldMatch: true,
      startIndex: 151,
      endIndex: 190,
      reason: 'Cloudflare DNS IPv6',
    },
    {
      value: '2400:cb00:2048:0001:0000:0000:6ca2:c344',
      shouldMatch: true,
      startIndex: 197,
      endIndex: 236,
      reason: 'CDN IPv6 address',
    },
  ],
  category: 'network',
}

// packages/core/src/test-samples/ipv6/compressed.ts
var ipv6Compressed = {
  id: 'ipv6-compressed',
  name: 'Compressed IPv6 Addresses',
  content: `Localhost: ::1
Loopback: 0000:0000:0000:0000:0000:0000:0000:0001
Link-local: fe80::1
Unspecified: ::

Compressed: 2001:db8::1
Full form: 2001:0db8:0000:0000:0000:0000:0000:0001`,
  expectedMatches: [
    {
      value: '::1',
      shouldMatch: true,
      startIndex: 11,
      endIndex: 14,
      reason: 'Localhost IPv6 compressed',
    },
    {
      value: '0000:0000:0000:0000:0000:0000:0000:0001',
      shouldMatch: true,
      startIndex: 26,
      endIndex: 65,
      reason: 'Localhost full form',
    },
    {
      value: 'fe80::1',
      shouldMatch: true,
      startIndex: 79,
      endIndex: 86,
      reason: 'Link-local compressed',
    },
    {
      value: '::',
      shouldMatch: true,
      startIndex: 101,
      endIndex: 103,
      reason: 'Unspecified address',
    },
    {
      value: '2001:db8::1',
      shouldMatch: true,
      startIndex: 117,
      endIndex: 128,
      reason: 'Compressed IPv6',
    },
    {
      value: '2001:0db8:0000:0000:0000:0000:0000:0001',
      shouldMatch: true,
      startIndex: 141,
      endIndex: 180,
      reason: 'Expanded form',
    },
  ],
  category: 'network',
}

// packages/core/src/test-samples/ipv6/network-config.ts
var ipv6NetworkConfig = {
  id: 'ipv6-network-config',
  name: 'IPv6 in Network Configuration',
  content: `# IPv6 Configuration
interface eth0
  inet6 add 2001:0db8:85a3::8a2e:0370:7334/64
  gateway fe80::1

# DNS Servers
nameserver 2606:4700:4700::1111
nameserver 2606:4700:4700::1001`,
  expectedMatches: [
    {
      value: '2001:0db8:85a3::8a2e:0370:7334',
      shouldMatch: true,
      startIndex: 59,
      endIndex: 88,
      reason: 'IPv6 address in config',
    },
    {
      value: 'fe80::1',
      shouldMatch: true,
      startIndex: 103,
      endIndex: 110,
      reason: 'Gateway IPv6',
    },
    {
      value: '2606:4700:4700::1111',
      shouldMatch: true,
      startIndex: 139,
      endIndex: 159,
      reason: 'DNS server IPv6',
    },
    {
      value: '2606:4700:4700::1001',
      shouldMatch: true,
      startIndex: 172,
      endIndex: 192,
      reason: 'Secondary DNS IPv6',
    },
  ],
  category: 'config',
}

// packages/core/src/test-samples/ipv6/mixed.ts
var ipv6Mixed = {
  id: 'ipv6-mixed',
  name: 'IPv4-Mapped IPv6 Addresses',
  content: `IPv4-mapped: ::ffff:192.0.2.1
Alternative: 0000:0000:0000:0000:0000:ffff:192.0.2.128
Hybrid: ::ffff:c000:0201

Pure IPv6: 2001:db8::1
Pure IPv4: 192.168.1.1`,
  expectedMatches: [
    {
      value: '::ffff:192.0.2.1',
      shouldMatch: true,
      startIndex: 13,
      endIndex: 29,
      reason: 'IPv4-mapped IPv6',
    },
    {
      value: '192.0.2.1',
      shouldMatch: true,
      startIndex: 20,
      endIndex: 29,
      reason: 'IPv4 part of mapped address',
    },
    {
      value: '0000:0000:0000:0000:0000:ffff:192.0.2.128',
      shouldMatch: true,
      startIndex: 44,
      endIndex: 85,
      reason: 'Full form IPv4-mapped',
    },
    {
      value: '192.0.2.128',
      shouldMatch: true,
      startIndex: 74,
      endIndex: 85,
      reason: 'IPv4 in full form',
    },
    {
      value: '::ffff:c000:0201',
      shouldMatch: true,
      startIndex: 95,
      endIndex: 111,
      reason: 'IPv4-mapped in hex',
    },
    {
      value: '2001:db8::1',
      shouldMatch: true,
      startIndex: 125,
      endIndex: 136,
      reason: 'Pure IPv6',
    },
    {
      value: '192.168.1.1',
      shouldMatch: true,
      startIndex: 150,
      endIndex: 161,
      reason: 'Pure IPv4',
    },
  ],
  category: 'network',
}

// packages/core/src/test-samples/ipv6/false-positives.ts
var ipv6FalsePositives = {
  id: 'ipv6-false-positives',
  name: 'Hex Codes vs IPv6',
  content: `Color code: #2001db (not IPv6)
Hash: deadbeef1234567890abcdef12345678 (not IPv6)
MAC address: 2001:0db8:85a3:0000:0000 (incomplete IPv6)

Valid IPv6:
Address: 2001:0db8:85a3:0000:0000:8a2e:0370:7334
Compressed: fe80::1`,
  expectedMatches: [
    {
      value: '#2001db',
      shouldMatch: false,
      startIndex: 12,
      endIndex: 19,
      reason: 'Hex color code',
    },
    {
      value: 'deadbeef1234567890abcdef12345678',
      shouldMatch: false,
      startIndex: 37,
      endIndex: 69,
      reason: 'Long hex hash',
    },
    {
      value: '2001:0db8:85a3:0000:0000',
      shouldMatch: false,
      startIndex: 95,
      endIndex: 119,
      reason: 'Incomplete IPv6 (only 5 groups)',
    },
    {
      value: '2001:0db8:85a3:0000:0000:8a2e:0370:7334',
      shouldMatch: true,
      startIndex: 146,
      endIndex: 185,
      reason: 'Valid full IPv6',
    },
    {
      value: 'fe80::1',
      shouldMatch: true,
      startIndex: 199,
      endIndex: 206,
      reason: 'Valid compressed IPv6',
    },
  ],
  category: 'network',
}

// packages/core/src/test-samples/index.ts
var ALL_TEST_SAMPLES = {
  // IPv4
  'ipv4-apache-log': ipv4ApacheLog,
  'ipv4-cidr-notation': ipv4CidrNotation,
  'ipv4-false-positives': ipv4FalsePositives,
  'ipv4-docker-networks': ipv4DockerNetworks,
  'ipv4-kubernetes-pods': ipv4KubernetesPods,
  // Email
  'email-standard-formats': emailStandardFormats,
  'email-plus-addressing': emailPlusAddressing,
  'email-international': emailInternational,
  'email-false-positives': emailFalsePositives,
  'email-edge-cases': emailEdgeCases,
  // Phone
  'phone-us-formats': phoneUSFormats,
  'phone-international': phoneInternational,
  'phone-vanity-numbers': phoneVanityNumbers,
  'phone-false-positives': phoneFalsePositives,
  'phone-parentheses': phoneParentheses,
  // SSN
  'ssn-standard-format': ssnStandardFormat,
  'ssn-false-positives': ssnFalsePositives,
  'ssn-context-aware': ssnContextAware,
  'ssn-masked': ssnMasked,
  'ssn-edge-cases': ssnEdgeCases,
  // Credit Card
  'credit-card-visa': creditCardVisa,
  'credit-card-mastercard': creditCardMastercard,
  'credit-card-amex': creditCardAmex,
  'credit-card-no-spaces': creditCardNoSpaces,
  'credit-card-false-positives': creditCardFalsePositives,
  // MAC Address
  'mac-address-colon-format': macAddressColonFormat,
  'mac-address-dash-format': macAddressDashFormat,
  'mac-address-cisco-format': macAddressCiscoFormat,
  'mac-address-lowercase': macAddressLowercase,
  'mac-address-network-config': macAddressNetworkConfig,
  // Hostname
  'hostname-fqdn': hostnameFQDN,
  'hostname-subdomains': hostnameSubdomains,
  'hostname-urls': hostnameURLs,
  'hostname-dns-records': hostnameDNSRecords,
  'hostname-false-positives': hostnameFalsePositives,
  // Ticket
  'ticket-case-format': ticketCaseFormat,
  'ticket-ticket-hash': ticketHashFormat,
  'ticket-jira-format': ticketJiraFormat,
  'ticket-support-logs': ticketSupportLogs,
  'ticket-false-positives': ticketFalsePositives,
  // Name
  'name-full-names': nameFullNames,
  'name-first-only': nameFirstOnly,
  'name-last-only': nameLastOnly,
  'name-support-tickets': nameSupportTickets,
  'name-false-positives': nameFalsePositives,
  // UUID
  'uuid-standard': uuidStandard,
  'uuid-uppercase': uuidUppercase,
  'uuid-log-files': uuidLogFiles,
  'uuid-api-responses': uuidAPIResponses,
  'uuid-false-positives': uuidFalsePositives,
  // File Path
  'file-path-windows': filePathWindows,
  'file-path-unix': filePathUnix,
  'file-path-relative': filePathRelative,
  'file-path-error-logs': filePathErrorLogs,
  'file-path-false-positives': filePathFalsePositives,
  // IPv6
  'ipv6-standard': ipv6Standard,
  'ipv6-compressed': ipv6Compressed,
  'ipv6-network-config': ipv6NetworkConfig,
  'ipv6-mixed': ipv6Mixed,
  'ipv6-false-positives': ipv6FalsePositives,
}
function getTestSample(id) {
  return ALL_TEST_SAMPLES[id]
}
function getTestSamplesForPattern(patternName) {
  const prefix = patternName
    .toLowerCase()
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
  return Object.keys(ALL_TEST_SAMPLES)
    .filter(id => id.startsWith(prefix))
    .map(id => ALL_TEST_SAMPLES[id])
}
function getAllTestSampleIds() {
  return Object.keys(ALL_TEST_SAMPLES)
}
function getTestSamplesByCategory(category) {
  return Object.values(ALL_TEST_SAMPLES).filter(
    sample => sample.category === category
  )
}
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
  DEFAULT_CONFIG,
  DataRedactor,
  EmailPattern,
  FilePathPattern,
  FormatPreservingStrategy,
  HostnamePattern,
  IPv4Pattern,
  IPv6Pattern,
  MACAddressPattern,
  MaskStrategy,
  NamePattern,
  PRESETS,
  PasswordScenario,
  PatternTestEngine,
  PhonePattern,
  PrivateKeyScenario,
  RedactionContext,
  SSNPattern,
  TicketNumberPattern,
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
