import { TestSample } from '../../types'

export const phoneParentheses: TestSample = {
  id: 'phone-parentheses',
  name: 'Phone Numbers with Parentheses Edge Cases',
  content: `Standard: (555) 123-4567
Full wrap: (555-123-4567)
Area code only: (800)555-1234
With country: 1-(555)-123-4567

No parentheses: 555-123-4567
Mixed format: (555).123.4567`,
  expectedMatches: [
    {
      value: '(555) 123-4567',
      shouldMatch: true,
      startIndex: 10,
      endIndex: 24,
      reason: 'Standard format with area code in parens',
    },
    {
      value: '(555-123-4567)',
      shouldMatch: true,
      startIndex: 37,
      endIndex: 51,
      reason: 'Entire number wrapped in parens',
    },
    {
      value: '(800)555-1234',
      shouldMatch: true,
      startIndex: 69,
      endIndex: 82,
      reason: 'Area code with no space',
    },
    {
      value: '1-(555)-123-4567',
      shouldMatch: true,
      startIndex: 98,
      endIndex: 114,
      reason: 'Country code with area code in parens',
    },
    {
      value: '555-123-4567',
      shouldMatch: true,
      startIndex: 133,
      endIndex: 145,
      reason: 'No parentheses format',
    },
    {
      value: '(555).123.4567',
      shouldMatch: true,
      startIndex: 161,
      endIndex: 175,
      reason: 'Mixed parens and dots',
    },
  ],
  category: 'support-ticket',
}
