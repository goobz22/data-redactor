import { TestSample } from '../../types'

export const ssnMasked: TestSample = {
  id: 'ssn-masked',
  name: 'Masked SSN Formats',
  content: `Partially masked: XXX-XX-1234 (shouldn't match)
Also masked: ***-**-5678 (shouldn't match)
Full SSN displayed: 123-45-6789

For security, we show: XXX-XX-9012
Complete number needed: 234-56-7890`,
  expectedMatches: [
    {
      value: 'XXX-XX-1234',
      shouldMatch: false,
      startIndex: 18,
      endIndex: 29,
      reason: 'Partially masked with X',
    },
    {
      value: '***-**-5678',
      shouldMatch: false,
      startIndex: 56,
      endIndex: 67,
      reason: 'Partially masked with asterisks',
    },
    {
      value: '123-45-6789',
      shouldMatch: true,
      startIndex: 104,
      endIndex: 115,
      reason: 'Full unmasked SSN',
    },
    {
      value: 'XXX-XX-9012',
      shouldMatch: false,
      startIndex: 142,
      endIndex: 153,
      reason: 'Partially masked',
    },
    {
      value: '234-56-7890',
      shouldMatch: true,
      startIndex: 178,
      endIndex: 189,
      reason: 'Full unmasked SSN',
    },
  ],
  category: 'support-ticket',
}
