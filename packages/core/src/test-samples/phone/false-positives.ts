import { TestSample } from '../../types'

export const phoneFalsePositives: TestSample = {
  id: 'phone-false-positives',
  name: 'Order Numbers vs Phone Numbers',
  content: `Order number: ORD-555-123-4567
Product code: SKU-800-999-8888
Serial: ABC123-456-7890
Date format: 2024-12-25-1234

Valid phone numbers:
Customer: (555) 123-4567
Support: 1-800-555-0100`,
  expectedMatches: [
    {
      value: 'ORD-555-123-4567',
      shouldMatch: false,
      startIndex: 14,
      endIndex: 30,
      reason: 'Order number, not a phone',
    },
    {
      value: 'SKU-800-999-8888',
      shouldMatch: false,
      startIndex: 46,
      endIndex: 62,
      reason: 'Product SKU, not a phone',
    },
    {
      value: 'ABC123-456-7890',
      shouldMatch: false,
      startIndex: 72,
      endIndex: 87,
      reason: 'Serial number with letters',
    },
    {
      value: '2024-12-25-1234',
      shouldMatch: false,
      startIndex: 102,
      endIndex: 117,
      reason: 'Date format',
    },
    {
      value: '(555) 123-4567',
      shouldMatch: true,
      startIndex: 151,
      endIndex: 165,
      reason: 'Valid phone number',
    },
    {
      value: '1-800-555-0100',
      shouldMatch: true,
      startIndex: 176,
      endIndex: 190,
      reason: 'Valid toll-free number',
    },
  ],
  category: 'logs',
}
