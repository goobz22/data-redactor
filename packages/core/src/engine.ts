import type { RedactorConfig, RedactionResult, Match, Pattern } from './types';
import { ConfigLoader } from './config';
import {
  IPv4Pattern,
  IPv6Pattern,
  MACAddressPattern,
  HostnamePattern,
  EmailPattern,
  PhonePattern,
  SSNPattern,
  CreditCardPattern,
  CreditCardLast4Pattern,
  TicketNumberPattern,
  NamePattern,
  BasePattern,
} from './patterns';
import {
  RedactionContext,
  TokenStrategy,
  MaskStrategy,
  FormatPreservingStrategy,
} from './strategies';
import type { IRedactionStrategy } from './strategies';

export class DataRedactor {
  private config: RedactorConfig;
  private patterns: Pattern[] = [];
  private context: RedactionContext;
  private strategies: Map<string, IRedactionStrategy>;

  constructor(config?: Partial<RedactorConfig> | string) {
    console.log('[DataRedactor] Constructor called - VERSION WITH LOGGING');
    // Load config
    if (typeof config === 'string') {
      this.config = ConfigLoader.loadFromFile(config);
    } else if (config) {
      this.config = ConfigLoader.loadFromObject(config);
    } else {
      this.config = ConfigLoader.getDefault();
    }
    console.log('[DataRedactor] Config loaded:', this.config);

    // Validate config
    const validation = ConfigLoader.validateConfig(this.config);
    if (!validation.valid) {
      throw new Error(`Invalid configuration: ${validation.errors.join(', ')}`);
    }

    // Initialize strategies with format options
    const formatOptions = this.config.formatOptions;
    this.strategies = new Map<string, IRedactionStrategy>([
      ['token', new TokenStrategy(formatOptions)],
      ['mask', new MaskStrategy(formatOptions)],
      ['formatPreserving', new FormatPreservingStrategy(formatOptions)],
    ]);

    this.context = new RedactionContext();
    this.initializePatterns();
  }

