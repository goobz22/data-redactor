import { TestSample } from '../../types'

export const hostnameFalsePositives: TestSample = {
  id: 'hostname-false-positives',
  name: 'File Paths vs Hostnames',
  content: `File path: /var/www/html/index.html (not a hostname)
Local path: C:\\Users\\admin\\file.txt (not a hostname)
Relative: ../config/settings.json (not a hostname)

Valid hostnames:
Web: www.example.com
API: api.service.net`,
  expectedMatches: [
    {
      value: '/var/www/html/index.html',
      shouldMatch: false,
      startIndex: 11,
      endIndex: 35,
      reason: 'Unix file path',
    },
    {
      value: 'C:\\Users\\admin\\file.txt',
      shouldMatch: false,
      startIndex: 63,
      endIndex: 86,
      reason: 'Windows file path',
    },
    {
      value: '../config/settings.json',
      shouldMatch: false,
      startIndex: 113,
      endIndex: 136,
      reason: 'Relative path',
    },
    {
      value: 'www.example.com',
      shouldMatch: true,
      startIndex: 173,
      endIndex: 188,
      reason: 'Valid hostname',
    },
    {
      value: 'api.service.net',
      shouldMatch: true,
      startIndex: 195,
      endIndex: 210,
      reason: 'Valid hostname',
    },
  ],
  category: 'code',
}
