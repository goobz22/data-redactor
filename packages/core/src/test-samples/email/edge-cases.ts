import { TestSample } from '../../types'

export const emailEdgeCases: TestSample = {
  id: 'email-edge-cases',
  name: 'Email Edge Cases',
  content: `Hyphenated domain: user@my-company.com
Numbered local: user123@example.com
Dots and dashes: first.last@sub-domain.example.com
Percent sign: user%dept@company.com
Multiple dots: very.long.address.name@example.com

In sentence: Contact us at support@example.com for help.
Quoted: "admin@example.com"`,
  expectedMatches: [
    {
      value: 'user@my-company.com',
      shouldMatch: true,
      startIndex: 20,
      endIndex: 39,
      reason: 'Email with hyphenated domain',
    },
    {
      value: 'user123@example.com',
      shouldMatch: true,
      startIndex: 57,
      endIndex: 76,
      reason: 'Email with numbers in local part',
    },
    {
      value: 'first.last@sub-domain.example.com',
      shouldMatch: true,
      startIndex: 94,
      endIndex: 128,
      reason: 'Email with dots and hyphens',
    },
    {
      value: 'user%dept@company.com',
      shouldMatch: true,
      startIndex: 144,
      endIndex: 165,
      reason: 'Email with percent sign',
    },
    {
      value: 'very.long.address.name@example.com',
      shouldMatch: true,
      startIndex: 181,
      endIndex: 215,
      reason: 'Email with multiple dots',
    },
    {
      value: 'support@example.com',
      shouldMatch: true,
      startIndex: 246,
      endIndex: 265,
      reason: 'Email in sentence context',
    },
    {
      value: 'admin@example.com',
      shouldMatch: true,
      startIndex: 285,
      endIndex: 302,
      reason: 'Quoted email',
    },
  ],
  category: 'support-ticket',
}
