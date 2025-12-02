import { TestSample } from '../../types'

export const ssnContextAware: TestSample = {
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
