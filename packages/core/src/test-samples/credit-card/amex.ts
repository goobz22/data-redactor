import { TestSample } from '../../types'

export const creditCardAmex: TestSample = {
  id: 'credit-card-amex',
  name: 'American Express Numbers',
  content: `Amex card: 3782-822463-10005
Alternative: 371449635398431 (no dashes)
With spaces: 3714 496353 98431

Corporate Amex: 3787-344936-71000
Personal: 3400-0000-0000-009`,
  expectedMatches: [
    {
      value: '3782-822463-10005',
      shouldMatch: true,
      startIndex: 11,
      endIndex: 28,
      reason: 'Amex 15-digit format (3-6-5)',
    },
    {
      value: '371449635398431',
      shouldMatch: true,
      startIndex: 43,
      endIndex: 58,
      reason: 'Amex without separators',
    },
    {
      value: '3714 496353 98431',
      shouldMatch: true,
      startIndex: 81,
      endIndex: 98,
      reason: 'Amex with spaces (4-6-5 format)',
    },
    {
      value: '3787-344936-71000',
      shouldMatch: true,
      startIndex: 116,
      endIndex: 133,
      reason: 'Corporate Amex',
    },
    {
      value: '3400-0000-0000-009',
      shouldMatch: true,
      startIndex: 145,
      endIndex: 163,
      reason: 'Amex format (starts with 34)',
    },
  ],
  category: 'support-ticket',
}
