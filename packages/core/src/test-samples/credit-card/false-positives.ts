import { TestSample } from '../../types'

export const creditCardFalsePositives: TestSample = {
  id: 'credit-card-false-positives',
  name: 'Long Numbers vs Credit Cards',
  content: `Order ID: 9876-5432-1098-7654 (starts with 9, not valid card)
Account: 1234-5678-9012-3456 (starts with 1, not valid card)
Tracking: 8765-4321-0987-6543 (starts with 8, not valid card)

Valid credit cards:
Visa: 4532-1234-5678-9010
Mastercard: 5425-2334-3010-9903`,
  expectedMatches: [
    {
      value: '9876-5432-1098-7654',
      shouldMatch: false,
      startIndex: 10,
      endIndex: 29,
      reason: 'Not a valid card prefix (9)',
    },
    {
      value: '1234-5678-9012-3456',
      shouldMatch: false,
      startIndex: 73,
      endIndex: 92,
      reason: 'Not a valid card prefix (1)',
    },
    {
      value: '8765-4321-0987-6543',
      shouldMatch: false,
      startIndex: 137,
      endIndex: 156,
      reason: 'Not a valid card prefix (8)',
    },
    {
      value: '4532-1234-5678-9010',
      shouldMatch: true,
      startIndex: 190,
      endIndex: 209,
      reason: 'Valid Visa card',
    },
    {
      value: '5425-2334-3010-9903',
      shouldMatch: true,
      startIndex: 223,
      endIndex: 242,
      reason: 'Valid Mastercard',
    },
  ],
  category: 'logs',
}
