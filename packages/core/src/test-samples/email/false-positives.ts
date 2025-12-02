import { TestSample } from '../../types'

export const emailFalsePositives: TestSample = {
  id: 'email-false-positives',
  name: 'URLs That Look Like Emails',
  content: `Website URL: https://example.com/contact
File path: /home/user@hostname/file.txt
Not an email: user@localhost
Also not: test@192.168.1.1

Valid emails to catch:
Contact: admin@example.com
Support: help@company.org`,
  expectedMatches: [
    {
      value: 'https://example.com/contact',
      shouldMatch: false,
      startIndex: 13,
      endIndex: 40,
      reason: 'HTTPS URL, not an email',
    },
    {
      value: '/home/user@hostname/file.txt',
      shouldMatch: false,
      startIndex: 52,
      endIndex: 81,
      reason: 'File path with @ symbol',
    },
    {
      value: 'user@localhost',
      shouldMatch: false,
      startIndex: 96,
      endIndex: 110,
      reason: 'Invalid: no TLD',
    },
    {
      value: 'test@192.168.1.1',
      shouldMatch: false,
      startIndex: 122,
      endIndex: 138,
      reason: 'IP address instead of domain',
    },
    {
      value: 'admin@example.com',
      shouldMatch: true,
      startIndex: 170,
      endIndex: 187,
      reason: 'Valid email',
    },
    {
      value: 'help@company.org',
      shouldMatch: true,
      startIndex: 198,
      endIndex: 214,
      reason: 'Valid email',
    },
  ],
  category: 'code',
}
