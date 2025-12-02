import { TestSample } from '../../types'

export const filePathRelative: TestSample = {
  id: 'file-path-relative',
  name: 'Relative File Paths',
  content: `Config: ../config/settings.json
Data: ./data/users.db
Parent: ../../shared/lib/utils.js

Current dir: ./index.html
Nested: ../../../root/file.txt`,
  expectedMatches: [
    {
      value: '../config/settings.json',
      shouldMatch: true,
      startIndex: 8,
      endIndex: 31,
      reason: 'Parent directory relative path',
    },
    {
      value: './data/users.db',
      shouldMatch: true,
      startIndex: 39,
      endIndex: 55,
      reason: 'Current directory relative path',
    },
    {
      value: '../../shared/lib/utils.js',
      shouldMatch: true,
      startIndex: 65,
      endIndex: 90,
      reason: 'Two levels up relative path',
    },
    {
      value: './index.html',
      shouldMatch: true,
      startIndex: 105,
      endIndex: 117,
      reason: 'Current directory file',
    },
    {
      value: '../../../root/file.txt',
      shouldMatch: true,
      startIndex: 127,
      endIndex: 149,
      reason: 'Multiple levels up',
    },
  ],
  category: 'code',
}
