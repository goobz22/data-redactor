import { TestSample } from '../../types'

export const ssnStandardFormat: TestSample = {
  id: 'ssn-standard-format',
  name: 'Standard SSN Format',
  content: `Employee SSN: 123-45-6789
Applicant: 987-65-4321
Record ID: 555-12-3456

Customer information:
Name: John Doe
SSN: 234-56-7890
DOB: 01/15/1985`,
  expectedMatches: [
    {
      value: '123-45-6789',
      shouldMatch: true,
      startIndex: 15,
      endIndex: 26,
      reason: 'Standard SSN format',
    },
    {
      value: '987-65-4321',
      shouldMatch: true,
      startIndex: 39,
      endIndex: 50,
      reason: 'Standard SSN format',
    },
    {
      value: '555-12-3456',
      shouldMatch: true,
      startIndex: 63,
      endIndex: 74,
      reason: 'Standard SSN format',
    },
    {
      value: '234-56-7890',
      shouldMatch: true,
      startIndex: 119,
      endIndex: 130,
      reason: 'SSN in customer record',
    },
  ],
  category: 'support-ticket',
}