  private initializePatterns(): void {
    const { patterns } = this.config;

    if (!patterns) return;

    // Initialize built-in patterns (with support for custom regex overrides)
    if (patterns.ipv4) {
      if (patterns.ipv4.regex) {
        const regex = new RegExp(patterns.ipv4.regex, patterns.ipv4.flags || '');
        this.patterns.push(
          new BasePattern('ipv4', regex, patterns.ipv4.strategy, patterns.ipv4.enabled)
        );
      } else {
        this.patterns.push(
          new IPv4Pattern(patterns.ipv4.strategy, patterns.ipv4.enabled)
        );
      }
    }

    if (patterns.ipv6) {
      if (patterns.ipv6.regex) {
        const regex = new RegExp(patterns.ipv6.regex, patterns.ipv6.flags || '');
        this.patterns.push(
          new BasePattern('ipv6', regex, patterns.ipv6.strategy, patterns.ipv6.enabled)
        );
      } else {
        this.patterns.push(
          new IPv6Pattern(patterns.ipv6.strategy, patterns.ipv6.enabled)
        );
      }
    }

    if (patterns.macAddress) {
      if (patterns.macAddress.regex) {
        const regex = new RegExp(patterns.macAddress.regex, patterns.macAddress.flags || '');
        this.patterns.push(
          new BasePattern('macAddress', regex, patterns.macAddress.strategy, patterns.macAddress.enabled)
        );
      } else {
        this.patterns.push(
          new MACAddressPattern(patterns.macAddress.strategy, patterns.macAddress.enabled)
        );
      }
    }

    if (patterns.email) {
      if (patterns.email.regex) {
        const regex = new RegExp(patterns.email.regex, patterns.email.flags || '');
        this.patterns.push(
          new BasePattern('email', regex, patterns.email.strategy, patterns.email.enabled)
        );
      } else {
        this.patterns.push(
          new EmailPattern(patterns.email.strategy, patterns.email.enabled)
        );
      }
    }

    if (patterns.phone) {
      if (patterns.phone.regex) {
        const regex = new RegExp(patterns.phone.regex, patterns.phone.flags || '');
        this.patterns.push(
          new BasePattern('phone', regex, patterns.phone.strategy, patterns.phone.enabled)
        );
      } else {
        this.patterns.push(
          new PhonePattern(patterns.phone.strategy, patterns.phone.enabled)
        );
      }
    }

    if (patterns.ssn) {
      if (patterns.ssn.regex) {
        const regex = new RegExp(patterns.ssn.regex, patterns.ssn.flags || '');
        this.patterns.push(
          new BasePattern('ssn', regex, patterns.ssn.strategy, patterns.ssn.enabled)
        );
      } else {
        this.patterns.push(
          new SSNPattern(patterns.ssn.strategy, patterns.ssn.enabled)
        );
      }
    }

    if (patterns.creditCard) {
      if (patterns.creditCard.regex) {
        const regex = new RegExp(patterns.creditCard.regex, patterns.creditCard.flags || '');
        this.patterns.push(
          new BasePattern('creditCard', regex, patterns.creditCard.strategy, patterns.creditCard.enabled)
        );
      } else {
        this.patterns.push(
          new CreditCardPattern(patterns.creditCard.strategy, patterns.creditCard.enabled)
        );
      }
    }

    if (patterns.creditCardLast4) {
      if (patterns.creditCardLast4.regex) {
        const regex = new RegExp(patterns.creditCardLast4.regex, patterns.creditCardLast4.flags || '');
        this.patterns.push(
          new BasePattern('creditCardLast4', regex, patterns.creditCardLast4.strategy, patterns.creditCardLast4.enabled)
        );
      } else {
        this.patterns.push(
          new CreditCardLast4Pattern(patterns.creditCardLast4.strategy, patterns.creditCardLast4.enabled)
        );
      }
    }

    if (patterns.hostname) {
      if (patterns.hostname.regex) {
        const regex = new RegExp(patterns.hostname.regex, patterns.hostname.flags || '');
        this.patterns.push(
          new BasePattern('hostname', regex, patterns.hostname.strategy, patterns.hostname.enabled)
        );
      } else {
        this.patterns.push(
          new HostnamePattern(patterns.hostname.strategy, patterns.hostname.enabled)
        );
      }
    }

    if (patterns.ticketNumber) {
      if (patterns.ticketNumber.regex) {
        const regex = new RegExp(patterns.ticketNumber.regex, patterns.ticketNumber.flags || '');
        this.patterns.push(
          new BasePattern('ticketNumber', regex, patterns.ticketNumber.strategy, patterns.ticketNumber.enabled)
        );
      } else {
        this.patterns.push(
          new TicketNumberPattern(patterns.ticketNumber.strategy, patterns.ticketNumber.enabled)
        );
      }
    }

    if (patterns.name) {
      if (patterns.name.regex) {
        const regex = new RegExp(patterns.name.regex, patterns.name.flags || '');
        this.patterns.push(
          new BasePattern('name', regex, patterns.name.strategy, patterns.name.enabled)
        );
      } else {
        this.patterns.push(
          new NamePattern(patterns.name.strategy, patterns.name.enabled)
        );
      }
    }

    // Initialize custom patterns
    if (patterns.custom) {
      patterns.custom.forEach((customPattern) => {
        const regex = new RegExp(customPattern.regex, customPattern.flags || '');
        this.patterns.push(
          new BasePattern(customPattern.name, regex, customPattern.strategy, true)
        );
      });
    }

    // Add custom entity patterns
    if (this.config.customEntities) {
      Object.entries(this.config.customEntities).forEach(([type, values]) => {
        if (values && values.length > 0) {
          // Create a pattern that matches any of the custom entity values
          const escapedValues = values.map(v => v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
          const regex = new RegExp(`\\b(${escapedValues.join('|')})\\b`, 'gi');
          this.patterns.push(
            new BasePattern(type, regex, 'token', true)
          );
        }
      });
    }
  }

  redact(text: string): RedactionResult {
    console.log('[DataRedactor] redact() called with text:', text.substring(0, 200));
    console.log('[DataRedactor] Number of patterns:', this.patterns.length);
    // Find all matches
    const allMatches: Match[] = [];

    this.patterns.forEach((pattern) => {
      console.log('[DataRedactor] Checking pattern:', pattern.name, 'enabled:', pattern.enabled);
      if (pattern.enabled) {
        const matches = pattern.findAll(text);
        console.log('[DataRedactor] Pattern', pattern.name, 'found', matches.length, 'matches');
        allMatches.push(...matches);
      }
    });

    // Remove overlapping matches (keep the first one found)
    const nonOverlappingMatches = this.removeOverlaps(allMatches);

    // Sort matches by start position (descending) to replace from end to start
    nonOverlappingMatches.sort((a, b) => b.start - a.start);

    // Apply redactions
    let redactedText = text;
    nonOverlappingMatches.forEach((match) => {
      const strategy = this.strategies.get(match.strategy);
      if (strategy) {
        const replacement = this.context.getOrCreateRedaction(
          match.value,
          match.type,
          strategy
        );

        redactedText =
          redactedText.substring(0, match.start) +
          replacement +
          redactedText.substring(match.end);
      }
    });

    return {
      redactedText,
      mapping: this.context.getMapping(),
      matches: nonOverlappingMatches.reverse(), // Return in original order
    };
  }

  private removeOverlaps(matches: Match[]): Match[] {
    const result: Match[] = [];
    const sorted = [...matches].sort((a, b) => a.start - b.start);

    sorted.forEach((match) => {
      const overlaps = result.some((existing) => {
        return (
          (match.start >= existing.start && match.start < existing.end) ||
          (match.end > existing.start && match.end <= existing.end) ||
          (match.start <= existing.start && match.end >= existing.end)
        );
      });

      if (!overlaps) {
        result.push(match);
      }
    });

    return result;
  }

  reset(): void {
    this.context.clear();
  }

  getConfig(): RedactorConfig {
    return JSON.parse(JSON.stringify(this.config));
  }

  updateConfig(config: Partial<RedactorConfig>): void {
    this.config = ConfigLoader.loadFromObject({
      ...this.config,
      ...config,
    });

    // Reinitialize strategies with new format options
    const formatOptions = this.config.formatOptions;
    this.strategies = new Map<string, IRedactionStrategy>([
      ['token', new TokenStrategy(formatOptions)],
      ['mask', new MaskStrategy(formatOptions)],
      ['formatPreserving', new FormatPreservingStrategy(formatOptions)],
    ]);

    this.patterns = [];
    this.initializePatterns();
    this.reset();
  }
}
