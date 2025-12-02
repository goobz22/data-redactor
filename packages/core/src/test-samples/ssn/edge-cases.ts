import { TestSample } from '../../types'

export const ssnEdgeCases: TestSample = {
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
