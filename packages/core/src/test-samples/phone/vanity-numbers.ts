import { TestSample } from '../../types'

export const phoneVanityNumbers: TestSample = {
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
