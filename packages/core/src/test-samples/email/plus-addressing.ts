import { TestSample } from '../../types'

export const emailPlusAddressing: TestSample = {
  id: 'email-plus-addressing',
  name: 'Email Plus Addressing',
  content: `User signed up with: john+newsletter@example.com
Another signup: jane+shopping@store.com
Tracking email: user+campaign2024@marketing.io
Filter test: admin+test123@company.net

Standard email for comparison: support@example.com`,
  expectedMatches: [
    {
      value: 'john+newsletter@example.com',
      shouldMatch: true,
      startIndex: 22,
      endIndex: 49,
      reason: 'Email with plus addressing for newsletter',
    },
    {
      value: 'jane+shopping@store.com',
      shouldMatch: true,
      startIndex: 66,
      endIndex: 89,
      reason: 'Email with plus addressing for shopping',
    },
    {
      value: 'user+campaign2024@marketing.io',
      shouldMatch: true,
      startIndex: 106,
      endIndex: 136,
      reason: 'Email with plus and numbers',
    },
    {
      value: 'admin+test123@company.net',
      shouldMatch: true,
      startIndex: 150,
      endIndex: 175,
      reason: 'Email with plus and alphanumeric tag',
    },
    {
      value: 'support@example.com',
      shouldMatch: true,
      startIndex: 212,
      endIndex: 231,
      reason: 'Standard email without plus',
    },
  ],
  category: 'logs',
}
