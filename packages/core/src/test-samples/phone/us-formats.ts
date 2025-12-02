import { TestSample } from '../../types'

export const phoneUSFormats: TestSample = {
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
