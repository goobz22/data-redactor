import { TestSample } from '../../types'

export const phoneInternational: TestSample = {
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
