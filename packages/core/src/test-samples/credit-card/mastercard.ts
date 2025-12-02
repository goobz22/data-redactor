import { TestSample } from '../../types'

export const creditCardMastercard: TestSample = {
  id: 'credit-card-mastercard',
  name: 'Mastercard Numbers',
  content: `Mastercard: 5425-2334-3010-9903
Also Mastercard: 5105-1051-0510-5100
No separators: 5425233430109903
With spaces: 5105 1051 0510 5100

Card on file: 5555-5555-5555-4444
Backup card: 5425-1234-5678-9012`,
  expectedMatches: [
    {
      value: '5425-2334-3010-9903',
      shouldMatch: true,
      startIndex: 12,
      endIndex: 31,
      reason: 'Mastercard with dashes (starts with 5)',
    },
    {
      value: '5105-1051-0510-5100',
      shouldMatch: true,
      startIndex: 51,
      endIndex: 70,
      reason: 'Mastercard with dashes',
    },
    {
      value: '5425233430109903',
      shouldMatch: true,
      startIndex: 87,
      endIndex: 103,
      reason: 'Mastercard without separators',
    },
    {
      value: '5105 1051 0510 5100',
      shouldMatch: true,
      startIndex: 117,
      endIndex: 136,
      reason: 'Mastercard with spaces',
    },
    {
      value: '5555-5555-5555-4444',
      shouldMatch: true,
      startIndex: 152,
      endIndex: 171,
      reason: 'Mastercard on file',
    },
    {
      value: '5425-1234-5678-9012',
      shouldMatch: true,
      startIndex: 185,
      endIndex: 204,
      reason: 'Backup Mastercard',
    },
  ],
  category: 'support-ticket',
}
