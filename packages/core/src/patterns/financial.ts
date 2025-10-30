import { BasePattern } from './base';
import type { RedactionStrategy } from '../types';

export class CreditCardPattern extends BasePattern {
  constructor(strategy: RedactionStrategy = 'token', enabled: boolean = true) {
    // Match credit card numbers (13-19 digits with optional spaces or dashes)
    // Using negative lookahead/lookbehind to avoid matching within larger numbers
    // Note: Redacts all sequences that look like credit cards for security,
    // regardless of Luhn validation. Better to be overly cautious.
    const regex = /(?<!\d)(?:\d{4}[-\s]?){3,4}\d{1,4}(?!\d)|(?<!\d)\d{13,19}(?!\d)/;
    super('creditCard', regex, strategy, enabled);
  }
}

export class CreditCardLast4Pattern extends BasePattern {
  constructor(strategy: RedactionStrategy = 'token', enabled: boolean = true) {
    // Match credit card last 4 digits in common contexts
    // Patterns: "Card ending in 1234", "ending in 1234", "ends in 1234", "last 4: 1234"
    // Also matches standalone patterns like "****1234"
    // Optionally captures prefix words like "card", "payment", etc. for better context
    const regex = /(?:(?:card|payment|account)\s+)?(?:ending\s+in\s+|ends\s+in\s+|last\s+(?:4|four)(?:\s+digits)?[\s:]+)\d{4}(?!\d)|(?:\*{4,})\d{4}(?!\d)/i;
    super('creditCardLast4', regex, strategy, enabled);
  }
}
