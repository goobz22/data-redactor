import { TestSample } from '../../types'

export const filePathFalsePositives: TestSample = {
  id: 'file-path-false-positives',
  name: 'URLs vs File Paths',
  content: `URL: https://example.com/path/to/page (not a file path)
Email path-like: user/admin@example.com (not a file path)
Math: 10/5/2 = 1 (not a path)

Valid file paths:
Unix: /var/log/app.log
Windows: C:\\Users\\admin\\file.txt`,
  expectedMatches: [
    {
      value: 'https://example.com/path/to/page',
      shouldMatch: false,
      startIndex: 5,
      endIndex: 38,
      reason: 'HTTP URL, not a file path',
    },
    {
      value: 'user/admin@example.com',
      shouldMatch: false,
      startIndex: 74,
      endIndex: 96,
      reason: 'Email address, not a path',
    },
    {
      value: '10/5/2',
      shouldMatch: false,
      startIndex: 121,
      endIndex: 127,
      reason: 'Math expression',
    },
    {
      value: '/var/log/app.log',
      shouldMatch: true,
      startIndex: 166,
      endIndex: 182,
      reason: 'Valid Unix file path',
    },
    {
      value: 'C:\\Users\\admin\\file.txt',
      shouldMatch: true,
      startIndex: 193,
      endIndex: 216,
      reason: 'Valid Windows file path',
    },
  ],
  category: 'code',
}
