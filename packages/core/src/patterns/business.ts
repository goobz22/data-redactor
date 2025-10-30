import { BasePattern } from './base';
import type { RedactionStrategy } from '../types';

export class TicketNumberPattern extends BasePattern {
  constructor(strategy: RedactionStrategy = 'token', enabled: boolean = true) {
    // Match ticket/case numbers in common formats
    // Patterns: "Ticket #12345", "Case 12345", "ticket: 12345", "CASE-12345"
    // Matches the entire phrase including the label for context
    const regex = /(?:ticket|case)\s*[#:-]?\s*\d+/i;
    super('ticketNumber', regex, strategy, enabled);
  }
}
