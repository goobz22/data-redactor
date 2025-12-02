import { TestSample } from '../../types'

export const creditCardVisa: TestSample = {
  id: 'credit-card-visa',
  name: 'Visa Card Numbers',
  content: `Visa Card: 4532-1234-5678-9010
Alternative: 4556-7890-1234-5678
No dashes: 4532123456789010
With spaces: 4556 7890 1234 5678

Payment method: Visa ending in 9010
Full number: 4916-5432-1098-7654`,
  expectedMatches: [
    {
      value: '4532-1234-5678-9010',
      shouldMatch: true,
      startIndex: 11,
      endIndex: 30,
      reason: 'Visa card with dashes (starts with 4)',
    },
    {
      value: '4556-7890-1234-5678',
      shouldMatch: true,
      startIndex: 45,
      endIndex: 64,
      reason: 'Visa card with dashes',
    },
    {
      value: '4532123456789010',
      shouldMatch: true,
      startIndex: 76,
      endIndex: 92,
      reason: 'Visa card without separators',
    },
    {
      value: '4556 7890 1234 5678',
      shouldMatch: true,
      startIndex: 106,
      endIndex: 125,
      reason: 'Visa card with spaces',
    },
    {
      value: '4916-5432-1098-7654',
      shouldMatch: true,
      startIndex: 177,
      endIndex: 196,
      reason: 'Visa card number',
    },
  ],
  category: 'support-ticket',
}
