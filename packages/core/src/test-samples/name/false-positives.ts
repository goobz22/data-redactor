import { TestSample } from '../../types'

export const nameFalsePositives: TestSample = {
  id: 'name-false-positives',
  name: 'Brand Names vs People Names',
  content: `Company: Apple Computer
Brand: Amazon Web Services
Product: Microsoft Office

Valid person names:
Customer: John Smith
Contact: Sarah Johnson`,
  expectedMatches: [
    {
      value: 'Apple',
      shouldMatch: false,
      startIndex: 9,
      endIndex: 14,
      reason: 'Brand name, not a person',
    },
    {
      value: 'Amazon',
      shouldMatch: false,
      startIndex: 33,
      endIndex: 39,
      reason: 'Company name, not a person',
    },
    {
      value: 'Microsoft',
      shouldMatch: false,
      startIndex: 63,
      endIndex: 72,
      reason: 'Company name, not a person',
    },
    {
      value: 'John Smith',
      shouldMatch: true,
      startIndex: 109,
      endIndex: 119,
      reason: 'Valid person name',
    },
    {
      value: 'Sarah Johnson',
      shouldMatch: true,
      startIndex: 130,
      endIndex: 143,
      reason: 'Valid person name',
    },
  ],
  category: 'support-ticket',
}
