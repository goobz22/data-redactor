import { TestSample } from '../../types'

export const filePathWindows: TestSample = {
  id: 'file-path-windows',
  name: 'Windows File Paths',
  content: `Config file: C:\\Users\\admin\\config.json
Log file: D:\\Logs\\application\\app.log
Program: C:\\Program Files\\MyApp\\bin\\app.exe

Network path: \\\\server\\share\\documents\\file.txt
Relative: .\\local\\data\\settings.ini`,
  expectedMatches: [
    {
      value: 'C:\\Users\\admin\\config.json',
      shouldMatch: true,
      startIndex: 13,
      endIndex: 40,
      reason: 'Windows absolute path',
    },
    {
      value: 'D:\\Logs\\application\\app.log',
      shouldMatch: true,
      startIndex: 52,
      endIndex: 79,
      reason: 'Log file path',
    },
    {
      value: 'C:\\Program Files\\MyApp\\bin\\app.exe',
      shouldMatch: true,
      startIndex: 90,
      endIndex: 124,
      reason: 'Program path with spaces',
    },
    {
      value: '\\\\server\\share\\documents\\file.txt',
      shouldMatch: true,
      startIndex: 140,
      endIndex: 172,
      reason: 'UNC network path',
    },
    {
      value: '.\\local\\data\\settings.ini',
      shouldMatch: true,
      startIndex: 184,
      endIndex: 209,
      reason: 'Relative Windows path',
    },
  ],
  category: 'logs',
}
