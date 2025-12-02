import { TestSample } from '../../types'

export const ssnFalsePositives: TestSample = {
  id: 'ssn-false-positives',
  name: 'Date-like Patterns vs SSN',
  content: `Phone extension: 555-12-34567 (extra digit)
Date format: 12-31-2024 (not SSN)
Tracking: TRK-99-8877 (letters prefix)
Version: 10-15-2023

Valid SSNs:
Employee: 123-45-6789
Backup: 987-65-4321`,
  expectedMatches: [
    {
      value: '555-12-34567',
      shouldMatch: false,
      startIndex: 17,
      endIndex: 29,
      reason: 'Too many digits in last group',
    },
    {
      value: '12-31-2024',
      shouldMatch: false,
      startIndex: 55,
      endIndex: 65,
      reason: 'Date format, not SSN',
    },
    {
      value: 'TRK-99-8877',
      shouldMatch: false,
      startIndex: 80,
      endIndex: 91,
      reason: 'Has letter prefix',
    },
    {
      value: '10-15-2023',
      shouldMatch: false,
      startIndex: 116,
      endIndex: 126,
      reason: 'Date format',
    },
    {
      value: '123-45-6789',
      shouldMatch: true,
      startIndex: 151,
      endIndex: 162,
      reason: 'Valid SSN',
    },
    {
      value: '987-65-4321',
      shouldMatch: true,
      startIndex: 172,
      endIndex: 183,
      reason: 'Valid SSN',
    },
  ],
  category: 'logs',
}
