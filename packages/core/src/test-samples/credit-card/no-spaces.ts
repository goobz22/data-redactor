import { TestSample } from '../../types'

export const creditCardNoSpaces: TestSample = {
  id: 'credit-card-no-spaces',
  name: 'Credit Cards Without Separators',
  content: `Visa: 4532123456789010
Mastercard: 5425233430109903
Amex: 371449635398431
Discover: 6011111111111117

For comparison with dashes:
Visa: 4532-1234-5678-9010
Mastercard: 5425-2334-3010-9903`,
  expectedMatches: [
    {
      value: '4532123456789010',
      shouldMatch: true,
      startIndex: 6,
      endIndex: 22,
      reason: 'Visa without separators',
    },
    {
      value: '5425233430109903',
      shouldMatch: true,
      startIndex: 36,
      endIndex: 52,
      reason: 'Mastercard without separators',
    },
    {
      value: '371449635398431',
      shouldMatch: true,
      startIndex: 59,
      endIndex: 74,
      reason: 'Amex 15 digits',
    },
    {
      value: '6011111111111117',
      shouldMatch: true,
      startIndex: 85,
      endIndex: 101,
      reason: 'Discover card',
    },
    {
      value: '4532-1234-5678-9010',
      shouldMatch: true,
      startIndex: 137,
      endIndex: 156,
      reason: 'Visa with dashes',
    },
    {
      value: '5425-2334-3010-9903',
      shouldMatch: true,
      startIndex: 170,
      endIndex: 189,
      reason: 'Mastercard with dashes',
    },
  ],
  category: 'support-ticket',
}
