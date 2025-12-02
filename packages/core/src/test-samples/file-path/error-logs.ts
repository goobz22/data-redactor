import { TestSample } from '../../types'

export const filePathErrorLogs: TestSample = {
  id: 'file-path-error-logs',
  name: 'File Paths in Stack Traces',
  content: `Error: Cannot read file
  at readFile (/usr/local/app/lib/fileReader.js:45:12)
  at process (/usr/local/app/controllers/dataController.js:123:8)
  at main (/usr/local/app/index.js:10:3)

Windows stack trace:
  at loadConfig (C:\\App\\lib\\config.js:67:15)`,
  expectedMatches: [
    {
      value: '/usr/local/app/lib/fileReader.js',
      shouldMatch: true,
      startIndex: 41,
      endIndex: 73,
      reason: 'File path in Unix stack trace',
    },
    {
      value: '/usr/local/app/controllers/dataController.js',
      shouldMatch: true,
      startIndex: 95,
      endIndex: 140,
      reason: 'Controller file in stack trace',
    },
    {
      value: '/usr/local/app/index.js',
      shouldMatch: true,
      startIndex: 159,
      endIndex: 182,
      reason: 'Entry file in stack trace',
    },
    {
      value: 'C:\\App\\lib\\config.js',
      shouldMatch: true,
      startIndex: 226,
      endIndex: 246,
      reason: 'Windows path in stack trace',
    },
  ],
  category: 'logs',
}
