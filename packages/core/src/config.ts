import type { RedactorConfig, PatternConfig } from './types';

export const DEFAULT_CONFIG: RedactorConfig = {
  formatOptions: {
    tokenFormat: '[{TYPE}_{INDEX}]',
    maskChar: '*',
    preserveStructure: true,
  },
  patterns: {
    ipv4: {
      enabled: true,
      strategy: 'token',
      regex: '(?<![0-9])(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:/\\d{1,2})?(?![0-9])',
    },
    ipv6: {
      enabled: true,
      strategy: 'token',
      regex: '(?:[0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}',
    },
    macAddress: {
      enabled: true,
      strategy: 'token',
      regex: '(?:(?:[0-9A-Fa-f]{2}[:-]){5}[0-9A-Fa-f]{2})|(?:(?:[0-9A-Fa-f]{4}\\.){2}[0-9A-Fa-f]{4})',
    },
    email: {
      enabled: true,
      strategy: 'token',
      regex: '\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b',
    },
    phone: {
      enabled: true,
      strategy: 'token',
      regex: '(?<![A-Za-z0-9])(?:\\+?1[-\\.\\s]?)?(?:\\(\\d{3}\\)\\s?\\d{3}[-\\.\\s]?\\d{4}|\\(\\d{3}[-\\.\\s]?\\d{3}[-\\.\\s]?\\d{4}\\)|\\d{3}[-\\.\\s]?\\d{3}[-\\.\\s]?\\d{4}|\\d{3}[-\\.\\s]?[A-Za-z]{7}|\\d{3}[-\\.\\s]?[A-Za-z]{3}[-\\.\\s]?[A-Za-z]{4})(?![A-Za-z0-9])',
    },
    ssn: {
      enabled: true,
      strategy: 'token',
      regex: '\\b\\d{3}-\\d{2}-\\d{4}\\b',
    },
    creditCard: {
      enabled: true,
      strategy: 'token',
      regex: '(?<!\\d)(?:\\d{4}[-\\s]?){3,4}\\d{1,4}(?!\\d)|(?<!\\d)\\d{13,19}(?!\\d)',
    },
    creditCardLast4: {
      enabled: true,
      strategy: 'token',
      regex: '(?:(?:card|payment|account)\\s+)?(?:ending\\s+in\\s+|ends\\s+in\\s+|last\\s+(?:4|four)(?:\\s+digits)?[\\s:]+)\\d{4}(?!\\d)|(?:\\*{4,})\\d{4}(?!\\d)',
      flags: 'i',
    },
    hostname: {
      enabled: true,
      strategy: 'token',
      regex: '\\b(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\\.)+[a-zA-Z]{2,}\\b',
    },
    ticketNumber: {
      enabled: true,
      strategy: 'token',
      regex: '(?:ticket|case)\\s*[#:-]?\\s*\\d+',
      flags: 'i',
    },
    name: {
      enabled: true,
      strategy: 'token',
      // No default regex - built dynamically from name databases (8849 names)
      // Custom regex can be provided if needed
    },
    custom: [],
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

Payment Information:
- Primary Card: 4532-1234-5678-9010
- Backup Card: 5425233430109903
- Card ending in 9010
- AmEx: 378282246310005

Issue Description:
Customer contacted us from IP 203.0.113.45 regarding server api.internal.company.net connection issues.
Contact support@company.com or call 1-555-FLOWERS for assistance.`,
};

export class ConfigLoader {
  static loadFromFile(path: string): RedactorConfig {
    // Check if we're in a Node.js environment
    if (typeof process !== 'undefined' && process.versions && process.versions.node) {
      try {
        // Dynamic import for Node.js only
        const fs = require('fs');
        const content = fs.readFileSync(path, 'utf-8');
        const config = JSON.parse(content);
        return this.mergeWithDefaults(config);
      } catch (error) {
        throw new Error(`Failed to load config from ${path}: ${error}`);
      }
    } else {
      throw new Error('loadFromFile is only available in Node.js environments. Use loadFromObject instead.');
    }
  }

  static loadFromObject(config: Partial<RedactorConfig>): RedactorConfig {
    return this.mergeWithDefaults(config);
  }

  static getDefault(): RedactorConfig {
    return JSON.parse(JSON.stringify(DEFAULT_CONFIG));
  }

  private static mergeWithDefaults(config: Partial<RedactorConfig>): RedactorConfig {
    const merged: RedactorConfig = {
      patterns: {
        ...DEFAULT_CONFIG.patterns,
        ...config.patterns,
      },
      customEntities: {
        ...DEFAULT_CONFIG.customEntities,
        ...config.customEntities,
      },
    };

    return merged;
  }

  static validateConfig(config: RedactorConfig): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate pattern strategies
    if (config.patterns) {
      const validStrategies = ['token', 'mask', 'formatPreserving'];

      Object.entries(config.patterns).forEach(([key, value]) => {
        if (key === 'custom') {
          const customPatterns = value as any[];
          customPatterns?.forEach((pattern, index) => {
            if (!pattern.name) {
              errors.push(`Custom pattern at index ${index} is missing 'name'`);
            }
            if (!pattern.regex) {
              errors.push(`Custom pattern '${pattern.name}' is missing 'regex'`);
            }
            if (!validStrategies.includes(pattern.strategy)) {
              errors.push(`Custom pattern '${pattern.name}' has invalid strategy: ${pattern.strategy}`);
            }
            // Test if regex is valid
            try {
              new RegExp(pattern.regex, pattern.flags || '');
            } catch (e) {
              errors.push(`Custom pattern '${pattern.name}' has invalid regex: ${e}`);
            }
          });
        } else {
          const patternConfig = value as PatternConfig;
          if (patternConfig && !validStrategies.includes(patternConfig.strategy)) {
            errors.push(`Pattern '${key}' has invalid strategy: ${patternConfig.strategy}`);
          }
        }
      });
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
