import { TestSample } from '../../types'

export const filePathUnix: TestSample = {
  id: 'file-path-unix',
  name: 'Unix/Linux File Paths',
  content: `Config: /etc/nginx/nginx.conf
Log: /var/log/application/app.log
Binary: /usr/local/bin/myapp

Home directory: /home/user/documents/file.txt
Tmp file: /tmp/upload_abc123.tmp`,
  expectedMatches: [
    {
      value: '/etc/nginx/nginx.conf',
      shouldMatch: true,
      startIndex: 8,
      endIndex: 29,
      reason: 'Config file in /etc',
    },
    {
      value: '/var/log/application/app.log',
      shouldMatch: true,
      startIndex: 35,
      endIndex: 64,
      reason: 'Log file path',
    },
    {
      value: '/usr/local/bin/myapp',
      shouldMatch: true,
      startIndex: 74,
      endIndex: 94,
      reason: 'Binary executable path',
    },
    {
      value: '/home/user/documents/file.txt',
      shouldMatch: true,
      startIndex: 113,
      endIndex: 143,
      reason: 'User home directory path',
    },
    {
      value: '/tmp/upload_abc123.tmp',
      shouldMatch: true,
      startIndex: 155,
      endIndex: 177,
      reason: 'Temporary file path',
    },
  ],
  category: 'logs',
}
