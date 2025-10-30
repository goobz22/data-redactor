import { BasePattern } from './base';
import type { RedactionStrategy } from '../types';

// Import name databases - these will be bundled for browser use
import maleNamesData from 'datasets-male-first-names-en';
import femaleNamesData from 'datasets-female-first-names-en';
import * as lastNamesModule from 'common-last-names';

const maleNames: string[] = maleNamesData || [];
const femaleNames: string[] = femaleNamesData || [];
const lastNames: string[] = (lastNamesModule as any).all || [];

export class EmailPattern extends BasePattern {
  constructor(strategy: RedactionStrategy = 'token', enabled: boolean = true) {
    // Match email addresses
    const regex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
    super('email', regex, strategy, enabled);
  }
}

export class PhonePattern extends BasePattern {
  constructor(strategy: RedactionStrategy = 'token', enabled: boolean = true) {
    // Match various phone number formats including vanity numbers with letters
    // Formats supported:
    // - Standard: 555-123-4567, 555.123.4567, 555 123 4567
    // - With parens: (555) 123-4567, (555-123-4567)
    // - With country: 1-555-123-4567, +1-555-123-4567
    // - Vanity: 1-555-SUPPORT, 555-FLOWERS, 1-800-CALL-NOW
    // Using alphanumeric boundaries to handle both digits and letters
    const regex = /(?<![A-Za-z0-9])(?:\+?1[-.\s]?)?(?:\(\d{3}\)\s?\d{3}[-.\s]?\d{4}|\(\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\)|\d{3}[-.\s]?\d{3}[-.\s]?\d{4}|\d{3}[-.\s]?[A-Za-z]{7}|\d{3}[-.\s]?[A-Za-z]{3}[-.\s]?[A-Za-z]{4})(?![A-Za-z0-9])/;
    super('phone', regex, strategy, enabled);
  }
}

export class SSNPattern extends BasePattern {
  constructor(strategy: RedactionStrategy = 'token', enabled: boolean = true) {
    // Match Social Security Numbers (XXX-XX-XXXX)
    const regex = /\b\d{3}-\d{2}-\d{4}\b/;
    super('ssn', regex, strategy, enabled);
  }
}

export class NamePattern extends BasePattern {
  constructor(strategy: RedactionStrategy = 'token', enabled: boolean = true) {
    // Build regex from name databases
    // Combine all first names and last names
    const allFirstNames = [...maleNames, ...femaleNames];
    const allNames = [...allFirstNames, ...lastNames];

    // Escape special regex characters and create pattern
    const escapedNames = allNames.map(name => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

    // Sort by length (longest first) to match longer names before shorter ones
    escapedNames.sort((a, b) => b.length - a.length);

    // Match full names (FirstName LastName) or individual names in context
    // Patterns: "Name: John Doe", "John Doe", individual names with word boundaries
    const namesPattern = escapedNames.join('|');
    const regex = new RegExp(`\\b(?:${namesPattern})(?:\\s+(?:${namesPattern}))?\\b`, 'i');

    super('name', regex, strategy, enabled);
  }
}
